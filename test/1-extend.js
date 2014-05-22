var assert = require("assert")
  , extend = require("..").extend
;

describe("extend", function(){
  it( "should be a function", function(){
    assert( "function" == typeof extend );
  })
  it( "should behave as demonstrated in example #1", function(){
    require( "../examples/1-extend" );
  })
  it( "should only iterate through own enumerable propertyes", function(){
    var prototype = {
      prop1: 1,
      prop2: "test inherits",
      prop3: "test enumerable"
    };
    var extension = Object.create({
      prop4: "test own"
    });
    extension.prop1 = "test override";
    Object.defineProperty( extension, 'prop3', {
      value: "overriding prop3 value",
      enumerable: false
    });
    var result = extend( prototype, extension );

    assert( result.prop1 === "test override", "it should override" );
    assert( result.prop2 === "test inherits", "it should inherit" );
    assert( result.prop3 === "test enumerable", "test enumerable" );
    assert( result.prop4 === undefined, "test own" );
  })
})
