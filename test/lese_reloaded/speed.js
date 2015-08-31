/* goog.provide('cljs.lese.speed');


var Foo = function (firstName, lastName) {
  this.firstName = firstName;
  this.lastName = lastName;
  this.getter = function() {return this.firstName + this.lastName};
}

var bar = function (firstName, lastName) {
  return {
    getter : function() {
      return firstName + lastName;
    }
  };
}



var testFoo = function () {
  var t0 = performance.now();
  var fN = "Homo";
  var lN = "Fürst";
  for (i = 0; i<10000000 ; i++) {
    var foo2 = new Foo(fN, lN);
  }
       var t1 = performance.now();
       console.log(t1 - t0); 
       console.log("foo done"); 
} 

  
var testBar = function () {
  var t0 = performance.now();
  var fN = "Homo";
  var lN = "Fürst";
  for (i = 0; i<10000000 ; i++) {
    bar(fN,lN);
  }
       var t1 = performance.now();
       console.log(t1 - t0); 
       console.log("bar done"); 
} 


  testFoo();
  testBar();
*/
