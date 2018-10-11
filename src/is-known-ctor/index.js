import _ from 'underscore';
import knownCtors from './ctors.js';

function isKnownCtor(arg) {
	if(!_.isFunction(arg)) {
		return false;
	}
	return _(knownCtors).some((ctor) => arg === ctor || arg.prototype instanceof ctor);
}

export default isKnownCtor;
