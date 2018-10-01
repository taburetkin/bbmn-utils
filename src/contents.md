# table of contents

* [betterResult](#betterResult) - like underscore `_.result` but better


* [buildViewByKey](#buildViewByKey) - helps construct view by given key, automaticaly looks for supplied class and options


* [camelCase](#camelCase) - converts `to:camel:case` string to `toCamelCase`


* [comparator](#comparator) - helper for **array sort**, allow to construct complex multy field compare iteratees


* [compareAB](#compareAB) - helper for array sort, simplifies comparing of backbone models and views.


* [compareObjects](#compareObjects) - deeply compares two given objects, `[1,2, {a: 1}]` equals to `[2, {a:1}, 1]`


* [convertString](#convertString) - converts argument to a given type: `convertString('yes','boolean')`. Supports out of the box **number** and **boolean**


* [enums](#enums) - enums helpers. allow to store your enums, check if an enum has some flags or get their text label value.


* [extend](#extend) - old good backbone `extend` method, for easy extending your definitions `MyClass.extend({ ... })`


* [getFlag](#getFlag) - takes flags value from given enum. supports multiple variation of use. one of it: `getFlag({ 1:'one', 2:'two', 3:'three' }, '1, 3') - 'one, three'`


* [hasFlag](#hasFlag) - checks if a given enum has given flags or no. 


* [flat](#flat) - flattens given object. `{ a: {b: 1} }` becames `{ 'a.b':1 }`


* [getByPath](#getByPath) - takes value from complex object by given path. Respects `Backbone.Model` attributes. `getByPath(someDeepObject, 'foo.bar.baz', options[optional])`


* [getOption](#getOption) - like marionette's `getOption` but with some special abilities. 


* [isEmptyValue](#isEmptyValue) - just checks argument for this `arg == null || arg === ''`


* [isKnownCtor](#isKnownCtor) - Checks if an argument is one of known ctors. Known ctors array can be extended by your wish and by default contains all backbone and marionette classes.


* [mergeObjects](#mergeObjects) - Deeply merges two or more objects. `mergeObjects({ a:{ b:1 } }, { b:0 })` result into `{ a: {b: 1}, b:0 }`


* [mergeOptions](#mergeOptions) - like marionette's `mergeOptions` but can work with multiple arguments.


* [mix](#mix) - helps to mixin definition. `let MyClass = mix(BaseClass).with(Mixin1, Mixin2, ...).extend({ ... })`


* [paramsToObject](#paramsToObject) - converts parameters string to an object. `paramsToObject('foo=bar&baz=baz')` results into `{ foo:'bar', baz: 'baz' }`


* [setByPath](#setByPath) - Sets value to a complex object by given path. Respects `Backbone.Model` and triggers change events if there are models on the way. `setByPath(myObject, 'foo.bar.baz', 'newvalue')`


* [skipTake](#skipTake) - skips `x` items and takes `n` items from array. `skipTake(array, takeN, skipX)`


* [takeFirst](#takeFirst) - Takes first founded value from given objects: `takeFirst('foo', options, this)`


* [toBool](#toBool) - Converts argument to boolean. Supports options for describing convert behavior.


* [triggerMethod](#triggerMethod) - Acts like marionette `triggerMethod`, also checks if an instance has `trigger` function.


* [triggerMethodOn](#triggerMethodOn) - Acts like old marionette `triggerMethodOn`, internally uses [triggerMethod](#triggerMethod)


* [unflat](#unflat) - Unflats given object. `{ 'a.b': 1 }` becames `{ a: { b: 1 } }`

