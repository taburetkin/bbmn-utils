Tries to clone given argument.
Difference from `_.clone` is that by default there is a deep clone. it also accepts options as second argument.
If given argument is object with circular references they will be removed.
Also copied only own properties.


### returns: 
cloned argument

### arguments:
* **arg**: any,
* **options**: object, optional
> clone(myobject, options);

### options:
* **functions**: boolean, default: `false`
> if `true`, also copies methods and omit them if `false`
* **deep**: boolean, default: `true`
> if `true`, creates a deep clone of a given argument, if `false` acts exactly as `_.clone`


### examples:
````javascript

let date = new Date();
let clonedDate = clone(date);
console.log(date === clonedDate); // false

let obj = {
	foo:'foo',
	bar: {
		baz: 'baz'
	}
}
let clonedObj = clone(obj);
console.loc(clonedObj === obj); //false
console.loc(clonedObj.bar === obj.bar); //false

let clonedObj2 = clone(obj, { deep: false });
console.loc(clonedObj2.bar === obj.bar); //true

let withMethods = {
	foo: () => {},
	bar: 'bar'
};
let clonedWithoutMethods = clone(withMethods);
console.log(_.size(clonedWithoutMethods)); // 1

let clonedWithMethods = clone(withMethods, { functions: true });
console.log(_.size(clonedWithMethods)); // 2
console.log(clonedWithMethods.foo === withMethod.foo); // true

````
