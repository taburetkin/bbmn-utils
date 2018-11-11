import _ from 'underscore';
import simple from './simple.js';
import complex from './complex.js';
export default function paramsToObject(raw, options = {}){
	if (options.complex) {
		return complex(raw, _.omit(options, 'complex'));
	} else {
		return simple(raw, options);
	}
}
