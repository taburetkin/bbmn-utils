
import converters from './converters.js';

//this is under development yet and can be change in any time
export default function convertString(text, type, opts) {

	if (!_.isString(type)) { 
		throw new Error('type should be a string');
	}

	const converter = converters[type];

	if (!_.isFunction(converter)) {
		throw new Error(`string converter ${type} is not a function`);
	}

	return converter(text, opts);
	
}
