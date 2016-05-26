const { assert } = require('chai');
const { createTree, membersForFile } = require('../src');
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
    assert.lengthOf(this.tree[0].modules, 4, "package has n modules")
    assert.property(this.tree[0].modules, "Adaptor")
    assert.property(this.tree[0].modules, "FakeAdaptor")
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

