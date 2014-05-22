The practical inheritance pattern has been designed to standarize the inheritance patterns used within [iai modules]. It has been published independently, attached to the following paper:

[iai modules]: https://npmjs.org/search?q=iai

# An alternative to the *constructor pattern*


**Note**: This document is a review of a [previous version of this document].

[previous version of this document]: https://github.com/laconbass/practical-inheritance/blob/v1.1.3/README.md

## Principles

> **Simplicity & expressiveness**

The object declarations must be simple and expressive, and should not be verbose.

## Goals, by relevance

> **#1: Forget the concept of _classes_.**

Everything is a instance in javascript, so talking about classes, even in quotes, is a mistake. There is no excuse.

> **#2: Vanilla compliant pattern.**

The pattern for object declarations must be enough simple to be implemented with plain vanilla javascipt, without the need of helper functions.

> **#3: Avoid the use of the `new` keyword.**

The use of the `new` keyword is not combinable with the ECMAScript `Function.prototype` functionalities, specially `call` and `apply`, and breaks possible chained calls.

> **#4: Avoid usage of helper functions.**

Encourage to not use an utility function when it does not provide clear benefits for readability of code. Sometimes Vanilla javascript produces the code most simple and most descriptive, or at least the code that is enough simple and enough descriptive.

> **#5: Provide helper functions for convenience.**

Helper functions usage is convenient for reducing verbosity, especially when declaring long inheritance chains.


## ~~constructors~~ builders

Research about creational design patterns and cross out definitions that refer specifically to the concept of *classes*. *Prototype* and *Builder* are the patterns that do not rely specifically on the class concept by definition. In fact, JavaScript implements both natively:

- The prototype pattern, through the native `Object`.

        // prototype is a fully initialized instance of Object.
        var prototype = {
          // ...
        };
        // create a new object with specified prototype
        var object = Object.create( prototype );

  > See on the ECMA 5.1 specification:
  >
  > - [*prototype* definition](http://www.ecma-international.org/ecma-262/5.1/#sec-4.3.5)
  > - [`Object.create` alghoritm](http://www.ecma-international.org/ecma-262/5.1/#sec-15.2.3.5)

- The builder pattern, allowing the use of a function as an object's ~~constructor~~ when invoked with the `new` keyword (aka. *constructor pattern*).

        // the function builder separates object construction from its representation (aka instance)
        function builder(){
          // ...
        }
        builder.prototype = {
          // ...
        };
        // builder can create different representations with the same construction process
        var object = new builder();

  > See on the ECMA 5.1 specification:
  >
  > - [*constructor* definition](http://www.ecma-international.org/ecma-262/5.1/#sec-4.3.4)
  > - [`[[Construct]]` internal method for a Function object](http://www.ecma-international.org/ecma-262/5.1/#sec-13.2.2)

## ~~prototypal~~ ~~classical~~ practical inheritance pattern

As said, the tools to implement an inheritance pattern, either prototypal-based or builder-based, are natively bundled within ECMAScript specification:

1. `Object.create` is the way to *create a new object with the specified prototype*.
2. Functions, used as constructors, *initialize a newly created object with the specified prototype* (being *the specified prototype* the value of function's `prototype` property).

The challengue are researching and developing, featuring all the goals defined herein, the following:

1. A pattern that efficiently replaces the ~~constructor~~ builder pattern (to avoid the usage of the `new` keyword).
2. Some helper functions to reduce code verbosity on huge object declarations or huge inheritance chains (the fewer and simpler, the better).

The solution to #1 is simple, and semantically equivalent to the *constructor pattern*: **use a function that creates a new object with speficied prototype, performs all neccessary initializations, and returns the newly created instance**. There are many possible solutions to implement it, as the following:

[John Resig's researches]: http://ejohn.org/blog/simple-class-instantiation/

- The widely used *Simple “Class” Instantiation*, derived from [John Resig's researches]. This pattern avoids the use of the `new` keyword outside the builder function, like some ECMAScript built-in constructors that can be called as functions.

        function builder(){
          if( !(this instanceof builder) ){
            return new builder();
          }
          // initialize instance (this)...
          // do not return!! (or return this)
        }
        builder.prototype = {
          // ...
        };
        var object = builder();

  > See on the ECMA 5.1 specification:
  >
  > - [The Function Constructor Called as a Function](http://www.ecma-international.org/ecma-262/5.1/#sec-15.3.1)
  > - [The Array Constructor Called as a Function](http://www.ecma-international.org/ecma-262/5.1/#sec-15.4.1)
  > - [The RegExp Constructor Called as a Function](http://www.ecma-international.org/ecma-262/5.1/#sec-15.10.3)
  > - [The Error Constructor Called as a Function](http://www.ecma-international.org/ecma-262/5.1/#sec-15.11.1)

- The *practical inheritance pattern* (also *builder pattern*), designed and crafted to be used within [iai modules], and presented on this paper. This pattern fits all the goals defined herein.

        function builder(){
          var instance = this instanceof builder? this : Object.create(builder.prototype);
          // initialize instance...
          return instance;
        }
        builder.prototype = {
          // ...
        };
        var object = builder();

Both code snippnets above will pass an `instanceof` check as expected. Any `object` having `builder.prototype` on its prototype chain will resolve `true` for `object instanceof builder`.

> See on the ECMAScript 5.1 specification:
>
> - [The `instanceof` operator](http://www.ecma-international.org/ecma-262/5.1/#sec-11.8.6)
> - [`[[HasInstance]]` internal method](http://www.ecma-international.org/ecma-262/5.1/#sec-15.3.5.3)

## The inheritance chain

Work in progress...

## Note

This document is being reviewed as the buider pattern is being reviewed too. Please follow to [previous version of this document] for further understanding of the *builder pattern* and its beginnings.

