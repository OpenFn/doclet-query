const { assert } = require('chai');
const { createTree, membersForFile, ModuleDoclet, PackageDoclet } = require('../src');
const fixture = require('./fixture.json');
const _ = require('lodash');

describe("createTree", function() {
  before(function() {
    this.tree = createTree(fixture)
  })

  it("registers the package", function() {
    const packageNode = this.tree[ "language-salesforce" ]

    assert(packageNode.doclet.name === 'language-salesforce', "first object is package")
    assert(packageNode.doclet.kind === 'package', "first object is package")
  })

  it("registers the packages modules", function() {
    const packageNode = this.tree[ "language-salesforce" ]

    assert.property(packageNode.modules, "Adaptor")
    assert.property(packageNode.modules, "FakeAdaptor")
  })

  it("registers the function members of a module", function() {
    const packageNode = this.tree[ "language-salesforce" ]
    const adaptorExports = packageNode.modules.Adaptor.exports

    assert.property(adaptorExports, "create")
  })
})

describe("membersForFile", function() {
  it("returns all doclets referenced in a file", function() {
    assert(
      _.every(
        membersForFile(fixture, "/Users/stuart/Sourcecode/openfn/language-salesforce/src/Adaptor.js"),
        { meta: {
          filename: "Adaptor.js",
          path: '/Users/stuart/Sourcecode/openfn/language-salesforce/src'
        } }
      ),
      "all doclets don't belong to Adaptor.js"
    )
    
  })
})

describe("ModuleDoclet", function() {
  it("returns an object of keyed members for a given module", function() {
    const doclet = fixture[0]
    const moduleDoclet = ModuleDoclet(null, doclet, fixture)

    assert(moduleDoclet.doclet === doclet, "does not contain original doclet")
    assert.lengthOf(moduleDoclet.members, 52, "does not contain correct members")
    assert.property(moduleDoclet.exports, "create", "does not contain correct exports")
  })
})

describe("PackageDoclet", function() {
  it("~modules returns all modules for that package", function() {
    const doclet = fixture[fixture.length-1]
    const packageDoclet = PackageDoclet(doclet, fixture)

    assert(packageDoclet.doclet === doclet, "does not contain original doclet")
    assert.lengthOf(Object.keys(packageDoclet.modules), 2, "does not contain correct modules")
  })
})
