doclet-query
============

[![CircleCI](https://circleci.com/gh/OpenFn/doclet-query.svg?style=svg)](https://circleci.com/gh/OpenFn/doclet-query)

JSDoc Metadata Query Tools

**EXPERIMENTAL**
Like life itself, it's very likely to change.

Usage
-----

1. Get a dump of doclets from JSDoc.  
   Easiest way is to use [jsdoc-api](https://www.npmjs.com/package/jsdoc-api).  
   ```js
   const jsdoc = require('jsdoc-api');
   const { createTree } = require('./src');

   jsdoc.explain({
     files: '../package-name/src/*',
     package: '../package-name/package.json'
   }).then(function(result) {
     const tree = createTree(result);
     console.log(tree['package-name'].modules.foo.exports)
   })
   ```

   *or*

   You can use the "explain" switch from the JSDoc CLI:  
   `jsdoc src -r -P package.json -X > doclets.json`
2. Using the jsdoc-query API call `createTree` with the doclets data.  
```js
const doclets = require('./doclets.json');
const { createTree } = require('doclet-query');
const tree = createTree(doclets);
```

3. Starting from the package, you can traverse the module's structure:  
```js
const package = tree['package-name']        // The package
const modules = package.modules             // Modules found in the package
const exportedMembers = modules.foo.exports // Exported members of the module
```


