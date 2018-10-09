import _ from 'underscore';
import { flat, unflat } from '../index.js';

function norm(arg) {
	return _.isObject(arg) ? arg : {};
}

export default function mergeObjects(...objects) {
	
	let flatted = _.reduce(objects, (dest, item) => {
		_.extend(dest, flat(norm(item)));
		return dest;
	}, {});

	return unflat(flatted);

}
