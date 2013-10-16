var assert = require("assert")
  , extend = require("..").extend
;

//
// Object declarations
//

var Grandpa = {
  // ...
};

var Parent = extend( Grandpa, {
  // ...
});

var Child = extend( Parent, {
  // ...
});

//
// Object instances
//

var grandpa = Object.create(Grandpa);
var parent = Object.create(Parent);
var child = Object.create(Child);

//
// Checking who is prototype of who
//

assert( Grandpa.isPrototypeOf(grandpa), "Grandpa should be on grandpa's chain" )
assert( Grandpa.isPrototypeOf(parent), "Grandpa should be on parent's chain" )
assert( Grandpa.isPrototypeOf(child), "Grandpa should be on child's chain" )

assert( !Parent.isPrototypeOf(grandpa), "Parent should not be on grandpa's chain" )
assert( Parent.isPrototypeOf(parent), "Parent should be on parent's chain" )
assert( Parent.isPrototypeOf(child), "Parent should be on child's chain" )

assert( !Child.isPrototypeOf(grandpa), "Child should not be on grandpa's chain" )
assert( !Child.isPrototypeOf(parent), "Child should not be on parent's chain" )
assert( Child.isPrototypeOf(child), "Child should be on child's chain" )
