import _ from 'underscore';
import isEmptyValue from '../is-empty-value/index.js';

function pstoSetPair(context, pair, options){
	if (!_.isString(pair) || pair === '') return;

	let keyvalue = pair.split('=');
	let key = keyvalue.shift();
	let value = keyvalue.join('=');
	return pstoSetKeyValue(context, key, value, options);
}

function pstoSetKeyValue(context, key, value, options){
		
	if (isEmptyValue(key)) return;

	key = decodeURIComponent(key);
	value = decodeURIComponent(value);

	let transform = options.transform;
	if(_.isFunction(transform)) {
		value = transform(key, value, options);
	}

	if (isEmptyValue(value)) return;

	if (key in context) {
		if(!_.isArray(context[key])) {
			context[key] = [context[key]];
		}
		context[key].push(value);
	} else {
		context[key] = value;
	}
	return { key, value };
}

export default function paramsToObject(raw, options) {
	let emptyObject = options.emptyObject !== false;
	let result = {};
	if(!_.isString(raw)) return emptyObject ? result : undefined;

	let rawpairs = raw.split('&');
	let pairs = _(rawpairs).reduce((memo, rawpair) => {
		let pair = pstoSetPair(result, rawpair, options);
		if (pair != null) {
			memo.push(pair);
		}
		return memo;
	}, []);
	
	if (!_.size(result) && !emptyObject) {
		return;
	}

	return !options.asArray ? result : pairs;
}
