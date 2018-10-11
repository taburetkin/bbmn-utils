import _ from 'underscore';
import getByKey, { isCtor } from './get-by-key.js';


export default function buildByKey(context, key, getOptions = {}){
	let buildContext = getByKey(context, key, getOptions);

	if (!_.isObject(buildContext)) {
		return;
	}

	let { buildText, ctor, checkCtor, knownCtor, toArguments } = getOptions;

	let { value, definition, options } = buildContext;

	if(!_.isFunction(toArguments))
		toArguments = (context, definition, options) => [options];

	

	let args = toArguments.call(context, context, definition, options);
	
	if (value != null) {
		if (!_.isObject(value)) {
			if (_.isFunction(buildText)) {
				return buildText(value, ...args);
			}
		} else {
			if (isCtor(value.constructor, ctor, checkCtor, knownCtor)) {
				return value;
			}
		}
	} else {
		return new definition(...args);
	}


}
