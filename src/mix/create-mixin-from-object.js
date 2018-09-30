export default function createMixinFromObject(arg) {

	let mixedObj = _.clone(arg);
	let ctor = mixedObj.hasOwnProperty('constructor') && _.isFunction(mixedObj.constructor) && mixedObj.constructor;
	let hasConstructor = _.isFunction(ctor);
		
	return Base => { 
		if (hasConstructor) {
			mixedObj.constructor = function mx(){
				Base.apply(this, arguments);
				ctor.apply(this, arguments);
			};
		}
		return Base.extend(mixedObj);
	};
}
