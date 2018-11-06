import _ from 'underscore';
import getProperty from './get-property.js';
import isEmptyValue from '../is-empty-value';

function getByPathArray(context, propertyName, pathArray, options) {
	
	if (!_.isObject(context) || isEmptyValue(propertyName))
		return;

	var prop = getProperty(context, propertyName, options);

	if (!pathArray.length || prop == null)
		return prop;

	var nextName = pathArray.shift();

	return getByPathArray(prop, nextName, pathArray, options);

}

export default getByPathArray;
