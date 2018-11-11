import _ from 'underscore';
import paramsToObject from './simple';
import setByPath from '../set-by-path';


function parseKey(raw){
	let chunks = raw.split('.');
	let _key = chunks.shift();
	let rest = chunks.join('.');
	chunks = _key.split('[');
	let key = chunks.shift();
	let index = chunks.length ? parseInt(chunks.shift().replace(/\D/g,''),10) : false;
	return {
		raw,
		key,
		rest,
		property: rest.split('.').shift() || undefined,
		index,
		notIndexed: index === false
	}
}

function buildKeyPath(k){
	let path = [];
	k.key && (path.push(k.key));
	path.push(k.index);
	k.property && (path.push(k.property));
	if(path.length != 3) return;
	return path.join('.');
}

export default function build(text, opts){

	var params = paramsToObject(text, _.extend({}, opts, { asArray: true }));

	var qs = {};
	let allmeeted = {};

	function hasMeet(k){
		let path = buildKeyPath(k);
		return path && (allmeeted[path] == true);
	}
	function markAsMeeted(k){
		let path = buildKeyPath(k);
		path && (allmeeted[path] = true);
	}

	_.each(params, ({ value, key }) => {

		let okey = parseKey(key);

		let stored = qs[okey.key];
		


		if (!stored) {
			if(!_.isNumber(okey.index)){
				okey.index = 0;
			}
			if(okey.property){
				let hash = {};
				setByPath(hash, okey.rest, value);
				value = hash;
				markAsMeeted(okey);
			}
			if(okey.index){
				let arr = [];
				arr[okey.index] = value;
				value = arr;
			}
			qs[okey.key] = value;
		} else {
			if (!_.isArray(stored)) {
				if(!_.isNumber(okey.index)){
					okey.index = 0;
				}
				let meeted = hasMeet(okey);
				if (okey.property) {
					if (!meeted) {
						let hash = !okey.index && _.isObject(stored) ? stored : {};
						setByPath(hash, okey.rest, value);
						markAsMeeted(okey);
						if(okey.index) {
							stored = [stored];
							stored[okey.index] = hash;
						}
					} else {
						stored = [stored];
						okey.index = stored.length;
						let hash = {};
						setByPath(hash, okey.rest, value);
						markAsMeeted(okey);
						stored.push(hash);
					}
				}
				else {
					stored = [stored];
					let index = okey.index || stored.length;
					stored[index] = value;
				}
			} else {
				if (okey.property) {
					if(!_.isNumber(okey.index)){
						okey.index = stored.length - 1;
					}
					let meeted = hasMeet(okey);
					if (!meeted) {
						let exists = stored[okey.index];
						let hash = exists || {};
						setByPath(hash, okey.rest, value);
						if (!exists){
							stored[okey.index] = hash;
						}
						markAsMeeted(okey);
					} else {
						let exists = !okey.notIndexed && stored[okey.index];
						let hash = exists || {};
						setByPath(hash, okey.rest, value);
						if(okey.notIndexed)
							okey.index = stored.length;
						markAsMeeted(okey);
						if(!exists)
							stored[okey.index] = hash;
					}
				}
				else {
					let index = okey.index || stored.length;
					stored[index] = value;
				}
			}
			qs[okey.key] = stored;
		}
	});
	return qs;
}
