const _ = require('lodash');

/** @module DocletQuery */

function filterPackages(doclets) {
  return _.filter(doclets, {kind: 'package'})
}

function filterModules(doclets) {
  return _.filter(doclets, {kind: 'module'})
}

/**
 * Filters doclets by their file.
 *
 * Members of a file have a structure of: 
 * <pre><code>
 * meta: { 
 *   filename: 'FakeAdaptor.js',
 *   path: '/Users/stuart/Sourcecode/openfn/language-salesforce/src',
 *   ...
 * }
 * </code></pre>
 *
 * @function
 * @param {Object[]} doclets - List of Doclets
 * @param {string} filePath - Path from a package doclet
 */
function membersForFile(doclets, filePath) {
  let pathArray = filePath.split('/')
  const filename = pathArray.pop()
  const path = pathArray.join('/')

  return _.filter(doclets, { 
    meta: { filename, path }
  })
}

function modulesForFile(doclets, filePath) {
  return filterModules(membersForFile(doclets, filePath))
}

/**
 * Creates a tree structure out of a JSDoc's doclet format.
 *
 * @function
 * @param {Object[]} doclets - List of Doclets
 */
function createTree(doclets) {
  return filterPackages(doclets).map(function(p) {
    const packageModules = p.files
      .reduce(( acc, filePath ) => {
        const fileModule = modulesForFile(doclets, filePath)[0]
        
        return (
          fileModule ?  _.merge(acc, { [fileModule.name]: fileModule }) : acc
        )

      }, {})

    return _.merge(p, { modules: packageModules })
  })
}

module.exports = {
  createTree,
  membersForFile
};
