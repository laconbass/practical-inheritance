var builder = require("..");

//
// Object declaration
//

var build = builder(function(){
  return Object.create(this);
}, null, {
  prop: "some value"
});

// triggers bug #1
build();
