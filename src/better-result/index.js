import isKnownCtor from '../is-known-ctor/index.js';

export default function betterResult(obj = {}, key, opts = {})
{
	let { context, args, checkAlso, force } = opts;
	let defaultValue = opts.default;

	if (!_.isString(key) || key === '') { return; }
	
	let value = obj[key];

	if (value != null && (!_.isFunction(value) || isKnownCtor(value))) {
		return value;
	}
	
	if (force !== false && _.isFunction(value)) {
		value = value.apply(context || obj, args);
	}

	//let result = force !== false && _.isFunction(value) ? value.apply(context || obj, args) : value;

	if (value == null && _.isObject(checkAlso)) {
		let alsoOptions = _.omit(opts, 'checkAlso');
		value = betterResult(checkAlso, key, alsoOptions);
	}

	if (value == null && defaultValue != null ) {
		value = defaultValue;
	}

	return value;
}
