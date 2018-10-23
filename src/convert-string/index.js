import _ from 'underscore';
import converters from './converters.js';

//this is under development yet and can be change in any time
export default function convertString(text, type, options) {
	
	if (!_.isString(type)) { 
		return text;
	}

	const converter = converters[type];

	if (!_.isFunction(converter)) {
		return text;
	}

	return converter(text, options);
	
}
