import _ from 'underscore';
import isEmptyValue from '../is-empty-value/index.js';


export function normalizeStringArray(arr){
	return _.reduce(arr, (result, item) => {
		
		if (isEmptyValue(item)) { return result; }

		result.push(item.toString());
		return result;

	}, []);
}


export function normalizeArgument(value, options, returnObject) {

	if(_.isString(value)) {
		value = value.split(/\s*,\s*/gmi);
	}

	if (_.isArray(value)) {
		return normalizeStringArray(value, options);
	} else if (_.isObject(value) && returnObject) {
		return value;
	}

}


export function normalizeValueAndFlag(value, flag, options) {
	return {
		values: normalizeArgument(value, options, true),
		flags: normalizeArgument(flag, options)
	};
}

function compare(a, b, { caseSensitive }){
	
	if(!caseSensitive) {
		a = a.toLowerCase();
		b = b.toLowerCase();
	}
	
	return a === b;
}

export function searchFlags(values, flags,  options)
{
	let isArray = _.isArray(values);
	let { useObjectValues } = options;

	let result =_.reduce(values, (filtered, item, key) => {
		let check = item;
		if(!isArray && !useObjectValues){
			check = key;
		}
		
		let good = _.some(flags, flag => compare(check, flag, options));
	
		if (!good) { return filtered; }
	
		if (isArray) {
			filtered.push(check);
		} else {
			filtered.push({value: item, key });
		}

		return filtered;
	}, []);


	let all = options.all;
	if (
		!result.length 
		|| (all && result.length != values.length)
	) { 
		return; 
	}

	return result;
}
