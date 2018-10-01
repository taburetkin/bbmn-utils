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

