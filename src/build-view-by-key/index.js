import getOption from '../get-option/index.js';
import { isView, isViewClass } from 'bbmn-core';

export default function buildViewByKey(context, key, { TextView, options } = {}) {
	
	if(!_.isString(key)) { return; }

	let view = getOption(context, key, { args: [ context ] });
	let _options = getOption(context, key + 'Options', { args: [ context ] });

	if (TextView && _.isString(view)) {
		_options = _.extend({}, _options, { text: view });
		view = TextView;
	}
	options = _.extend({}, options, _options);

	if (isView(view)) {
		return view;
	} else if (isViewClass(view)) {
		return new view(options);
	}	
}
