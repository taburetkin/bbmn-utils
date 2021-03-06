import _ from 'underscore';
import { Model, Collection, BackboneView, Router, MnObject, Region, BaseClass } from 'bbmn-core';
import Mn from 'backbone.marionette';

const ctors = _.reduce([
	Model, Collection, BackboneView, Router, MnObject, Region, BaseClass
], (ctors, ctor) => {
	/* istanbul ignore next */
	if(_.isFunction(ctor)){
		ctors.push(ctor);
	}
	return ctors;
}, []);


let tryGetFromMn = ['Application', 'AppRouter'];

_.each(tryGetFromMn, ClassName => {
	_.isFunction(Mn[ClassName]) && ctors.push(Mn[ClassName]);
});


export default ctors;
