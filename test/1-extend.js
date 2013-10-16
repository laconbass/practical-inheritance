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
})
