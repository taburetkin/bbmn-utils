> ### camelCase(...args, boolean[optional])

converts `:` separated string to `camelCase`.

### returns: camelCasedString

### arguments:
each argument should be a string and the last one can be a bollean.

### boolean argument:
If last argument is `true` then first letter became capitalized.

### eamples:
````javascript

camelCase('as:camel:case'); //  - "asCamelCase"
camelCase('as:camel:case', true); // - "AsCamelCase"
camelCase('as', 'camel', 'case', true); // - "AsCamelCase"

````
