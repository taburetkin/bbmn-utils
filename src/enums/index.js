// import getFlag from '../get-flag/index.js';
// import hasFlag from '../has-flag/index.js';
import { getFlag, hasFlag } from '../flags/index.js';

import getByPath from '../get-by-path/index.js';
import setByPath from '../set-by-path/index.js';
import isEmptyValue from '../is-empty-value/index.js';

export const enumsStore = {};

export const enumsApi = {
	getFlag,
	hasFlag,
	getByPath,
	setByPath,
	extendStore(hash){
		_.extend(enumsStore, hash);
	},
	getEnum(arg){
		if(_.isObject(arg)) {
			return arg;
		} else if(isEmptyValue(arg) || !_.isString(arg)){
			return;
		} 
	
		return enumsApi.getByPath(enumsStore, arg);
	}
};


export function get(arg, flag, options){
	if(arguments.length === 0) { return enumsStore; }

	let _enum = enumsApi.getEnum(arg);
	if (arguments.length === 1) {
		return _enum;		
	}
	
	return enumsApi.getFlag(_enum, flag, options);
}

export function has(arg, flag, options){
	let _enum = enumsApi.getEnum(arg);
	return enumsApi.hasFlag(_enum, flag, options);
}

export default {
	get,
	has,
	set(name, hash){
		if(_.isString(name)){
			enumsApi.setByPath(enumsStore, name, hash);
		} else if (_.isObject(name)){
			enumsApi.extendStore(name);
		}
	},
};
