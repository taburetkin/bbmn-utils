import _ from 'underscore';
import getByPathArray from './get-by-path-array.js';
import isEmptyValue from '../is-empty-value';

export default function getByPath(obj, path, options) {

	if (!_.isObject(obj) || isEmptyValue(path)) return;

	var pathArray = _.isString(path) ? path.split('.')
		: _.isArray(path) ? [].slice.call(path)
			: [path];

	var prop = pathArray.shift();

	return getByPathArray(obj, prop, pathArray, options);

}
