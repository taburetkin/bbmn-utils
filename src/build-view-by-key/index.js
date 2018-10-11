import _ from 'underscore';
import buildByKey from '../build-by-key/index.js';
import { isViewClass } from 'bbmn-core';



export default function buildViewByKey(context, key, { TextView, options } = {}){
	let getOptions = {
		options,
		checkCtor: (ctor) => isViewClass(ctor)
	};

	if (TextView != null && isViewClass(TextView)) {
		getOptions.buildText = (text, opts) => new TextView(_.extend({}, opts, { text }));
	}

	return buildByKey(context, key, getOptions);
}
