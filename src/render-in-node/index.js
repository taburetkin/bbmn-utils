import _ from 'underscore';
import { Region } from 'bbmn-core';

export const config = {
	destroySelfOnEmpty: false,
	destroyOnEmpty: false,
	replaceElement: false,
};

const BaseNodeRegion = Region.extend({
	onEmpty() {
		let destroySelf = this.getOption('destroySelfOnEmpty') || this.getOption('destroyOnEmpty');
		let destroyNode = this.getOption('destroyOnEmpty');
		if (destroySelf) {
			this.destroy();
		}
		if (destroyNode) {
			this.el.remove();
		}
	},
});

config.Region = BaseNodeRegion;

function normalizeElement(selector) {
	let body = document.querySelector('body');
	let el;
	if (selector == null) {
		el = body;
	} else if( selector instanceof Element) {
		el = selector;
	}
	else if(selector && selector.jquery){
		el = selector.get(0);
	} else if (_.isString(selector)) {
		el = document.querySelector(selector);
	}
	if (el instanceof Element) {
		return el;
	} else {
		throw new Error('el must be in Dom');		
	}
}

const renderInNode  = function (view,  opts) {
	let options = _.extend({}, config, opts);
	let { el, replaceElement, destroySelfOnEmpty, destroyOnEmpty } = options;

	const NodeRegion = config.Region;
	el = normalizeElement(el);
	const body = document.querySelector('body');
	if (el === body) {
		el = document.createElement('div');
		body.appendChild(el);
		replaceElement = true;
	}
	const region = new NodeRegion({ el, replaceElement, destroySelfOnEmpty, destroyOnEmpty });
	region.show(view);
	return region;
};

renderInNode.config = config;

export default renderInNode;
