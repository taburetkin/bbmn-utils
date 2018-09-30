import isEmptyValue from '../is-empty-value/index.js';

function pstoSetPair(context, pair, options){
	if (!_.isString(pair) || pair === '') return;

	let keyvalue = pair.split('=');
	let key = keyvalue.shift();
	let value = keyvalue.join('=');
	pstoSetKeyValue(context, key, value, options);
}

function pstoSetKeyValue(context, key, value, options){
		
	if (isEmptyValue(key) || isEmptyValue(value)) return;

	key = decodeURIComponent(key);
	value = decodeURIComponent(value);

	let transform = options.transform;
	if(_.isFunction(transform)) {
		value = transform(key, value, options);
	}

	if(!(key in context)) {
		context[key] = value;
		return value;
	}

	if (!_.isArray(context[key])) {
		context[key] = [context[key]];
	}

	context[key].push(value);

	return context[key];
}

export default function paramsToObject(raw, options = {}) {
	let emptyObject = options.emptyObject !== false;
	let result = {};
	if(!_.isString(raw)) return emptyObject ? result : raw;

	let pairs = raw.split('&');
	_(pairs).each((pair) => pstoSetPair(result, pair, options));
	
	if (!_.size(result) && !emptyObject) {
		return raw;
	}

	return result;
}
