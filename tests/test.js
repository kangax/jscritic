//(function(){
  // var foo = 1;
  //     bar = 'xyz';

  // if (false) {
  //   fff = 1;
  // }

  // Array.prototype.foo = function() { };

  // Object.prototype.bar = function() { };

  // document.write('<foo>');

  // if (navigator.userAgent === 'Mozilla') {
  //   alert('yay browser sniffing!');
  // }

  eval('document.' + 1 ? 'foo' : 'bar');


//})();

// var log = ['test'];
// var obj = {
//   get latest () {
//     if (log.length === 0) return undefined;
//     return log[log.length - 1];
//   }
// };
// console.log (obj.latest); // Will return "test".

// (function(){ var global = this; global.sneaky = 1; }).call(this);
// (function(){ var global = this; global.sneaky2 = 1; })();
// (function(){ this.sneaky3 = 1; })();
// (function(){ self.sneaky4 = 1; })();
// (function(){ window.sneaky5 = 1; })();

// for each (variable in {}) { statement }
