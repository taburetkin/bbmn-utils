import { isModel } from 'bbmn-core';

export const privateApi = { 
	traverse(source, destination = {}, root = '') {
	
		if (!_.isObject(source) || source === global) {
			return;
		}

		var hash = isModel(source) ? source.attributes : source;

		var props = Object.getOwnPropertyNames(hash);

		for (var x = 0; x < props.length; x++) {
			var name = props[x];
			var prop = hash[name];
			if (prop === undefined) {
				continue;
			}
			else if (_.isArray(prop)) {
				destination[root + name] = prop.slice(0);
			}
			else if (_.isDate(prop)) {
				destination[root + name] = new Date(prop.valueOf());
			}
			else if (!_.isObject(prop)) {
				destination[root + name] = prop;
			}
			else {
				privateApi.traverse(prop, destination, root + name + '.');
			}
		}

		return destination;
	}
};

export default function flattenObject(obj) {
	if (_.isObject(obj)) { 
		return privateApi.traverse(obj);
	} 
}
