import getOption from '../get-option/index.js';
import { isView, isViewClass } from 'bbmn-core';

export default function buildViewByKey(key, { TextView, options } = {}) {
	
	if(!_.isString(key)) { return; }

	let view = getOption(this, key, { args: [ this ] });
	let _options = getOption(this, key + 'Options', { args: [ this ] });

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
