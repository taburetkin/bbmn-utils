import _ from 'underscore';
import { isModel } from 'bbmn-core';

function isBadSource(src, flatted) {
	if (typeof global !== 'undefined' && src === global) {
		return true;
	} else if (typeof window !== 'undefined' && src === window) {
		return true;
	} else if(flatted.indexOf(src) > -1) {
		return true;
	}
}

export const privateApi = { 
	traverse(source, destination = {}, root = '', sources = []) {
		if(_.isFunction(source) || _.isArray(source)){
			return source;
		}
		if(isBadSource(source, sources)) { return; }
		sources.push(source);
		var hash = isModel(source) ? source.attributes : source;

		var props = Object.getOwnPropertyNames(hash);

		for (var x = 0; x < props.length; x++) {
			var name = props[x];
			var prop = hash[name];
			if (prop === undefined) {
				continue;
			}
			else if (_.isArray(prop)) {
				destination[root + name] = prop.slice(0);
			}
			else if (_.isDate(prop)) {
				destination[root + name] = new Date(prop.valueOf());
			}
			else if (!_.isObject(prop) || _.isFunction(prop)) {
				destination[root + name] = prop;
			}
			else {
				privateApi.traverse(prop, destination, root + name + '.', _.clone(sources));
			}
		}

		return destination;
	}
};

export default function flattenObject(obj) {
	if (_.isObject(obj)) { 
		return privateApi.traverse(obj);
	} 
}
