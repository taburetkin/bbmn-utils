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
