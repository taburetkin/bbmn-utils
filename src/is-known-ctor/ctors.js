import { Model, Collection, BackboneView, Router, MnObject, Region, BaseClass } from 'bbmn-core';
import Mn from 'backbone.marionette';

const ctors = _.reduce([
	Model, Collection, BackboneView, Router, MnObject, Region, BaseClass
], (ctors, ctor) => {
	if(_.isFunction(ctor)){
		ctors.push(ctor);
	}
}, []);


let tryGetFromMn = ['Application', 'AppRouter'];

_.each(tryGetFromMn, ClassName => {
	_.isFunction(Mn[ClassName]) && ctors.push(Mn[ClassName]);
});


export default ctors;
