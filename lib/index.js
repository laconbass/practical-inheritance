/*!
 * The MIT License (MIT)
 *
 * Copyright (c) 2013 Lorenzo García Rivera <lorenzogrv(at)gmail(dot)com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

module.exports = builder;
module.exports.extend = extend;

/**
 * define constructor's prototype.
 * @function builder: creates a function that will apply to `builder` the proper
 * context, being the current context (`this`) if it's an object inheriting from
 * `prototype` or `prototype` elsecase. Additionally, any object who has `prototype`
 * on its prototype chain will pass an `instanceof` check against the returned
 * function. Optionaly provides access to `extend` functionalities: If extension is
 * given, use as `prototype` the result of extending `prototype` with `extension`.
 *   @param builder [Function]
 *   @param prototype [Object|Null]
 *   @param extension [Function|undefined] (Optional)
 *   @returns Function
 */

function builder( builder, prototype, extension ){
  if( extension ){
    prototype = extend( prototype, extension );
  }
  function builderWrap(){
    if( prototype.isPrototypeOf(this) ){
      var context = this;
    }
    return builder.apply( context || prototype, arguments );
  };
  builderWrap.prototype = prototype;
  builderWrap.toString = function(){
    return "[builder "+(builder.name||"anonymous")+"]";
  }
  return builderWrap;
};

/**
 * @function extend: creates a new object with the specified `prototype` and
 * defines on it as many properties as the own enumerable properties that the
 * `extension` object has.
 *   @param prototype [Object|null]: the object to be used as prototype
 *   @param extension [Object]: the object to be used as extension
 *
 * As aditional reference, see on the ECMA 5.1 spec...
 * - [Object.create alghoritm](http://www.ecma-international.org/ecma-262/5.1/#sec-15.2.3.5)
 * - ["prototype" definition](http://www.ecma-international.org/ecma-262/5.1/#sec-4.3.5)
 */

function extend( prototype, extension ){
  var object = Object.create( prototype );
  for( var property in extension ){
    if( extension.hasOwnProperty(property) ){
      object[property] = extension[property];
    }
  }
  return object;
};
