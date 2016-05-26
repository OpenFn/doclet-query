jsdoc-query
===========

JSDoc Metadata Query Tools

**EXPERIMENTAL**
Like life itself, it's very likely to change.

Usage
-----

1. Get a dump of doclets from JSDoc.  
   You can use the "explain" switch from the JSDoc CLI:  
   `jsdoc src -r -P package.json -X > doclets.json`
2. Using the jsdoc-query API call `createTree` with the doclets data.  
```js
const doclets = require('./doclets.json');
const { createTree } = require('jsdoc-query');
const tree = createTree(doclets);
```

3. Starting from the package, you can traverse the module's structure:  
```js
const package = tree[0]         // The package
const modules = package.modules // Modules found in the package
const exportedMember = modules[0].exports // Exported members of the module
```


