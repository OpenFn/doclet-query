const { assert } = require('chai');
const { createTree, membersForFile, ModuleDoclet } = require('../src');
const fixture = require('./fixture.json');
const _ = require('lodash');

describe("createTree", function() {
  before(function() {
    this.tree = createTree(fixture)
  })

  it("registers the package", function() {
    assert(this.tree[0].name === 'language-salesforce', "first object is package")
    assert(this.tree[0].kind === 'package', "first object is package")
  })

  it("registers the packages modules", function() {
    assert.property(this.tree[0].modules, "Adaptor")
    assert.property(this.tree[0].modules, "FakeAdaptor")
  })

  it("registers the function members of a module", function() {
    const adaptorExports = this.tree[0].modules.Adaptor.exports

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
