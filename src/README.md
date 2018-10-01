# table of contents

* [isCollection](#isCollection) - returns `true` if argument is a `Backbone.Collection` instance.


* [isCollectionClass](#isCollectionClass) - returns `true` if argument is a `Backbone.Collection` class.


* [isModel](#isModel) - returns `true` if argument is a `Backbone.Model` instance.


* [isModelClass](#isModelClass) - returns `true` if argument is a `Backbone.Model` class.


* [isView](#isView) - returns `true` if argument is a `Backbone.View` instance


* [isViewClass](#isViewClass) - returns `true` if argument is a `Backbone.View` class


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


# isCollection

returns `true` if argument is a `Backbone.Collection` instance.


# isCollectionClass

returns `true` if argument is a `Backbone.Collection` class.


# isModel

returns `true` if argument is a `Backbone.Model` instance.


# isModelClass

returns `true` if argument is a `Backbone.Model` class.


# isView

returns `true` if argument is a `Backbone.View` instance


# isViewClass

returns `true` if argument is a `Backbone.View` class


# betterResult

Acts almost as underscore [`_.result`](https://underscorejs.org/#result) but can invoke result function if its not one of well known constructors.  
This function was implemented for better expirience with `backbone` and `backbone.marionette` instances. It helps handle complex options which can be a function and helps getting not yet initialized options values. see examples.

```
import { betterResult } from 'bbmn-utils';
let result = betterResult( instance, 'propertyName', options);
```

> note:  
third argument is NOT a default value. default value should be passed through options.

### betterResult(context, key, options) 
returns value from context by given key
* **context**: object, required
* **key**: string, required  
* **options**: object, optional  

### options:
* **force**: boolean, default: `true` 
	> If **true** and returned **value is function** and it is not one of well known constructor will return result of this function. If **false** will return value **as is**
* **default**: any, default: not set
	> if returned value is null or undefined will return default instead.
* **context**: object, default: argument context
	> when result value is function this option will be used as context for calling value function.
* **args**: Array, default: not set
	> when result value is function this array will be passed to it as arguments
* **checkAlso**: object, default: not set	
	> when result value is null or undefined will check for same key in this object. 

### examples:
````javascript

const context = {
	foo:'foo',
	bar: (add) => 'bar + ' + (add || ''),
	View: Marionette.View
}

const checkAlso = {
	baz: (add) => 'ZZZ + ' + (add || '')
}

betterResult(context, 'foo');
// returns: "foo"
// like _.result(context, 'foo');

betterResult(context, 'baz', { default: 'default baz'});
// returns: "default baz"
// like _.result(context, 'foo', "default baz");

betterResult(context, 'bar');
// returns: "bar + "
// _.result will return func(add) => 'bar + ' + (add || '')

betterResult(context, 'View');
// returns: Marionette.View
// like _.result(context, 'View')

betterResult(context, 'bar', { force: false });
// returns: func(add) => 'bar + ' + (add || '')
// like _.result(context, 'bar')

betterResult(context, 'bar', { args:['add this']});
// returns: "bar + add this"

betterResult(context, 'baz', { args:['add this'], checkAlso });
// returns: "ZZZ + add this"

````


# buildViewByKey

Helps build view by key:
````
import { View } from 'backbone.marionette';
import { buildViewByKey } from 'bbmn-utils;

let view = new View({
	child: View,
	childOptions: { ... }
});

let child = buildViewByKey(view, 'child');

````


# camelCase

converts `:` separated string to `camelCase`.
## camelCase(...args, boolean[optional])
arguments should be a string and the last argument can be a bollean.

returns camelCasedString.

optional boolean indicates should it capitalize first letter or not.


### usage:
````javascript

camelCase('as:camel:case'); //  - "asCamelCase"
camelCase('as:camel:case', true); // - "AsCamelCase"
camelCase('as', 'camel', 'case', true); // - "AsCamelCase"

````


# comparator

compares A and B.  
difference from `compare-ab` is that you can pass multiple sets of compare operators.

### returns: 
-1 | 0 | 1

### arguments:
accepts 3 arguments and acts like `compareAB`:
> comparator(A, B, getter | [getter, ..])

or array :
> comparator([A, B, getter], [A, B, getter], [A, B, getter])  


### examples:
````javascript

compare(view1, view2, model => model.get('order'));
//acts like compareAB

compare(
	[view2, view1, model => model.get('order')], // by order desc
	[view1, view2, model => model.get('name')], // then by name asc
);


````


# compareAB

compares a and b  
was implemented for backbone.model or marionette.view comparison  

### returns: 
-1 | 0 | 1
> -1 if `a` less then `b`,  
> 0 if `a` equals `b`  
> and 1 if `a` greater than `b`
### arguments:
* **a**: any, required
* **b**: any, required
* **getter**: function | [function, function, ...], optional  
	> argument skipped if it is not a function or an array of functions
	
### getter: `function`
should return value to be compared  
will be applied to each argument to extract compare value  
`this` is equal to given argument and also two arguments passed: `model` and `view`  
> getter(model, view)

### getter: `[function, function, ...]`
does multiple compare of `a` and `b` by given array of getters.  
if getter returns '0' then next getter applied.

### examples:
````javascript

compareAB(1,2); 
// returns: -1

compareAB({foo:2}, {foo:1}, function(){ return this.foo }); 
// returns: 1

let modelA = new Backbone.Model({id:5, order: 1});
let modelB = new Backbone.Model({id:5, order: 2});
compareAB(modelA, modelB, model => model.id); 
// returns: 0

let viewA = new Mn.View({ model: modelA });
viewA.order = 0;
let viewB = new Mn.View({ model: modelB });
viewB.order = 0;
compareAB(viewA, viewB, [(model,view) => view.order, model => model.get('order')]); 
// returns: -1


````


# compareObjects

sorry, there is no documentation yet :-( 

# convertString

sorry, there is no documentation yet :-( 

# enums

sorry, there is no documentation yet :-( 

# extend

sorry, there is no documentation yet :-( 

# getFlag

sorry, there is no documentation yet :-( 

# hasFlag

sorry, there is no documentation yet :-( 

# flat

> flat(obj)

Flattens given object
### returns: 
plain object
### arguments:
* **obj** : object, required

### examples
````javascript	
	let test = {
		foo: {
			bar:{
				baz:'hello'
			},
			qwe: [1,2,3]
		}
	}
	let result = flat(test);

	//result value will be
	{
		"foo.bar.baz":"hello",
		"foo.qwe":[1,2,3]
	}

````


# getByPath

### returns: 
value from object by given path.

### arguments:
* **object**: object, required
* **path**: string, required  
	> dot separated: `"property"` or `"property.anotherProperty"`

### usage:
````javascript
let myObject = {
	property: {
		value: 'my value',
	}
};

let result = getByPath(myObject, 'property.value'); //  - "my value"
result = getByPath(myObject, 'foo.bar'); // - undefined

````


# getOption

sorry, there is no documentation yet :-( 

# isEmptyValue

sorry, there is no documentation yet :-( 

# isKnowCtor

returns true if passed argument is a well known constructor.  
in general was implemented for [better-result](#betterResult).

### returns: 
`true` if a given argument is a well known constructor.  
`false` if its not.

### arguments:
accepts one argument of any type.

### well known constructor
There is an array of registered well known constructors.  
By default it contains all backbone classes and marionette object class. You can push needed classes in that array. see examples

### examples:
```js
import { isKnownCtor } from 'bbmn-utils';
import { View } from 'backbone.marionette';

let result = isKnownCtor(View); // true
result = isKnownCtor(function(){}); // false

```
## adding own ctor

its possible to add your own classes to common array

```js
import { isKnownCtor } from 'bbmn-utils';
import { knownCtors } from 'bbmn-utils';

const MyClass = function() {
	//
}

knownCtors.push(MyClass);

let result = isKnownCtor(MyClass); // true

```



# mergeObjects

sorry, there is no documentation yet :-( 

# mix

helper for extending class or object with a given mixins.
### returns: 
returns wrapper object: `{ with, options, class}`.

### arguments:
* **arg**: class definition or plain object, required
* **options**: object, optional

### options:
* **mergeObjects**: true | false (default value is **true**)
	> if true, collect plain object mixins in one object and convert it to a single mixin.  
	> if false, convert every object to a separate mixin.
* **wrapObjectWithConstructor**: true | false (default value is **true**)
	> this option is ignored if `mergeObjects` is set to **false**
	> when this options is **true** forces to convert plain object with constructor function to a separate mixin  
	> otherwise it will be mixed
#### options example:
````javascript
let mixinA = { a:'a' };
let mixinB = { b:'b' };
let ctorC = function(){};
let mixinC = { c: 'c', constructor: ctorC };
let ctorD = function(){};
let mixinD = { d: 'd', constructor: ctorD };

let mixedByDefault = mix({}).with(mixinA, mixinB, mixinC, mixinD);
/*
this will create three mixins which will be applied to the base class in order

mixin1 = Base => Base.extend({
	a:'a',
	b:'b'
});

mixin2 = Base => Base.extend({
	constructor: ctorC,
	c: 'c'
});

mixin3 = Base => Base.extend({
	constructor: ctorD,
	d: 'd'
});

*/


let mixedWithNoWrap = mix({}, {wrapObjectWithConstructor: false}).with(mixinA,mixinB,mixinC,mixinD);
/*
this will create one mixin which will be applied to the base class

mixin = Base => Base.extend({
	constructor: ctorD,
	a:'a',
	b:'b'
	c: 'c'
	d: 'd'
})

*/

let mixedWithNoMerge = mix({}, {mergeObjects: false}).with(mixinA,mixinB,mixinC,mixinD);
/*

this will create mixin for every argument will be applied to the base class in given order

*/

````

### usage:
````javascript
import { mix } from 'bbmn-utils';
import Mn from 'backbone.marionette';

const MyFuncMixin = Base => Base.extend({
	myNewMethod() {
		// do something
	}
});

const MyPlainMixin = {
	constA: 'foo',
	constB: 'bar',
}

const MixedView = mix(Mn.View).with(MyFuncMixin, MyPlainMixin);
let result = new MixedView();

````


# paramsToObject

sorry, there is no documentation yet :-( 

# setByPath

sets object value by path
### returns: 
returns given value.

### arguments:
* **object**: object, required
* **path**: string, required (f.e. "property.anotherProperty")
* **value**: any, required
* **options**: object, optional

### options:
* **silent**: true | false, default is false
	> if true trigers appropriate `change` events on backbone.models
* **force**: true | false, default is true
	> if false do not set value if path does not exists,  
	> otherwise, create all needed objects

### usage:
````javascript

const test = {};
setByPath(test, 'foo.bar.baz', 'hello');
/* will create foo, bar and set baz equal to "hello" and returns "hello"
{ 
	foo: { 
		bar:{
			baz:"hello"
		} 
	} 
}
*/

const test2 = {};
setByPath(test2, 'foo.bar.baz', 'hello', {force: false});
// will not change test at all but returns "helo"
// test2 remains "{}"


setByPath(test, 'foo.bar.baz', 'bye', {force: false});
// because we already create this path in first example this will 
// change foo.bar.baz value from "hello" to "bye"

````

### what if i will use setByPath on backbone.model?
> setByPath changes model `attributes`
````javascript

let model = new Backbone.Model();
setByPath(model,'foo', 'bar');
// will set model attribute foo equal to 'bar'
// and triggers `change` and `change:foo` events

setByPath(model,'foo', 'bar', {silent: true});
// will set model attribute foo equal to 'bar'
// and do not trigger any events

let nested = new Backbone.Model();
model.set('nested', nested);

setByPath(model, 'nested.baz', 123);
// will set nested model baz attribute equal to 123 and
// triggers change events on both models

````


# skipTake

sorry, there is no documentation yet :-( 

# takeFirst

sorry, there is no documentation yet :-( 

# triggerMethod

sorry, there is no documentation yet :-( 

# triggerMethodOn

sorry, there is no documentation yet :-( 

# toBool

Tries to convert given value to boolean. 
> toBool(undefined) -> undefined  
toBool('false') -> false

### returns: 
true | false | undefined*
> returns `undefined` if `nullable` option is set to true
### arguments:
* **arg** : any, required
* **options** : object, optional

### options:
* **nullable** : boolean, default: true
	> returns `undefined` if given argument is can not be converted to boolean
* **strict**: boolean, default: false
	> if set to true, then any value that are not in known list is treated as unknown and converts to `false` or `undefined` based on `nullable` option
* **returnNullAs** : boolean, default: not set
	> if set return this value if given argument is null or undefined.
* **returnEmptyAs** : boolean, default: not set
	> if set return this value if given argument is an empty string.
* **returnNullAndEmptyAs** : boolean, default: not set
	> if set return this value if given argument is an empty string, undefined or null.
* **returnAnyAs** : boolean, default: not set
	> if set return this value if given argument is not an empty string, undefined or null.
* **returnOtherAs** : boolean, default: not set
	> if set return this value if given argument is not an empty string, undefined or null and not one of known values

### known values
by default there is a list of `known` values
* **true values** : `'true'`, `'1'`, `'-1'`, `'yes'`
* **false values** : `'false'`, `'0'`, `'no'`

### examples:
````javascript

toBool({}, {strict: true}) -> undefined
toBool({}, {strict: true, nullable: false}) -> false
toBool({}, {nullable: false}) -> true
toBool('yes') -> true
toBool('true') -> true
toBool('false') -> false
toBool('no') -> false
toBool(null,{returnNullAs: true}) -> true
toBool("",{returnEmptyAs: true}) -> true

````


# unflat

> unflat(obj)

Unflattens given object
### returns: 
plain object
### arguments:
* **obj** : object, required

### examples
````javascript	
	let test = {
		"foo.bar.baz":"hello",
		"foo.qwe":[1,2,3]
	}
	let result = unflat(test);

	//result value will be
	{
		foo: {
			bar:{
				baz:'hello'
			},
			qwe: [1,2,3]
		}
	}	
	

````

