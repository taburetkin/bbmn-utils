import _ from 'underscore';
import { isModel } from 'bbmn-core';
import isEmptyValue from '../is-empty-value';
function getProperty(context, name, options = {})
{
	if (!_.isObject(context) || isEmptyValue(name)) { return; }

	
	if (isModel(context)) {
		let { noModelAttributes, includeModelProperty, modelPropertyFirst } = options;

		let attrValue = context.get(name, { gettingByPath: true  });
		let propValue = context[name];
		let value;

		if (noModelAttributes === true) {
			value = propValue;
		} else if (modelPropertyFirst) {
			value = propValue != null ? propValue : attrValue;
		} else if (includeModelProperty) {
			value = attrValue != null ? attrValue : propValue;
		} else {
			value = attrValue;
		}

		return value;
	}
	else {
		return context[name];
	}
}
export default getProperty;	
