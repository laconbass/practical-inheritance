var assert = require("assert");

//
// Object declarations
//

function Grandpa(){
  var instance = this instanceof Grandpa
    ? this
    : Object.create(Grandpa)
  ;
  // initialize the instance...
  return instance;
}
Grandpa.prototype = Grandpa;
Grandpa.gprop = "grandpa";
Grandpa.prop = "grandpa";

function Parent(){
  var instance = this instanceof Parent
    ? this
    : Object.create(Parent.prototype)
  ;
  Grandpa.call(instance);
  // initialize the instance...
  return instance;
}
Parent.prototype = Object.create(Grandpa);
Parent.prototype.pprop = "parent";
Parent.prototype.prop = "parent";

function Child(){
  // child is final so forget instanceof check
  var instance = Object.create(Child.prototype)
  ;
  Parent.call( instance );
  // initialize the instance...
  return instance;
}
Child.prototype = Object.create(Parent.prototype);
Child.prototype.cprop = "child";
Child.prototype.prop = "child";

//
// Object instances
//

var grandpa = Grandpa();
var parent = Parent();
var child = Child();

//
// Checking instance's prototype chains
//

assert( Grandpa.prototype.isPrototypeOf(grandpa),
            "Grandpa.prototype should be on grandpa's prototype chain" )
assert( Grandpa.prototype.isPrototypeOf(parent),
            "Grandpa.prototype should be on parent's prototype chain" )
assert( Grandpa.prototype.isPrototypeOf(child),
            "Grandpa.prototype should be on child's prototype chain" )

assert( ! Parent.prototype.isPrototypeOf(grandpa),
            "Parent.prototype should not be on grandpa's prototype chain" )
assert( Parent.prototype.isPrototypeOf(parent),
            "Parent.prototype should be on parent's prototype chain" )
assert( Parent.prototype.isPrototypeOf(child),
            "Parent.prototype should be on child's prototype chain" )

assert( ! Child.prototype.isPrototypeOf(grandpa),
            "Child.prototype should not be on grandpa's prototype chain" )
assert( ! Child.prototype.isPrototypeOf(parent),
            "Child.prototype should not be on parent's prototype chain" )
assert( Child.prototype.isPrototypeOf(child),
            "Child.prototype should be on child's prototype chain" )

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

//
// Checking values
//

assert( grandpa.gprop == 'grandpa', "grandpa#gprop should be grandpa" );
assert( grandpa.prop == 'grandpa', "grandpa#prop should be grandpa" );

assert( parent.gprop == 'grandpa', "parent#gprop should be grandpa" );
assert( parent.pprop == 'parent', "parent#pprop should be parent" );
assert( parent.prop == 'parent', "parent#prop should be overriden to parent" );

assert( child.gprop == 'grandpa', "child#gprop should be grandpa" );
assert( child.pprop == 'parent', "child#pprop should be parent" );
assert( child.cprop == 'child', "child#cprop should be child" );
assert( child.prop == 'child', "child#prop should be overriden to child" );
