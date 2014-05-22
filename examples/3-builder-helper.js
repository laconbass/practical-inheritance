var assert = require("assert")
  , builder = require("..")
;

//
// Object declarations
//

var Grandpa = builder(function(){
  var instance = Object.create(this);
  // initialize the instance...
  return instance;
}, {
  // Grandpa.prototype...
  grandpa: 123
});

var Parent = builder(function(){
  var instance = Grandpa.call(this);
  // initialize the instance...
  return instance;
}, Grandpa.prototype, {
  // Parent.prototype ...
  parent: 456
});

var Child = builder(function(){
  var instance = Parent.call(this);
  // initialize the instance...
  return instance;
}, Parent.prototype, {
  // Child.prototype ...
  child: 789
});

//
// Object instances
//

var grandpa = Grandpa();
var parent = Parent();
var child = Child();

//
// Checking who is prototype of who
//

assert( ! Grandpa.prototype.isPrototypeOf(Grandpa.prototype),
            "Grandpa's prototype should not be on Grandpa's prototype chain" )
assert( Grandpa.prototype.isPrototypeOf(Parent.prototype),
       "Grandpa's prototype should be on Parent's prototype chain" )
assert( Grandpa.prototype.isPrototypeOf(Child.prototype),
       "Grandpa's prototype should be on Child's prototype chain" )

assert( ! Parent.prototype.isPrototypeOf(Grandpa.prototype),
            "Parent's prototype should not be on Grandpa's prototype chain" )
assert( ! Parent.prototype.isPrototypeOf(Parent.prototype),
       "Parent's prototype should not be on Parent's prototype chain" )
assert( Parent.prototype.isPrototypeOf(Child.prototype),
       "Parent's prototype should be on Child's prototype chain" )

assert( ! Child.prototype.isPrototypeOf(Grandpa.prototype),
            "Child's prototype should not be on Grandpa's prototype chain" )
assert( ! Child.prototype.isPrototypeOf(Parent.prototype),
       "Child's prototype should not be on Parent's prototype chain" )
assert( ! Child.prototype.isPrototypeOf(Child.prototype),
       "Child's prototype should not be on Child's prototype chain" )


assert( Grandpa.prototype.isPrototypeOf(grandpa),
            "Grandpa's prototype should be on grandpa's chain" )
assert( Grandpa.prototype.isPrototypeOf(parent),
            "Grandpa's prototype should be on parent's chain" )
assert( Grandpa.prototype.isPrototypeOf(child),
            "Grandpa's prototype should be on child's chain" )

assert( ! Parent.prototype.isPrototypeOf(grandpa),
            "Parent's prototype should not be on grandpa's chain" )
assert( Parent.prototype.isPrototypeOf(parent),
            "Parent's prototype should be on parent's chain" )
assert( Parent.prototype.isPrototypeOf(child),
            "Parent's prototype should be on child's chain" )

assert( ! Child.prototype.isPrototypeOf(grandpa),
            "Child's prototype should not be on grandpa's chain" )
assert( ! Child.prototype.isPrototypeOf(parent),
            "Child's prototype should not be on parent's chain" )
assert( Child.prototype.isPrototypeOf(child),
            "Child's prototype should be on child's chain" )

//
// Checking who is instance of who
//

assert( grandpa instanceof Grandpa, "grandpa should be instanceof Grandpa" )
assert( !(grandpa instanceof Parent), "grandpa should not be instanceof Parent" )
assert( !(grandpa instanceof Child), "grandpa should not be instanceof Child" )

assert( parent instanceof Grandpa, "parent should be instanceof Grandpa" )
assert( parent instanceof Parent, "parent should be instanceof Parent" )
assert( !(parent instanceof Child), "parent should not be instanceof Child" )

assert( child instanceof Grandpa, "child should be instanceof Grandpa" )
assert( child instanceof Parent, "child should be instanceof Parent" )
assert( child instanceof Child, "child should be instanceof Child" )

