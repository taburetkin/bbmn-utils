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
