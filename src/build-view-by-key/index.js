import _ from 'underscore';
import buildByKey from '../build-by-key/index.js';
import { isViewClass } from 'bbmn-core';



export default function buildViewByKey(context, key, options = {}) { //{ TextView, defaultOptions, options } = {}){
	/*
	let getOptions = {
		defaultOptions,
		options,
		checkCtor: (ctor) => isViewClass(ctor)
	};

	if (TextView != null && isViewClass(TextView)) {
		getOptions.buildText = (text, opts) => new TextView(_.extend({}, opts, { text }));
	}
	*/
	let { TextView } = options;

	let checkCtor = ctor => isViewClass(ctor);
	
	let buildText = TextView != null && isViewClass(TextView)
		? (text, opts) => new TextView(_.extend({}, opts, { text }))
		: undefined;

	let getOptions = _.extend({ checkCtor, buildText  }, options);

	return buildByKey(context, key, getOptions);
}
