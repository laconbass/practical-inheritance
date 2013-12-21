var assert = require("assert")
  , builder = require("..")
;

describe("builder", function(){
  it( "should be a function and return a function", function(){
    assert( "function" == typeof builder, "it should be a function" );
    var returns = builder( function(){}, {} );
    assert( "function" == typeof returns, "it should return a function" );

  })
  it( "should behave as demonstrated in example #2", function(){
    require( "../examples/2-builder" );
  })
  it( "should be able to extend from null as demonstrated in example #3", function(){
    require( "../examples/3-builder-from-null" );
  })
  it( "should ease debugging through builderWrap.toString", function(){
    assert("[builder anonymous]" == builder(function(){}).toString() );
    assert("[builder SomeName]" == builder(function SomeName(){}).toString() )
  })
})
