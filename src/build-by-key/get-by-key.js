import _ from 'underscore';
import getOption from '../get-option/index.js';
import { isClass } from 'bbmn-core';
import isKnownCtor from '../is-known-ctor/index.js';

export function isCtor(instance, ctor, checkCtor){
	return (_.isFunction(ctor) && isClass(instance, ctor))
	|| (_.isFunction(checkCtor) && checkCtor(instance))
	|| isKnownCtor(instance);
}

function shouldInvoke(instance, ctor, checkCtor) {
	return _.isFunction(instance) && !isCtor(instance, ctor, checkCtor);
}

export default function getByKey(context, key, { ctor, checkCtor, options } = {}){
	
	if(!_.isString(key)) { return; }
	
	let instance = getOption(context, key, { force: false, args: [ context ] });
	if (instance == null) {
		return;
	}
	if (shouldInvoke(instance, ctor, checkCtor)) {
		instance = instance.call(context, context);
	}

	let contextOptions = getOption(context, key + 'Options', { args: [ context ] });
	let compiledOptions = _.extend({}, contextOptions, options);


	if(_.isFunction(instance)) {

		return {
			definition: instance,
			options: compiledOptions
		};
		
	}
	
	return { value: instance, options: compiledOptions };

}
