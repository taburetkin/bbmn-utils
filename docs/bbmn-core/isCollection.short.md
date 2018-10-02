returns `true` if argument is a `Backbone.Collection` instance.
### example:
```js
import { isCollection } from 'bbmn-utils';

isCollection({}); //false

isCollection(new Backbone.Collection()); //true

```
