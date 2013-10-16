The practical inheritance pattern has been designed to standarize the inheritance pattern used within [iai](https://npmjs.org/search?q=iai) modules. It has been published independently, attached to the following paper:

# An alternative to the *constructor pattern*


## Principles

> **Simplicity & expressiveness**

The object declarations should not be verbose and must be expresive. Vanilla javascript is enough expresive but sometimes is verbose. That said, sometimes vanilla javascript produces the most simple and most descriptive code, so encourage to not use an utility function when it does not provide benefits for readability of code.

## Targets

> **#1: Forget the concept of _classes_.**

Everything is a instance in javascript, so talking about classes, even in quotes, is a mistake. There is no excuse. This target leads to the second:

> **#2: Completely eliminate the use of the `new` keyword.**

The use of the `new` keyword produces code that looks like a class instantiation, confusing readers. In addition, the use of `new` is not combinable with the ECMAScript `Function.prototype` functionalities, specially `call` and `apply`, and breaks possible chained calls.


## ~~constructors~~ builders

Research about creational design patterns and cross out definitions that refer specifically to the concept of *classes*. *Prototype* and *Builder* are the patterns that do not rely specifically on the class concept by definition. In fact, JavaScript implements both natively:

* The prototype pattern, through the native `Object`. See on the ECMA 5.1 specification:

  * [*prototype* definition](http://www.ecma-international.org/ecma-262/5.1/#sec-4.3.5)
  * [`Object.create` alghoritm](http://www.ecma-international.org/ecma-262/5.1/#sec-15.2.3.5)

            // prototype is a fully initialized instance of Object.
            var prototype = {
              // ...
            };
            // create a new object with specified prototype
            var object = Object.create( prototype );

* The builder pattern, allowing the use of a function as an object's ~~constructor~~ when invoked with the `new` keyword (aka. *constructor pattern*). As said previously, the use of the `new` keyword should be completely eliminated so this pattern should be avoided.

        // the function builder separates object construction from its representation (aka instance)
        function builder(){
          // ...
        }
        builder.prototype = {
          // ...
        };
        // builder can create different representations with the same construction process
        var object = new builder();


## ~~prototypal~~ ~~classical~~ practical inheritance

As said, the tools to implement a prototypal inheritance pattern, where object instances are created from other object instances, are natively bundled within ECMAScript specification. `Object.create` is the way to *create a new object with the specified prototype*. The challengue is a pattern that efficiently replaces the ~~constructor~~ builder pattern on the task of *initialize a newly created object with the specified prototype*. The solution is quite simple, and surprisingly somewhere between the *constructor pattern* and the *prototypal inheritance pattern*: **use a function that creates a new object with speficied prototype, performs all neccessary initializations, and returns the newly created instance**.

        function builder(){
          var instance = Object.create(builder.prototype);
          // initialize the instance...
          return instance;
        }
        builder.prototype = {
          // ...
        };
        var object = builder();

The code above will pass an `instanceof` check as expected. Any `object` having `builder.prototype` on its prototype chain will resolve `true` for `object instanceof builder`. See on the ECMAScript 5.1 specification:

* [The instanceof operator](http://www.ecma-international.org/ecma-262/5.1/#sec-11.8.6)
* [HasInstance internal method](http://www.ecma-international.org/ecma-262/5.1/#sec-15.3.5.3)

The big concern now is how to implement the inheritance chain, where objects created through builders inherit from other objects created through builders. Each derived object has to perform ancestor's initializing routines too so is needed a mechanism with prototypes inheriting from ancestor prototypes while builders internally call the ancestor builders. The key is to ensure that the oldest ancestor on the chain will create the new object specifing the child's prototype. There are many solutions, but the simpler is execute builders within the context of the desired prototypes.

      function Grandpa(){
        var instance = Object.create(this);
        // initialize the instance...
        return instance;
      }
      Grandpa.prototype = {
        // ...
      };
      
      function Parent(){
        var instance = Grandpa.call(this);
        // initialize the instance...
        return instance;
      }
      Parent.prototype = Object.create( Grandpa.prototype );
      // Parent.prototype.x = ...
      // ...
      
      function Child(){
        var instance = Parent.call(this);
        // initialize the instance...
        return instance;
      }
      Child.prototype = Object.create( Parent.prototype );
      // Child.prototype.x = ...
      // ...
      
      var grandpa = Grandpa.call( Grandpa.prototype );
      var parent = Parent.call( Parent.prototype );
      var child = Child.call( Child.prototype );
        
As seen above, now both the declaration and the creation of new objects becomes unnecesarily verbose. That's reason enough to use a helper function. In fact two functions are needed, one to *extend* prototypes and another to *wrap builders to ensure they are executed within a proper context*.

    function extend( prototype, extension ){
      var object = Object.create( prototype );
      for( var property in extension ){
        if( extension.hasOwnProperty(property) ){
          object[property] = extension[property];
        }
      }
      return object;
    };
    
    function builder( builder, prototype, extension ){
      if( extension ){
        prototype = extend( prototype, extension );
      }
      function builderWrap(){
        if( prototype.isPrototypeOf(this) ){
          var context = this;
        }
        return builder.apply( context | prototype, arguments );
      };
      builderWrap.prototype = prototype;
      return builderWrap;
    };

The `extend` function creates a new object with the specified `prototype` and defines on it as many properties as the own enumerable properties that the `extension` object has.

The `builder` function creates a function that will apply to `builder` the proper context, being the current context (`this`) if it's an object inheriting from `prototype` or `prototype` elsecase. Optionaly provides acces to `extend` functionalities.

With the help of this tools, the previous example can be rewrited as follows:

      var Grandpa = builder(function(){
        var instance = Object.create(this);
        // initialize the instance...
        return instance;
      }, {
        // Grandpa.prototype...
      });
      
      var Parent = builder(function(){
        var instance = Grandpa.call(this);
        // initialize the instance...
        return instance;
      }, Grandpa.prototype, {
        // Parent.prototype ...
      });
      
      var Child = builder(function(){
        var instance = Parent.call(this);
        // initialize the instance...
        return instance;
      }, Parent.prototype, {
        // Child.prototype ...
      });
      
      var grandpa = Grandpa();
      var parent = Parent();
      var child = Child();

That's all, the target is accomplished. There is no need of *classes* and no need to use the *new* keyword. This pattern decouples the creation and initialization of objects from its representation while maintains a true prototypal inheritance pattern. The mechanism to check instance types is the `instanceof` operator.

When initialization is not needed, there is also a mechanism to inherit one object from another:

      var Grandpa = {
        // ...
      };
      
      var Parent = extend( Grandpa, {
        // ...
      });
      
      var Child = extend( Parent, {
        // ...
      });
      
      var grandpa = Object.create(Grandpa);
      var parent = Object.create(Parent);
      var child = Object.create(Child);
