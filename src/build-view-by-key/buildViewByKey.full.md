> ### buildViewByKey(context, key, options)

Helps build view by key:

````
let view = new View({
	child: View,
	childOptions: { ... }
});

let childView = buildViewByKey(view, 'child');

````



### returns: view instance

### arguments
* **context**: object, required
* **key**: string, required  
* **options**: object, optional  

### options argument:
* **TextView**: View definition, default: `undefined`
> If you passed TextView then it will build view from text key option. see examples
* **options**: object, default: `undefined`
> Mixed this options to View options before instantiate.

### examples:
```js

const context = {
	header: 'this is header',
	content: LayoutView,
	contentOptions: { foo:'bar', baz:'baz' },
	footer: 'this is footer',
}

buildViewByKey(context, 'header', { TextView: Mn.View });
// builds Mn.View with { text: 'this is header' }

buildViewByKey(context, 'content', { options: { baz: 123 } });
// builds LayoutView with { foo:'bar', baz: 123 }

buildViewByKey(context, 'footer');
// returns undefined, because there is no TextView passed via options

```
