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

export default function getByKey(context, key, { ctor, checkCtor, options, defaultOptions, invokeContext, invokeArguments } = {}){
	
	if(!_.isString(key)) { return; }
	
	let instance = getOption(context, key, { force: false, args: [ context ] });
	if (instance == null) {
		return;
	}
	!invokeContext && (invokeContext = context);
	!invokeArguments && (invokeArguments = [context]);
	if (shouldInvoke(instance, ctor, checkCtor)) {
		instance = instance.apply(invokeContext, invokeArguments);
	}

	let contextOptions = getOption(context, key + 'Options', { force: false, args: [ context ] });
	if (_.isFunction(contextOptions)) {
		contextOptions = contextOptions.apply(invokeContext, invokeArguments);
	}
	let compiledOptions = _.extend({}, defaultOptions, contextOptions, options);


	if(_.isFunction(instance)) {

		return {
			definition: instance,
			options: compiledOptions
		};
		
	}
	
	return { value: instance, options: compiledOptions };

}
