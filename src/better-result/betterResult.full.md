> ### betterResult(context, key, options)

Acts almost as underscore [`_.result`](https://underscorejs.org/#result) but can invoke result function if its not one of well known constructors.  
This function was implemented for better expirience with `backbone` and `backbone.marionette` instances. It helps handle complex options which can be a function and helps getting not yet initialized options values. see examples.

```
import { betterResult } from 'bbmn-utils';
let result = betterResult( instance, 'propertyName', options);
```

> note:  
third argument is NOT a default value. default value should be passed through options.


### returns: value from context by given key
### arguments:
* **context**: object, required
* **key**: string, required  
* **options**: object, optional  

### options argument:
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
