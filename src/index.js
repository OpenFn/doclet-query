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
 * Determines if a doclet is an export member.
 *
 * <pre><code>
 * meta: { 
 *   code: { name: "exports.foo" },
 *   ...
 * }
 * </code></pre>
 * @function
 * @param {object} doclet
 * @returns {Boolean}
 */
function isExport(doclet) {
  try {
    return /exports\./.test(doclet.meta.code.name)
  } catch (e) {
    return false
  }
}

/**
 * Creates a ModuleDoclet instance.
 *
 * @function
 * @param {object|null} packageDoclet - The parent package doclet
 * @param {object} doclet - module doclet
 * @param {Object[]|null} doclets - any/all doclets to provide child member info
 * @returns {object}
 */
function ModuleDoclet(packageDoclet, doclet, doclets) {
  const members = _.filter(doclets, { memberof: doclet.longname })
  const exports = members.filter(isExport).reduce((acc, member) => {
    return _.merge(acc, { [member.name]: member })
  }, {})

  return {
    doclet,
    members,
    package: packageDoclet,
    exports
  }
}

/**
 * Creates a PackageDoclet instance.
 *
 * @function
 * @param {object|null} doclet - package doclet
 * @param {Object[]|null} doclets - any/all doclets to provide child member info
 * @returns {object}
 */
function PackageDoclet(doclet, doclets) {

  const modules = doclet.files
    .reduce(( acc, filePath ) => {
      const fileModule = modulesForFile(doclets, filePath)[0]

      return (
        fileModule ?  _.merge(acc, { [fileModule.name]: ModuleDoclet(doclet, fileModule, doclets) }) : acc
      )

    }, {})

  return {
    doclet,
    modules
  }
}

/**
 * Creates a tree structure out of a JSDoc's doclet format.
 *
 * @static createTree
 * @param {Object[]} doclets - List of Doclets
 */
function createTree(doclets) {
  return filterPackages(doclets).reduce((acc,p) => {
    return _.merge(acc, { [p.name]: PackageDoclet(p, doclets) })
  },{})
}

module.exports = {
  createTree,
  membersForFile,
  ModuleDoclet,
  PackageDoclet
};
