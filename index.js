module.exports = builder;
module.exports.extend = extend;

function builder( builder, prototype, extension ){
  if( extension ){
    prototype = extend( prototype, extension );
  }
  function builderWrap(){
    if( prototype.isPrototypeOf(this) ){
      console.log( "is prototype" )
      var context = this;
    }
    console.log( "apply", require('util').inspect(
      context || prototype, { depth: null }
    ) );
    return builder.apply( context || prototype, arguments );
  };
  builderWrap.prototype = prototype;
  return builderWrap;
};

function extend( prototype, extension ){
  var object = Object.create( prototype );
  for( var property in extension ){
    if( extension.hasOwnProperty(property) ){
      object[property] = extension[property];
    }
  }
  return object;
};
