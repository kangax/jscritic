/*
CAKE - Canvas Animation Kit Experiment

Copyright (C) 2007  Ilmari Heikkinen

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
*/

window.requestAnimFrame = (function(){
      return  window.requestAnimationFrame       || 
              window.webkitRequestAnimationFrame || 
              window.mozRequestAnimationFrame    || 
              window.oRequestAnimationFrame      || 
              window.msRequestAnimationFrame     || 
              function(/* function */ callback, /* DOMElement */ element){
                window.setTimeout(callback, 1000 / 60);
              };
    })();
 
/**
  Delete the first instance of obj from the array.

  @param obj The object to delete
  @return true on success, false if array contains no instances of obj
  @type boolean
  @addon
  */
Array.prototype.deleteFirst = function(obj) {
  for (var i=0; i<this.length; i++) {
    if (this[i] == obj) {
      this.splice(i,1)
      return true
    }
  }
  return false
}

Array.prototype.stableSort = function(cmp) {
  // hack to work around Chrome's qsort
  for(var i=0; i<this.length; i++) {
    this[i].__arrayPos = i;
  }
  return this.sort(Array.__stableSorter(cmp));
}
Array.__stableSorter = function(cmp) {
  return (function(c1, c2) {
    var r = cmp(c1,c2);
    if (!r) { // hack to work around Chrome's qsort
      return c1.__arrayPos - c2.__arrayPos
    }
    return r;
  });
}

/**
  Compares two arrays for equality. Returns true if the arrays are equal.
  */
Array.prototype.equals = function(array) {
  if (!array) return false
  if (this.length != array.length) return false
  for (var i=0; i<this.length; i++) {
    var a = this[i]
    var b = array[i]
    if (a.equals && typeof(a.equals) == 'function') {
      if (!a.equals(b)) return false
    } else if (a != b) {
      return false
    }
  }
  return true
}

/**
  Rotates the first element of an array to be the last element.
  Rotates last element to be the first element when backToFront is true.

  @param {boolean} backToFront Whether to move the last element to the front or not
  @return The last element when backToFront is false, the first element when backToFront is true
  @addon
  */
Array.prototype.rotate = function(backToFront) {
  if (backToFront) {
    this.unshift(this.pop())
    return this[0]
  } else {
    this.push(this.shift())
    return this[this.length-1]
  }
}
/**
  Returns a random element from the array.

  @return A random element
  @addon
 */
Array.prototype.pick = function() {
  return this[Math.floor(Math.random()*this.length)]
}

Array.prototype.flatten = function() {
  var a = []
  for (var i=0; i<this.length; i++) {
    var e = this[i]
    if (e.flatten) {
      var ef = e.flatten()
      for (var j=0; j<ef.length; j++) {
        a[a.length] = ef[j]
      }
    } else {
      a[a.length] = e
    }
  }
  return a
}

Array.prototype.take = function() {
  var a = []
  for (var i=0; i<this.length; i++) {
    var e = []
    for (var j=0; j<arguments.length; j++) {
      e[j] = this[i][arguments[j]]
    }
    a[i] = e
  }
  return a
}

if (!Array.prototype.pluck) {
  Array.prototype.pluck = function(key) {
    var a = []
    for (var i=0; i<this.length; i++) {
      a[i] = this[i][key]
    }
    return a
  }
}

Array.prototype.set = function(key, value) {
  for (var i=0; i<this.length; i++) {
    this[i][key] = value
  }
}

Array.prototype.allWith = function() {
  var a = []
  topLoop:
  for (var i=0; i<this.length; i++) {
    var e = this[i]
    for (var j=0; j<arguments.length; j++) {
      if (!this[i][arguments[j]])
        continue topLoop
    }
    a[a.length] = e
  }
  return a
}

// some common helper methods

if (!Function.prototype.bind) {
  /**
    Creates a function that calls this function in the scope of the given
    object.

      var obj = { x: 'obj' }
      var f = function() { return this.x }
      window.x = 'window'
      f()
      // => 'window'
      var g = f.bind(obj)
      g()
      // => 'obj'

    @param object Object to bind this function to
    @return Function bound to object
    @addon
    */
  Function.prototype.bind = function(object) {
    var t = this
    return function() {
      return t.apply(object, arguments)
    }
  }
}

if (!Array.prototype.last) {
  /**
    Returns the last element of the array.

    @return The last element of the array
    @addon
    */
  Array.prototype.last = function() {
    return this[this.length-1]
  }
}
if (!Array.prototype.indexOf) {
  /**
    Returns the index of obj if it is in the array.
    Returns -1 otherwise.

    @param obj The object to find from the array.
    @return The index of obj or -1 if obj isn't in the array.
    @addon
    */
  Array.prototype.indexOf = function(obj) {
    for (var i=0; i<this.length; i++)
      if (obj == this[i]) return i
    return -1
  }
}
if (!Array.prototype.includes) {
  /**
    Returns true if obj is in the array.
    Returns false if it isn't.

    @param obj The object to find from the array.
    @return True if obj is in the array, false if it isn't
    @addon
    */
  Array.prototype.includes = function(obj) {
    return (this.indexOf(obj) >= 0);
  }
}
/**
  Iterate function f over each element of the array and return an array
  of the return values.

  @param f Function to apply to each element
  @return An array of return values from applying f on each element of the array
  @type Array
  @addon
  */
Array.prototype.map = function(f) {
  var na = new Array(this.length)
  if (f)
    for (var i=0; i<this.length; i++) na[i] = f(this[i], i, this)
  else
    for (var i=0; i<this.length; i++) na[i] = this[i]
  return na
}
Array.prototype.forEach = function(f) {
  for (var i=0; i<this.length; i++) f(this[i], i, this)
}
if (!Array.prototype.reduce) {
  Array.prototype.reduce = function(f, s) {
    var i = 0
    if (arguments.length == 1) {
      s = this[0]
      i++
    }
    for(; i<this.length; i++) {
      s = f(s, this[i], i, this)
    }
    return s
  }
}
if (!Array.prototype.find) {
  Array.prototype.find = function(f) {
    for(var i=0; i<this.length; i++) {
      if (f(this[i], i, this)) return this[i]
    }
  }
}

if (!String.prototype.capitalize) {
  /**
    Returns a copy of this string with the first character uppercased.

    @return Capitalized version of the string
    @type String
    @addon
    */
  String.prototype.capitalize = function() {
    return this.replace(/^./, this.slice(0,1).toUpperCase())
  }
}

if (!String.prototype.escape) {
  /**
    Returns a version of the string that can be used as a string literal.

    @return Copy of string enclosed in double-quotes, with double-quotes
            inside string escaped.
    @type String
    @addon
    */
  String.prototype.escape = function() {
    return '"' + this.replace(/"/g, '\\"') + '"'
  }
}
if (!String.prototype.splice) {
  String.prototype.splice = function(start, count, replacement) {
    return this.slice(0,start) + replacement + this.slice(start+count)
  }
}
if (!String.prototype.strip) {
  /**
    Returns a copy of the string with preceding and trailing whitespace
    removed.

    @return Copy of string sans surrounding whitespace.
    @type String
    @addon
    */
  String.prototype.strip = function() {
    return this.replace(/^\s+|\s+$/g, '')
  }
}

if (!window['$A']) {
  /**
    Creates a new array from an object with #length.
    */
  $A = function(obj) {
    var a = new Array(obj.length)
    for (var i=0; i<obj.length; i++)
      a[i] = obj[i]
    return a
  }
}

if (!window['$']) {
  $ = function(id) {
    return document.getElementById(id)
  }
}

if (!Math.sinh) {
  /**
    Returns the hyperbolic sine of x.

    @param x The value for x
    @return The hyperbolic sine of x
    @addon
    */
  Math.sinh = function(x) {
    return 0.5 * (Math.exp(x) - Math.exp(-x))
  }
  /**
    Returns the inverse hyperbolic sine of x.

    @param x The value for x
    @return The inverse hyperbolic sine of x
    @addon
    */
  Math.asinh = function(x) {
    return Math.log(x + Math.sqrt(x*x + 1))
  }
}
if (!Math.cosh) {
  /**
    Returns the hyperbolic cosine of x.

    @param x The value for x
    @return The hyperbolic cosine of x
    @addon
    */
  Math.cosh = function(x) {
    return 0.5 * (Math.exp(x) + Math.exp(-x))
  }
  /**
    Returns the inverse hyperbolic cosine of x.

    @param x The value for x
    @return The inverse hyperbolic cosine of x
    @addon
    */
  Math.acosh = function(x) {
    return Math.log(x + Math.sqrt(x*x - 1))
  }
}

/**
  Creates and configures a DOM element.

  The tag of the element is given by name.

  If params is a string, it is used as the innerHTML of the created element.
  If params is a DOM element, it is appended to the created element.
  If params is an object, it is treated as a config object and merged
  with the created element.

  If params is a string or DOM element, the third argument is treated
  as the config object.

  Special attributes of the config object:
    * content
      - if content is a string, it is used as the innerHTML of the
        created element
      - if content is an element, it is appended to the created element
    * style
      - the style object is merged with the created element's style

  @param {String} name The tag for the created element
  @param params The content or config for the created element
  @param config The config for the created element if params is content
  @return The created DOM element
  */
E = function(name, params, config) {
  var el = document.createElement(name)
  if (params) {
    if (typeof(params) == 'string') {
      el.innerHTML = params
      params = config
    } else if (params.DOCUMENT_NODE) {
      el.appendChild(params)
      params = config
    }
    if (params) {
      if (params.style) {
        var style = params.style
        params = Object.clone(params)
        delete params.style
        Object.forceExtend(el.style, style)
      }
      if (params.content) {
        if (typeof(params.content) == 'string') {
          el.appendChild(T(params.content))
        } else {
          el.appendChild(params.content)
        }
        params = Object.clone(params)
        delete params.content
      }
      Object.forceExtend(el, params)
    }
  }
  return el
}
E.append = function(node) {
  for(var i=1; i<arguments.length; i++) {
    if (typeof(arguments[i]) == 'string') {
      node.appendChild(T(arguments[i]))
    } else {
      node.appendChild(arguments[i])
    }
  }
}
// Safari requires each canvas to have a unique id.
E.lastCanvasId = 0
/**
  Creates and returns a canvas element with width w and height h.

  @param {int} w The width for the canvas
  @param {int} h The height for the canvas
  @param config Optional config object to pass to E()
  @return The created canvas element
  */
E.canvas = function(w,h,config) {
  var id = 'canvas-uuid-' + E.lastCanvasId
  E.lastCanvasId++
  if (!config) config = {}
  return E('canvas', Object.extend(config, {id: id, width: w, height: h}))
}

/**
  Shortcut for document.createTextNode.

  @param {String} text The text for the text node
  @return The created text node
  */
T = function(text) {
  return document.createTextNode(text)
}

/**
  Merges the src object's attributes with the dst object, ignoring errors.

  @param dst The destination object
  @param src The source object
  @return The dst object
  @addon
  */
Object.forceExtend = function(dst, src) {
  for (var i in src) {
    try{ dst[i] = src[i] } catch(e) {}
  }
  return dst
}
// In case Object.extend isn't defined already, set it to Object.forceExtend.
if (!Object.extend)
  Object.extend = Object.forceExtend

/**
  Merges the src object's attributes with the dst object, preserving all dst
  object's current attributes.

  @param dst The destination object
  @param src The source object
  @return The dst object
  @addon
  */
Object.conditionalExtend = function(dst, src) {
  for (var i in src) {
    if (dst[i] == null)
      dst[i] = src[i]
  }
  return dst
}

/**
  Creates and returns a shallow copy of the src object.

  @param src The source object
  @return A clone of the src object
  @addon
  */
Object.clone = function(src) {
  if (!src || src == true)
    return src
  switch (typeof(src)) {
    case 'string':
      return Object.extend(src+'', src)
      break
    case 'number':
      return src
      break
    case 'function':
      obj = eval(src.toSource())
      return Object.extend(obj, src)
      break
    case 'object':
      if (src instanceof Array) {
        return Object.extend([], src)
      } else {
        return Object.extend({}, src)
      }
      break
  }
}

/**
  Creates and returns an Image object, with source URL set to src and
  onload handler set to onload.

  @param {String} src The source URL for the image
  @param {Function} onload The onload handler for the image
  @return The created Image object
  @type {Image}
  */
Object.loadImage = function(src, onload) {
  var img = new Image()
  if (onload)
    img.onload = onload
  img.src = src
  return img
}

/**
  Returns true if image is fully loaded and ready for use.

  @param image The image to check
  @return Whether the image is loaded or not
  @type {boolean}
  @addon
  */
Object.isImageLoaded = function(image) {
  if (image.tagName == 'CANVAS') return true
  if (!image.complete) return false
  if (image.naturalWidth == null) return true
  return !!image.naturalWidth
}

/**
  Sums two objects.
  */
Object.sum = function(a,b) {
  if (a instanceof Array) {
    if (b instanceof Array) {
      var ab = []
      for (var i=0; i<a.length; i++) {
        ab[i] = a[i] + b[i]
      }
      return ab
    } else {
      return a.map(function(v){ return v + b })
    }
  } else if (b instanceof Array) {
    return b.map(function(v){ return v + a })
  } else {
    return a + b
  }
}

/**
  Substracts b from a.
  */
Object.sub = function(a,b) {
  if (a instanceof Array) {
    if (b instanceof Array) {
      var ab = []
      for (var i=0; i<a.length; i++) {
        ab[i] = a[i] - b[i]
      }
      return ab
    } else {
      return a.map(function(v){ return v - b })
    }
  } else if (b instanceof Array) {
    return b.map(function(v){ return a - v })
  } else {
    return a - b
  }
}

if (!window.Mouse) Mouse = {}
/**
  Returns the coordinates for a mouse event relative to element.
  Element must be the target for the event.

  @param element The element to compare against
  @param event The mouse event
  @return An object of form {x: relative_x, y: relative_y}
  */
Mouse.getRelativeCoords = function(element, event) {
  var xy = {x:0, y:0}
  var osl = 0
  var ost = 0
  var el = element
  while (el) {
    osl += el.offsetLeft
    ost += el.offsetTop
    el = el.offsetParent
  }
  xy.x = event.pageX - osl
  xy.y = event.pageY - ost
  return xy
}

Browser = (function(){
  var ua = window.navigator.userAgent
  var khtml = ua.match(/KHTML/)
  var gecko = ua.match(/Gecko/)
  var webkit = ua.match(/WebKit\/\d+/)
  var ie = ua.match(/Explorer/)
  if (khtml) return 'KHTML'
  if (gecko) return 'Gecko'
  if (webkit) return 'Webkit'
  if (ie) return 'IE'
  return 'UNKNOWN'
})()


Mouse.LEFT = 0
Mouse.MIDDLE = 1
Mouse.RIGHT = 2

if (Browser == 'IE') {
  Mouse.LEFT = 1
  Mouse.MIDDLE = 4
}


/**
  Klass is a function that returns a constructor function.

  The constructor function calls #initialize with its arguments.

  The parameters to Klass have their prototypes or themselves merged with the
  constructor function's prototype.

  Finally, the constructor function's prototype is merged with the constructor
  function. So you can write Shape.getArea.call(this) instead of
  Shape.prototype.getArea.call(this).

  Shape = Klass({
    getArea : function() {
      raise('No area defined!')
    }
  })

  Rectangle = Klass(Shape, {
    initialize : function(x, y) {
      this.x = x
      this.y = y
    },

    getArea : function() {
      return this.x * this.y
    }
  })

  Square = Klass(Rectangle, {
    initialize : function(s) {
      Rectangle.initialize.call(this, s, s)
    }
  })

  new Square(5).getArea()
  //=> 25

  @return Constructor object for the class
  */
Klass = function() {
  var c = function() {
    this.initialize.apply(this, arguments)
  }
  c.ancestors = $A(arguments)
  c.prototype = {}
  for(var i = 0; i<arguments.length; i++) {
    var a = arguments[i]
    if (a.prototype) {
      Object.extend(c.prototype, a.prototype)
    } else {
      Object.extend(c.prototype, a)
    }
  }
  Object.extend(c, c.prototype)
  return c
}



Curves = {

  angularDistance : function(a, b) {
    var pi2 = Math.PI*2
    var d = (b - a) % pi2
    if (d > Math.PI) d -= pi2
    if (d < -Math.PI) d += pi2
    return d
  },

  linePoint : function(a, b, t) {
    return [a[0]+(b[0]-a[0])*t, a[1]+(b[1]-a[1])*t]
  },

  quadraticPoint : function(a, b, c, t) {
    // var d = this.linePoint(a,b,t)
    // var e = this.linePoint(b,c,t)
    // return this.linePoint(d,e,t)
    var dx = a[0]+(b[0]-a[0])*t
    var ex = b[0]+(c[0]-b[0])*t
    var x = dx+(ex-dx)*t
    var dy = a[1]+(b[1]-a[1])*t
    var ey = b[1]+(c[1]-b[1])*t
    var y = dy+(ey-dy)*t
    return [x,y]
  },

  cubicPoint : function(a, b, c, d, t) {
    var ax3 = a[0]*3
    var bx3 = b[0]*3
    var cx3 = c[0]*3
    var ay3 = a[1]*3
    var by3 = b[1]*3
    var cy3 = c[1]*3
    return [
      a[0] + t*(bx3 - ax3 + t*(ax3-2*bx3+cx3 + t*(bx3-a[0]-cx3+d[0]))),
      a[1] + t*(by3 - ay3 + t*(ay3-2*by3+cy3 + t*(by3-a[1]-cy3+d[1])))
    ]
  },

  linearValue : function(a,b,t) {
    return a + (b-a)*t
  },

  quadraticValue : function(a,b,c,t) {
    var d = a + (b-a)*t
    var e = b + (c-b)*t
    return d + (e-d)*t
  },

  cubicValue : function(a,b,c,d,t) {
    var a3 = a*3, b3 = b*3, c3 = c*3
    return a + t*(b3 - a3 + t*(a3-2*b3+c3 + t*(b3-a-c3+d)))
  },

  catmullRomPoint : function (a,b,c,d, t) {
    var af = ((-t+2)*t-1)*t*0.5
    var bf = (((3*t-5)*t)*t+2)*0.5
    var cf = ((-3*t+4)*t+1)*t*0.5
    var df = ((t-1)*t*t)*0.5
    return [
      a[0]*af + b[0]*bf + c[0]*cf + d[0]*df,
      a[1]*af + b[1]*bf + c[1]*cf + d[1]*df
    ]
  },

  catmullRomAngle : function (a,b,c,d, t) {
    var dx = 0.5 * (c[0] - a[0] + 2*t*(2*a[0] - 5*b[0] + 4*c[0] - d[0]) +
             3*t*t*(3*b[0] + d[0] - a[0] - 3*c[0]))
    var dy = 0.5 * (c[1] - a[1] + 2*t*(2*a[1] - 5*b[1] + 4*c[1] - d[1]) +
             3*t*t*(3*b[1] + d[1] - a[1] - 3*c[1]))
    return Math.atan2(dy, dx)
  },

  catmullRomPointAngle : function (a,b,c,d, t) {
    var p = this.catmullRomPoint(a,b,c,d,t)
    var a = this.catmullRomAngle(a,b,c,d,t)
    return {point:p, angle:a}
  },

  lineAngle : function(a,b) {
    return Math.atan2(b[1]-a[1], b[0]-a[0])
  },

  quadraticAngle : function(a,b,c,t) {
    var d = this.linePoint(a,b,t)
    var e = this.linePoint(b,c,t)
    return this.lineAngle(d,e)
  },

  cubicAngle : function(a, b, c, d, t) {
    var e = this.quadraticPoint(a,b,c,t)
    var f = this.quadraticPoint(b,c,d,t)
    return this.lineAngle(e,f)
  },

  lineLength : function(a,b) {
    var x = (b[0]-a[0])
    var y = (b[1]-a[1])
    return Math.sqrt(x*x + y*y)
  },

  squareLineLength : function(a,b) {
    var x = (b[0]-a[0])
    var y = (b[1]-a[1])
    return x*x + y*y
  },

  quadraticLength : function(a,b,c, error) {
    var p1 = this.linePoint(a,b,2/3)
    var p2 = this.linePoint(b,c,1/3)
    return this.cubicLength(a,p1,p2,c, error)
  },

  cubicLength : (function() {
    var bezsplit = function(v) {
      var vtemp = [v.slice(0)]

      for (var i=1; i < 4; i++) {
        vtemp[i] = [[],[],[],[]]
        for (var j=0; j < 4-i; j++) {
          vtemp[i][j][0] = 0.5 * (vtemp[i-1][j][0] + vtemp[i-1][j+1][0])
          vtemp[i][j][1] = 0.5 * (vtemp[i-1][j][1] + vtemp[i-1][j+1][1])
        }
      }
      var left = []
      var right = []
      for (var j=0; j<4; j++) {
        left[j] = vtemp[j][0]
        right[j] = vtemp[3-j][j]
      }
      return [left, right]
    }

    var addifclose = function(v, error) {
      var len = 0
      for (var i=0; i < 3; i++) {
        len += Curves.lineLength(v[i], v[i+1])
      }
      var chord = Curves.lineLength(v[0], v[3])
      if ((len - chord) > error) {
        var lr = bezsplit(v)
        len = addifclose(lr[0], error) + addifclose(lr[1], error)
      }
      return len
    }

    return function(a,b,c,d, error) {
      if (!error) error = 1
      return addifclose([a,b,c,d], error)
    }
  })(),

  quadraticLengthPointAngle : function(a,b,c,lt,error) {
    var p1 = this.linePoint(a,b,2/3)
    var p2 = this.linePoint(b,c,1/3)
    return this.cubicLengthPointAngle(a,p1,p2,c, error)
  },

  cubicLengthPointAngle : function(a,b,c,d,lt,error) {
    // this thing outright rapes the GC.
    // how about not creating a billion arrays, hmm?
    var len = this.cubicLength(a,b,c,d,error)
    var point = a
    var prevpoint = a
    var lengths = []
    var prevlensum = 0
    var lensum = 0
    var tl = lt*len
    var segs = 20
    var fac = 1/segs
    for (var i=1; i<=segs; i++) { // FIXME get smarter
      prevpoint = point
      point = this.cubicPoint(a,b,c,d, fac*i)
      prevlensum = lensum
      lensum += this.lineLength(prevpoint, point)
      if (lensum >= tl) {
        if (lensum == prevlensum)
          return {point: point, angle: this.lineAngle(a,b)}
        var dl = lensum - tl
        var dt = dl / (lensum-prevlensum)
        return {point: this.linePoint(prevpoint, point, 1-dt),
                angle: this.cubicAngle(a,b,c,d, fac*(i-dt)) }
      }
    }
    return {point: d.slice(0), angle: this.lineAngle(c,d)}
  }

}



/**
  Color helper functions.
  */
Colors = {

  /**
    Converts an HSL color to its corresponding RGB color.

    @param h Hue in degrees (0 .. 359)
    @param s Saturation (0.0 .. 1.0)
    @param l Lightness (0 .. 255)
    @return The corresponding RGB color as [r,g,b]
    @type Array
    */
  hsl2rgb : function(h,s,l) {
    var r,g,b
    if (s == 0) {
      r=g=b=v
    } else {
      var q = (l < 0.5 ? l * (1+s) : l+s-(l*s))
      var p = 2 * l - q
      var hk = (h % 360) / 360
      var tr = hk + 1/3
      var tg = hk
      var tb = hk - 1/3
      if (tr < 0) tr++
      if (tr > 1) tr--
      if (tg < 0) tg++
      if (tg > 1) tg--
      if (tb < 0) tb++
      if (tb > 1) tb--
      if (tr < 1/6)
        r = p + ((q-p)*6*tr)
      else if (tr < 1/2)
        r = q
      else if (tr < 2/3)
        r = p + ((q-p)*6*(2/3 - tr))
      else
        r = p

      if (tg < 1/6)
        g = p + ((q-p)*6*tg)
      else if (tg < 1/2)
        g = q
      else if (tg < 2/3)
        g = p + ((q-p)*6*(2/3 - tg))
      else
        g = p

      if (tb < 1/6)
        b = p + ((q-p)*6*tb)
      else if (tb < 1/2)
        b = q
      else if (tb < 2/3)
        b = p + ((q-p)*6*(2/3 - tb))
      else
        b = p
    }

    return [r,g,b]
  },

  /**
    Converts an HSV color to its corresponding RGB color.

    @param h Hue in degrees (0 .. 359)
    @param s Saturation (0.0 .. 1.0)
    @param v Value (0 .. 255)
    @return The corresponding RGB color as [r,g,b]
    @type Array
    */
  hsv2rgb : function(h,s,v) {
    var r,g,b
    if (s == 0) {
      r=g=b=v
    } else {
      h = (h % 360)/60.0
      var i = Math.floor(h)
      var f = h-i
      var p = v * (1-s)
      var q = v * (1-s*f)
      var t = v * (1-s*(1-f))
      switch (i) {
        case 0:
          r = v
          g = t
          b = p
          break
        case 1:
          r = q
          g = v
          b = p
          break
        case 2:
          r = p
          g = v
          b = t
          break
        case 3:
          r = p
          g = q
          b = v
          break
        case 4:
          r = t
          g = p
          b = v
          break
        case 5:
          r = v
          g = p
          b = q
          break
      }
    }
    return [r,g,b]
  },

  /**
    Parses a color style object into one that can be used with the given
    canvas context.

    Accepted formats:
      'white'
      '#fff'
      '#ffffff'
      'rgba(255,255,255, 1.0)'
      [255, 255, 255]
      [255, 255, 255, 1.0]
      new Gradient(...)
      new Pattern(...)

    @param style The color style to parse
    @param ctx Canvas 2D context on which the style is to be used
    @return A parsed style, ready to be used as ctx.fillStyle / strokeStyle
    */
  parseColorStyle : function(style, ctx) {
    if (typeof style == 'string') {
      return style
    } else if (style.compiled) {
      return style.compiled
    } else if (style.isPattern) {
      return style.compile(ctx)
    } else if (style.length == 3) {
      return 'rgba('+style.map(Math.round).join(",")+', 1)'
    } else if (style.length == 4) {
      return 'rgba('+
              Math.round(style[0])+','+
              Math.round(style[1])+','+
              Math.round(style[2])+','+
              style[3]+
             ')'
    } else { // wtf
      throw( "Bad style: " + style )
    }
  }
}



/**
  Navigating around differing implementations of canvas features.

  Current issues:

  isPointInPath(x,y):

    Opera supports isPointInPath.

    Safari doesn't have isPointInPath. So you need to keep track of the CTM and
    do your own in-fill-checking. Which is done for circles and rectangles
    in Circle#isPointInPath and Rectangle#isPointInPath.
    Paths use an inaccurate bounding box test, implemented in
    Path#isPointInPath.

    Firefox 3 has isPointInPath. But it uses user-space coordinates.
    Which can be easily navigated around because it has setTransform.

    Firefox 2 has isPointInPath. But it uses user-space coordinates.
    And there's no setTransform, so you need to keep track of the CTM and
    multiply the mouse vector with the CTM's inverse.

  Drawing text:

    Rhino has ctx.drawString(x,y, text)

    Firefox has ctx.mozDrawText(text)

    The WhatWG spec, Safari and Opera have nothing.

*/
CanvasSupport = {
  DEVICE_SPACE : 0, // Opera
  USER_SPACE : 1,   // Fx2, Fx3
  isPointInPathMode : null,
  supportsIsPointInPath : null,
  supportsCSSTransform : null,
  supportsCanvas : null,

  isCanvasSupported : function() {
    if (this.supportsCanvas == null) {
      var e = {};
      try { e = E('canvas'); } catch(x) {}
      this.supportsCanvas = (e.getContext != null);
    }
    return this.supportsCanvas;
  },

  isCSSTransformSupported : function() {
    if (this.supportsCSSTransform == null) {
      var e = E('div')
      var dbs = e.style
      var s = (dbs.webkitTransform != null || dbs.MozTransform != null)
      this.supportsCSSTransform = (s != null)
    }
    return this.supportsCSSTransform
  },

  getTestContext : function() {
    if (!this.testContext) {
      var c = E.canvas(1,1)
      this.testContext = c.getContext('2d')
    }
    return this.testContext
  },

  getSupportsAudioTag : function() {
    var e = E('audio')
    return !!e.play
  },

  getSupportsSoundManager : function() {
    return (window.soundManager && soundManager.enabled)
  },

  soundId : 0,

  getSoundObject : function() {
    var e = null
//     if (this.getSupportsAudioTag()) {
//       e = this.getAudioTagSoundObject()
//     } else
    if (this.getSupportsSoundManager()) {
      e = this.getSoundManagerSoundObject()
    }
    return e
  },

  getAudioTagSoundObject : function() {
    var sid = 'sound-' + this.soundId++
    var e = E('audio', {id: sid})
    e.load = function(src) {
      this.src = src
    }
    e.addEventListener('canplaythrough', function() {
      if (this.onready) this.onready()
    }, false)
    e.setVolume = function(v){ this.volume = v }
    e.setPan = function(v){ this.pan = v }
    return e
  },

  getSoundManagerSoundObject : function() {
    var sid = 'sound-' + this.soundId++
    var e = {
      volume: 100,
      pan: 0,
      sid : sid,
      load : function(src) {
        return soundManager.load(this.sid, {
          url: src,
          autoPlay: false,
          volume: this.volume,
          pan: this.pan
        })
      },
      _onload : function() {
        if (this.onload) this.onload()
        if (this.onready) this.onready()
      },
      _onerror : function() {
        if (this.onerror) this.onerror()
      },
      _onfinish : function() {
        if (this.onfinish) this.onfinish()
      },
      play : function() {
        return soundManager.play(this.sid)
      },
      stop : function() {
        return soundManager.stop(this.sid)
      },
      pause : function() {
        return soundManager.togglePause(this.sid)
      },
      setVolume : function(v) {
        this.volume = v*100
        return soundManager.setVolume(this.sid, v*100)
      },
      setPan : function(v) {
        this.pan = v*100
        return soundManager.setPan(this.sid, v*100)
      }
    }
    soundManager.createSound(sid, 'null.mp3')
    e.sound = soundManager.getSoundById(sid)
    e.sound.options.onfinish = e._onfinish.bind(e)
    e.sound.options.onload = e._onload.bind(e)
    e.sound.options.onerror = e._onerror.bind(e)
    return e
  },

  /**
    Canvas context augment module that adds setters.
    */
  ContextSetterAugment : {
    setFillStyle : function(fs) { this.fillStyle = fs },
    setStrokeStyle : function(ss) { this.strokeStyle = ss },
    setGlobalAlpha : function(ga) { this.globalAlpha = ga },
    setLineWidth : function(lw) { this.lineWidth = lw },
    setLineCap : function(lw) { this.lineCap = lw },
    setLineJoin : function(lw) { this.lineJoin = lw },
    setMiterLimit : function(lw) { this.miterLimit = lw },
    setGlobalCompositeOperation : function(lw) {
      this.globalCompositeOperation = lw
    },
    setShadowColor : function(x) { this.shadowColor = x },
    setShadowBlur : function(x) { this.shadowBlur = x },
    setShadowOffsetX : function(x) { this.shadowOffsetX = x },
    setShadowOffsetY : function(x) { this.shadowOffsetY = x },
    setMozTextStyle : function(x) { this.mozTextStyle = x },
    setFont : function(x) { this.font = x },
    setTextAlign : function(x) { this.textAlign = x },
    setTextBaseline : function(x) { this.textBaseline = x }
  },

  ContextJSImplAugment : {
    identity : function() {
      CanvasSupport.setTransform(this, [1,0,0,1,0,0])
    }
  },

  /**
    Augments a canvas context with setters.
    */
  augment : function(ctx) {
    Object.conditionalExtend(ctx, this.ContextSetterAugment)
    Object.conditionalExtend(ctx, this.ContextJSImplAugment)
    return ctx
  },

  /**
    Gets the augmented context for canvas.
    */
  getContext : function(canvas, type) {
    var ctx = canvas.getContext(type || '2d')
    this.augment(ctx)
    return ctx
  },


  /**
    Multiplies two 3x2 affine 2D column-major transformation matrices with
    each other and stores the result in the first matrix.

    Returns the multiplied matrix m1.
    */
  tMatrixMultiply : function(m1, m2) {
    var m11 = m1[0]*m2[0] + m1[2]*m2[1]
    var m12 = m1[1]*m2[0] + m1[3]*m2[1]

    var m21 = m1[0]*m2[2] + m1[2]*m2[3]
    var m22 = m1[1]*m2[2] + m1[3]*m2[3]

    var dx = m1[0]*m2[4] + m1[2]*m2[5] + m1[4]
    var dy = m1[1]*m2[4] + m1[3]*m2[5] + m1[5]

    m1[0] = m11
    m1[1] = m12
    m1[2] = m21
    m1[3] = m22
    m1[4] = dx
    m1[5] = dy

    return m1
  },

  /**
    Multiplies the vector [x, y, 1] with the 3x2 transformation matrix m.
    */
  tMatrixMultiplyPoint : function(m, x, y) {
    return [
      x*m[0] + y*m[2] + m[4],
      x*m[1] + y*m[3] + m[5]
    ]
  },

  /**
    Inverts a 3x2 affine 2D column-major transformation matrix.

    Returns an inverted copy of the matrix.
    */
  tInvertMatrix : function(m) {
    var d = 1 / (m[0]*m[3]-m[1]*m[2])
    return [
      m[3]*d, -m[1]*d,
      -m[2]*d, m[0]*d,
      d*(m[2]*m[5]-m[3]*m[4]), d*(m[1]*m[4]-m[0]*m[5])
    ]
  },

  /**
    Applies a transformation matrix m on the canvas context ctx.
    */
  transform : function(ctx, m) {
    if (ctx.transform)
      return ctx.transform.apply(ctx, m)
    ctx.translate(m[4], m[5])
    // scale
    if (Math.abs(m[1]) < 1e-6 && Math.abs(m[2]) < 1e-6) {
      ctx.scale(m[0], m[3])
      return
    }
    var res = this.svdTransform({xx:m[0], xy:m[2], yx:m[1], yy:m[3], dx:m[4], dy:m[5]})
    ctx.rotate(res.angle2)
    ctx.scale(res.sx, res.sy)
    ctx.rotate(res.angle1)
    return
  },

  // broken svd...
  brokenSvd : function(m) {
    var mt = [m[0], m[2], m[1], m[3], 0,0]
    var mtm = [
      mt[0]*m[0]+mt[2]*m[1],
      mt[1]*m[0]+mt[3]*m[1],
      mt[0]*m[2]+mt[2]*m[3],
      mt[1]*m[2]+mt[3]*m[3],
      0,0
    ]
    // (mtm[0]-x) * (mtm[3]-x) - (mtm[1]*mtm[2]) = 0
    // x*x - (mtm[0]+mtm[3])*x - (mtm[1]*mtm[2])+(mtm[0]*mtm[3]) = 0
    var a = 1
    var b = -(mtm[0]+mtm[3])
    var c = -(mtm[1]*mtm[2])+(mtm[0]*mtm[3])
    var d = Math.sqrt(b*b - 4*a*c)
    var c1 = (-b + d) / (2*a)
    var c2 = (-b - d) / (2*a)
    if (c1 < c2)
      var tmp = c1, c1 = c2, c2 = tmp
    var s1 = Math.sqrt(c1)
    var s2 = Math.sqrt(c2)
    var i_s = [1/s1, 0, 0, 1/s2, 0,0]
    // (mtm[0]-c1)*x1 + mtm[2]*x2 = 0
    // mtm[1]*x1 + (mtm[3]-c1)*x2 = 0
    // x2 = -(mtm[0]-c1)*x1 / mtm[2]
    var e = ((mtm[0]-c1)/mtm[2])
    var l = Math.sqrt(1 + e*e)
    var v00 = 1 / l
    var v10 = e / l
    var v11 = v00
    var v01 = -v10
    var v = [v00, v01, v10, v11, 0,0]
    var u = m.slice(0)
    this.tMatrixMultiply(u,v)
    this.tMatrixMultiply(u,i_s)
    return [u, [s1,0,0,s2,0,0], [v00, v10, v01, v11, 0, 0]]
  },


  svdTransform : (function(){
    //   Copyright (c) 2004-2005, The Dojo Foundation
    //   All Rights Reserved
    var m = {}
    m.Matrix2D = function(arg){
      // summary: a 2D matrix object
      // description: Normalizes a 2D matrix-like object. If arrays is passed,
      //    all objects of the array are normalized and multiplied sequentially.
      // arg: Object
      //    a 2D matrix-like object, a number, or an array of such objects
      if(arg){
        if(typeof arg == "number"){
          this.xx = this.yy = arg;
        }else if(arg instanceof Array){
          if(arg.length > 0){
            var matrix = m.normalize(arg[0]);
            // combine matrices
            for(var i = 1; i < arg.length; ++i){
              var l = matrix, r = m.normalize(arg[i]);
              matrix = new m.Matrix2D();
              matrix.xx = l.xx * r.xx + l.xy * r.yx;
              matrix.xy = l.xx * r.xy + l.xy * r.yy;
              matrix.yx = l.yx * r.xx + l.yy * r.yx;
              matrix.yy = l.yx * r.xy + l.yy * r.yy;
              matrix.dx = l.xx * r.dx + l.xy * r.dy + l.dx;
              matrix.dy = l.yx * r.dx + l.yy * r.dy + l.dy;
            }
            Object.extend(this, matrix);
          }
        }else{
          Object.extend(this, arg);
        }
      }
    }
    // ensure matrix 2D conformance
    m.normalize = function(matrix){
        // summary: converts an object to a matrix, if necessary
        // description: Converts any 2D matrix-like object or an array of
        //    such objects to a valid dojox.gfx.matrix.Matrix2D object.
        // matrix: Object: an object, which is converted to a matrix, if necessary
        return (matrix instanceof m.Matrix2D) ? matrix : new m.Matrix2D(matrix); // dojox.gfx.matrix.Matrix2D
    }
    m.multiply = function(matrix){
      // summary: combines matrices by multiplying them sequentially in the given order
      // matrix: dojox.gfx.matrix.Matrix2D...: a 2D matrix-like object,
      //    all subsequent arguments are matrix-like objects too
      var M = m.normalize(matrix);
      // combine matrices
      for(var i = 1; i < arguments.length; ++i){
        var l = M, r = m.normalize(arguments[i]);
        M = new m.Matrix2D();
        M.xx = l.xx * r.xx + l.xy * r.yx;
        M.xy = l.xx * r.xy + l.xy * r.yy;
        M.yx = l.yx * r.xx + l.yy * r.yx;
        M.yy = l.yx * r.xy + l.yy * r.yy;
        M.dx = l.xx * r.dx + l.xy * r.dy + l.dx;
        M.dy = l.yx * r.dx + l.yy * r.dy + l.dy;
      }
      return M; // dojox.gfx.matrix.Matrix2D
    }
    m.invert = function(matrix) {
      var M = m.normalize(matrix),
        D = M.xx * M.yy - M.xy * M.yx,
        M = new m.Matrix2D({
          xx: M.yy/D, xy: -M.xy/D,
          yx: -M.yx/D, yy: M.xx/D,
          dx: (M.xy * M.dy - M.yy * M.dx) / D,
          dy: (M.yx * M.dx - M.xx * M.dy) / D
        });
      return M; // dojox.gfx.matrix.Matrix2D
    }
    // the default (identity) matrix, which is used to fill in missing values
    Object.extend(m.Matrix2D, {xx: 1, xy: 0, yx: 0, yy: 1, dx: 0, dy: 0});

    var eq = function(/* Number */ a, /* Number */ b){
      // summary: compare two FP numbers for equality
      return Math.abs(a - b) <= 1e-6 * (Math.abs(a) + Math.abs(b)); // Boolean
    };

    var calcFromValues = function(/* Number */ s1, /* Number */ s2){
      // summary: uses two close FP values to approximate the result
      if(!isFinite(s1)){
        return s2;  // Number
      }else if(!isFinite(s2)){
        return s1;  // Number
      }
      return (s1 + s2) / 2; // Number
    };

    var transpose = function(/* dojox.gfx.matrix.Matrix2D */ matrix){
      // matrix: dojox.gfx.matrix.Matrix2D: a 2D matrix-like object
      var M = new m.Matrix2D(matrix);
      return Object.extend(M, {dx: 0, dy: 0, xy: M.yx, yx: M.xy}); // dojox.gfx.matrix.Matrix2D
    };

    var scaleSign = function(/* dojox.gfx.matrix.Matrix2D */ matrix){
      return (matrix.xx * matrix.yy < 0 || matrix.xy * matrix.yx > 0) ? -1 : 1; // Number
    };

    var eigenvalueDecomposition = function(/* dojox.gfx.matrix.Matrix2D */ matrix){
      // matrix: dojox.gfx.matrix.Matrix2D: a 2D matrix-like object
      var M = m.normalize(matrix),
        b = -M.xx - M.yy,
        c = M.xx * M.yy - M.xy * M.yx,
        d = Math.sqrt(b * b - 4 * c),
        l1 = -(b + (b < 0 ? -d : d)) / 2,
        l2 = c / l1,
        vx1 = M.xy / (l1 - M.xx), vy1 = 1,
        vx2 = M.xy / (l2 - M.xx), vy2 = 1;
      if(eq(l1, l2)){
        vx1 = 1, vy1 = 0, vx2 = 0, vy2 = 1;
      }
      if(!isFinite(vx1)){
        vx1 = 1, vy1 = (l1 - M.xx) / M.xy;
        if(!isFinite(vy1)){
          vx1 = (l1 - M.yy) / M.yx, vy1 = 1;
          if(!isFinite(vx1)){
            vx1 = 1, vy1 = M.yx / (l1 - M.yy);
          }
        }
      }
      if(!isFinite(vx2)){
        vx2 = 1, vy2 = (l2 - M.xx) / M.xy;
        if(!isFinite(vy2)){
          vx2 = (l2 - M.yy) / M.yx, vy2 = 1;
          if(!isFinite(vx2)){
            vx2 = 1, vy2 = M.yx / (l2 - M.yy);
          }
        }
      }
      var d1 = Math.sqrt(vx1 * vx1 + vy1 * vy1),
        d2 = Math.sqrt(vx2 * vx2 + vy2 * vy2);
      if(isNaN(vx1 /= d1)){ vx1 = 0; }
      if(isNaN(vy1 /= d1)){ vy1 = 0; }
      if(isNaN(vx2 /= d2)){ vx2 = 0; }
      if(isNaN(vy2 /= d2)){ vy2 = 0; }
      return {  // Object
        value1: l1,
        value2: l2,
        vector1: {x: vx1, y: vy1},
        vector2: {x: vx2, y: vy2}
      };
    };

    var decomposeSR = function(/* dojox.gfx.matrix.Matrix2D */ M, /* Object */ result){
      // summary: decomposes a matrix into [scale, rotate]; no checks are done.
      var sign = scaleSign(M),
        a = result.angle1 = (Math.atan2(M.yx, M.yy) + Math.atan2(-sign * M.xy, sign * M.xx)) / 2,
        cos = Math.cos(a), sin = Math.sin(a);
      result.sx = calcFromValues(M.xx / cos, -M.xy / sin);
      result.sy = calcFromValues(M.yy / cos, M.yx / sin);
      return result;  // Object
    };

    var decomposeRS = function(/* dojox.gfx.matrix.Matrix2D */ M, /* Object */ result){
      // summary: decomposes a matrix into [rotate, scale]; no checks are done
      var sign = scaleSign(M),
        a = result.angle2 = (Math.atan2(sign * M.yx, sign * M.xx) + Math.atan2(-M.xy, M.yy)) / 2,
        cos = Math.cos(a), sin = Math.sin(a);
      result.sx = calcFromValues(M.xx / cos, M.yx / sin);
      result.sy = calcFromValues(M.yy / cos, -M.xy / sin);
      return result;  // Object
    };

    return function(matrix){
      // summary: decompose a 2D matrix into translation, scaling, and rotation components
      // description: this function decompose a matrix into four logical components:
      //  translation, rotation, scaling, and one more rotation using SVD.
      //  The components should be applied in following order:
      //  | [translate, rotate(angle2), scale, rotate(angle1)]
      // matrix: dojox.gfx.matrix.Matrix2D: a 2D matrix-like object
      var M = m.normalize(matrix),
        result = {dx: M.dx, dy: M.dy, sx: 1, sy: 1, angle1: 0, angle2: 0};
      // detect case: [scale]
      if(eq(M.xy, 0) && eq(M.yx, 0)){
        return Object.extend(result, {sx: M.xx, sy: M.yy});  // Object
      }
      // detect case: [scale, rotate]
      if(eq(M.xx * M.yx, -M.xy * M.yy)){
        return decomposeSR(M, result);  // Object
      }
      // detect case: [rotate, scale]
      if(eq(M.xx * M.xy, -M.yx * M.yy)){
        return decomposeRS(M, result);  // Object
      }
      // do SVD
      var MT = transpose(M),
        u  = eigenvalueDecomposition([M, MT]),
        v  = eigenvalueDecomposition([MT, M]),
        U  = new m.Matrix2D({xx: u.vector1.x, xy: u.vector2.x, yx: u.vector1.y, yy: u.vector2.y}),
        VT = new m.Matrix2D({xx: v.vector1.x, xy: v.vector1.y, yx: v.vector2.x, yy: v.vector2.y}),
        S = new m.Matrix2D([m.invert(U), M, m.invert(VT)]);
      decomposeSR(VT, result);
      S.xx *= result.sx;
      S.yy *= result.sy;
      decomposeRS(U, result);
      S.xx *= result.sx;
      S.yy *= result.sy;
      return Object.extend(result, {sx: S.xx, sy: S.yy});  // Object
    };
  })(),


  /**
    Sets the canvas context ctx's transformation matrix to m, with ctm being
    the current transformation matrix.
    */
  setTransform : function(ctx, m, ctm) {
    if (ctx.setTransform)
      return ctx.setTransform.apply(ctx, m)
    this.transform(ctx, this.tInvertMatrix(ctm))
    this.transform(ctx, m)
  },

  /**
    Skews the canvas context by angle on the x-axis.
    */
  skewX : function(ctx, angle) {
    return this.transform(ctx, this.tSkewXMatrix(angle))
  },

  /**
    Skews the canvas context by angle on the y-axis.
    */
  skewY : function(ctx, angle) {
    return this.transform(ctx, this.tSkewYMatrix(angle))
  },

  /**
    Rotates a transformation matrix by angle.
    */
  tRotate : function(m1, angle) {
    // return this.tMatrixMultiply(matrix, this.tRotationMatrix(angle))
    var c = Math.cos(angle)
    var s = Math.sin(angle)
    var m11 = m1[0]*c + m1[2]*s
    var m12 = m1[1]*c + m1[3]*s
    var m21 = m1[0]*-s + m1[2]*c
    var m22 = m1[1]*-s + m1[3]*c
    m1[0] = m11
    m1[1] = m12
    m1[2] = m21
    m1[3] = m22
    return m1
  },

  /**
    Translates a transformation matrix by x and y.
    */
  tTranslate : function(m1, x, y) {
    // return this.tMatrixMultiply(matrix, this.tTranslationMatrix(x,y))
    m1[4] += m1[0]*x + m1[2]*y
    m1[5] += m1[1]*x + m1[3]*y
    return m1
  },

  /**
    Scales a transformation matrix by sx and sy.
    */
  tScale : function(m1, sx, sy) {
    // return this.tMatrixMultiply(matrix, this.tScalingMatrix(sx,sy))
    m1[0] *= sx
    m1[1] *= sx
    m1[2] *= sy
    m1[3] *= sy
    return m1
  },

  /**
    Skews a transformation matrix by angle on the x-axis.
    */
  tSkewX : function(m1, angle) {
    return this.tMatrixMultiply(m1, this.tSkewXMatrix(angle))
  },

  /**
    Skews a transformation matrix by angle on the y-axis.
    */
  tSkewY : function(m1, angle) {
    return this.tMatrixMultiply(m1, this.tSkewYMatrix(angle))
  },

  /**
    Returns a 3x2 2D column-major y-skew matrix for the angle.
    */
  tSkewXMatrix : function(angle) {
    return [ 1, 0, Math.tan(angle), 1, 0, 0 ]
  },

  /**
    Returns a 3x2 2D column-major y-skew matrix for the angle.
    */
  tSkewYMatrix : function(angle) {
    return [ 1, Math.tan(angle), 0, 1, 0, 0 ]
  },

  /**
    Returns a 3x2 2D column-major rotation matrix for the angle.
    */
  tRotationMatrix : function(angle) {
    var c = Math.cos(angle)
    var s = Math.sin(angle)
    return [ c, s, -s, c, 0, 0 ]
  },

  /**
    Returns a 3x2 2D column-major translation matrix for x and y.
    */
  tTranslationMatrix : function(x, y) {
    return [ 1, 0, 0, 1, x, y ]
  },

  /**
    Returns a 3x2 2D column-major scaling matrix for sx and sy.
    */
  tScalingMatrix : function(sx, sy) {
    return [ sx, 0, 0, sy, 0, 0 ]
  },

  /**
    Returns the name of the text backend to use.

    Possible values are:
      * 'MozText' for Firefox
      * 'DrawString' for Rhino
      * 'NONE' no text drawing

    @return The text backend name
    @type String
    */
  getTextBackend : function() {
    if (this.textBackend == null)
      this.textBackend = this.detectTextBackend()
    return this.textBackend
  },

  /**
    Detects the name of the text backend to use.

    Possible values are:
      * 'MozText' for Firefox
      * 'DrawString' for Rhino
      * 'NONE' no text drawing

    @return The text backend name
    @type String
    */
  detectTextBackend : function() {
    var ctx = this.getTestContext()
    if (ctx.fillText) {
      return 'HTML5'
    } else if (ctx.mozDrawText) {
      return 'MozText'
    } else if (ctx.drawString) {
      return 'DrawString'
    }
    return 'NONE'
  },

  getSupportsPutImageData : function() {
    if (this.supportsPutImageData == null) {
      var ctx = this.getTestContext()
      var support = ctx.putImageData
      if (support) {
        try {
          var idata = ctx.getImageData(0,0,1,1)
          idata[0] = 255
          idata[1] = 0
          idata[2] = 255
          idata[3] = 255
          ctx.putImageData({width: 1, height: 1, data: idata}, 0, 0)
          var idata = ctx.getImageData(0,0,1,1)
          support = [255, 0, 255, 255].equals(idata.data)
        } catch(e) {
          support = false
        }
      }
      this.supportsPutImageData = support
    }
    return support
  },

  /**
    Returns true if the browser can be coaxed to work with
    {@link CanvasSupport.isPointInPath}.

    @return Whether the browser supports isPointInPath or not
    @type boolean
    */
  getSupportsIsPointInPath : function() {
    if (this.supportsIsPointInPath == null)
      this.supportsIsPointInPath = !!this.getTestContext().isPointInPath
    return this.supportsIsPointInPath
  },

  /**
    Returns the coordinate system in which the isPointInPath of the
    browser operates. Possible coordinate systems are
    CanvasSupport.DEVICE_SPACE and CanvasSupport.USER_SPACE.

    @return The coordinate system for the browser's isPointInPath
    */
  getIsPointInPathMode : function() {
    if (this.isPointInPathMode == null)
      this.isPointInPathMode = this.detectIsPointInPathMode()
    return this.isPointInPathMode
  },

  /**
    Detects the coordinate system in which the isPointInPath of the
    browser operates. Possible coordinate systems are
    CanvasSupport.DEVICE_SPACE and CanvasSupport.USER_SPACE.

    @return The coordinate system for the browser's isPointInPath
    @private
    */
  detectIsPointInPathMode : function() {
    var ctx = this.getTestContext()
    var rv
    if (!ctx.isPointInPath)
      return this.USER_SPACE
    ctx.save()
    ctx.translate(1,0)
    ctx.beginPath()
    ctx.rect(0,0,1,1)
    if (ctx.isPointInPath(0.3,0.3)) {
      rv = this.USER_SPACE
    } else {
      rv = this.DEVICE_SPACE
    }
    ctx.restore()
    return rv
  },

  /**
    Returns true if the device-space point (x,y) is inside the fill of
    ctx's current path.

    @param ctx Canvas 2D context to query
    @param x The distance in pixels from the left side of the canvas element
    @param y The distance in pixels from the top side of the canvas element
    @param matrix The current transformation matrix. Needed if the browser has
                  no isPointInPath or the browser's isPointInPath works in
                  user-space coordinates and the browser doesn't support
                  setTransform.
    @param callbackObj If the browser doesn't support isPointInPath,
                       callbackObj.isPointInPath will be called with the
                       x,y-coordinates transformed to user-space.
    @param
    @return Whether (x,y) is inside ctx's current path or not
    @type boolean
    */
  isPointInPath : function(ctx, x, y, matrix, callbackObj) {
    var rv
    if (!ctx.isPointInPath) {
      if (callbackObj && callbackObj.isPointInPath) {
        var xy = this.tMatrixMultiplyPoint(this.tInvertMatrix(matrix), x, y)
        return callbackObj.isPointInPath(xy[0], xy[1])
      } else {
        return false
      }
    } else {
      if (this.getIsPointInPathMode() == this.USER_SPACE) {
        if (!ctx.setTransform) {
          var xy = this.tMatrixMultiplyPoint(this.tInvertMatrix(matrix), x, y)
          rv = ctx.isPointInPath(xy[0], xy[1])
        } else {
          ctx.save()
          ctx.setTransform(1,0,0,1,0,0)
          rv = ctx.isPointInPath(x,y)
          ctx.restore()
        }
      } else {
        rv = ctx.isPointInPath(x,y)
      }
      return rv
    }
  }
}


RecordingContext = Klass({
  objectId : 0,
  commands : [],
  isMockObject : true,

  initialize : function(commands) {
    this.commands = commands || []
    Object.conditionalExtend(this, this.getMockContext())
  },

  getMockContext : function() {
    if (!RecordingContext.MockContext) {
      var c = E.canvas(1,1)
      var ctx = CanvasSupport.getContext(c, '2d')
      var obj = {}
      for (var i in ctx) {
        if (typeof(ctx[i]) == 'function')
          obj[i] = this.createRecordingFunction(i)
        else
          obj[i] = ctx[i]
      }
      obj.isPointInPath = null
      obj.transform = null
      obj.setTransform = null
      RecordingContext.MockContext = obj
    }
    return RecordingContext.MockContext
  },

  createRecordingFunction : function(name){
    if (name.search(/^set[A-Z]/) != -1 && name != 'setTransform') {
      var varName = name.charAt(3).toLowerCase() + name.slice(4)
      return function(){
        this[varName] = arguments[0]
        this.commands.push([name, $A(arguments)])
      }
    } else {
      return function(){
        this.commands.push([name, $A(arguments)])
      }
    }
  },

  clear : function(){
    this.commands = []
  },

  getRecording : function() {
    return this.commands
  },

  serialize : function(width, height) {
    return '(' + {
      width: width, height: height,
      commands: this.getRecording()
    }.toSource() + ')'
  },

  play : function(ctx) {
    RecordingContext.play(ctx, this.getRecording())
  },

  createLinearGradient : function() {
    var id = this.objectId++
    this.commands.push([id, '=', 'createLinearGradient', $A(arguments)])
    return new MockGradient(this, id)
  },

  createRadialGradient : function() {
    var id = this.objectId++
    this.commands.push([id, '=', 'createRadialGradient', $A(arguments)])
    return new this.MockGradient(this, id)
  },

  createPattern : function() {
    var id = this.objectId++
    this.commands.push([id, '=', 'createPattern', $A(arguments)])
    return new this.MockGradient(this, id)
  },

  MockGradient : Klass({
    isMockObject : true,

    initialize : function(recorder, id) {
      this.recorder = recorder
      this.id = id
    },

    addColorStop : function() {
      this.recorder.commands.push([this.id, 'addColorStop', $A(arguments)])
    },

    toSource : function() {
      return {id : this.id, isMockObject : true}.toSource()
    }
  })
})
RecordingContext.play = function(ctx, commands) {
  var dictionary = []
  for (var i=0; i<commands.length; i++) {
    var cmd = commands[i]
    if (cmd.length == 2) {
      var args = cmd[1]
      if (args[0] && args[0].isMockObject) {
        ctx[cmd[0]](dictionary[args[0].id])
      } else {
        ctx[cmd[0]].apply(ctx, cmd[1])
      }
    } else if (cmd.length == 3) {
      var obj = dictionary[cmd[0]]
      obj[cmd[1]].apply(obj, cmd[2])
    } else if (cmd.length == 4) {
      dictionary[cmd[0]] = ctx[cmd[2]].apply(ctx, cmd[3])
    } else {
      throw "Malformed command: "+cmd.toString()
    }
  }
}




Transformable = Klass({
  needMatrixUpdate : true,

  /**
    Transforms the context state according to this node's attributes.

    @param ctx Canvas 2D context
    */
  transform : function(ctx) {
    var atm = this.absoluteMatrix
    var xy = this.x || this.y
    var rot = this.rotation
    var sca = this.scale != null
    var skX = this.skewX
    var skY = this.skewY
    var tm = this.matrix
    var tl = this.transformList

    // update the node's transformation matrix
    if (this.needMatrixUpdate || !this.currentMatrix) {
      if (!this.currentMatrix) this.currentMatrix = [1,0,0,1,0,0]
      if (this.parent)
        this.__copyMatrix(this.parent.currentMatrix)
      else
        this.__identityMatrix()
      if (atm) this.__setMatrixMatrix(this.absoluteMatrix)
      if (xy) this.__translateMatrix(this.x, this.y)
      if (rot) this.__rotateMatrix(this.rotation)
      if (skX) this.__skewXMatrix(this.skewX)
      if (skY) this.__skewYMatrix(this.skewY)
      if (sca) this.__scaleMatrix(this.scale)
      if (tm) this.__matrixMatrix(this.matrix)
      if (tl) {
        for (var i=0; i<this.transformList.length; i++) {
          var tl = this.transformList[i]
          this['__'+tl[0]+'Matrix'](tl[1])
        }
      }
      this.needMatrixUpdate = false
    }

    if (!ctx) return

    // transform matrix modifiers
    this.__setMatrix(ctx, this.currentMatrix)
  },

  distanceTo : function(node) {
    return Curves.lineLength([this.x, this.y], [node.x, node.y])
  },

  angleTo : function(node) {
    return Curves.lineAngle([this.x, this.y], [node.x, node.y])
  },



  __setMatrixMatrix : function(matrix) {
    if (!this.previousMatrix) this.previousMatrix = []
    var p = this.previousMatrix
    var c = this.currentMatrix
    p[0] = c[0]
    p[1] = c[1]
    p[2] = c[2]
    p[3] = c[3]
    p[4] = c[4]
    p[5] = c[5]
    p = this.currentMatrix
    c = matrix
    p[0] = c[0]
    p[1] = c[1]
    p[2] = c[2]
    p[3] = c[3]
    p[4] = c[4]
    p[5] = c[5]
  },

  __copyMatrix : function(matrix) {
    var p = this.currentMatrix
    var c = matrix
    p[0] = c[0]
    p[1] = c[1]
    p[2] = c[2]
    p[3] = c[3]
    p[4] = c[4]
    p[5] = c[5]
  },

  __identityMatrix : function() {
    var p = this.currentMatrix
    p[0] = 1
    p[1] = 0
    p[2] = 0
    p[3] = 1
    p[4] = 0
    p[5] = 0
  },

  __translateMatrix : function(x, y) {
    if (x.length) {
      CanvasSupport.tTranslate( this.currentMatrix, x[0], x[1] )
    } else {
      CanvasSupport.tTranslate( this.currentMatrix, x, y )
    }
  },

  __rotateMatrix : function(rotation) {
    if (rotation.length) {
      if (rotation[0] % Math.PI*2 == 0) return
      if (rotation[1] || rotation[2]) {
        CanvasSupport.tTranslate( this.currentMatrix,
                                  rotation[1], rotation[2] )
        CanvasSupport.tRotate( this.currentMatrix, rotation[0] )
        CanvasSupport.tTranslate( this.currentMatrix,
                                  -rotation[1], -rotation[2] )
      } else {
        CanvasSupport.tRotate( this.currentMatrix, rotation[0] )
      }
    } else {
      if (rotation % Math.PI*2 == 0) return
      CanvasSupport.tRotate( this.currentMatrix, rotation )
    }
  },

  __skewXMatrix : function(skewX) {
    if (skewX.length && skewX[0])
      CanvasSupport.tSkewX(this.currentMatrix, skewX[0])
    else
      CanvasSupport.tSkewX(this.currentMatrix, skewX)
  },

  __skewYMatrix : function(skewY) {
    if (skewY.length && skewY[0])
      CanvasSupport.tSkewY(this.currentMatrix, skewY[0])
    else
      CanvasSupport.tSkewY(this.currentMatrix, skewY)
  },

  __scaleMatrix : function(scale) {
    if (scale.length == 2) {
      if (scale[0] == 1 && scale[1] == 1) return
      CanvasSupport.tScale(this.currentMatrix,
                           scale[0], scale[1])
    } else if (scale.length == 3) {
      if (scale[0] == 1 || (scale[0].length && (scale[0][0] == 1 && scale[0][1] == 1)))
        return
      CanvasSupport.tTranslate(this.currentMatrix,
                               scale[1], scale[2])
      if (scale[0].length) {
        CanvasSupport.tScale(this.currentMatrix,
                              scale[0][0], scale[0][1])
      } else {
        CanvasSupport.tScale( this.currentMatrix, scale[0], scale[0] )
      }
      CanvasSupport.tTranslate(this.currentMatrix,
                               -scale[1], -scale[2])
    } else if (scale != 1) {
      CanvasSupport.tScale( this.currentMatrix, scale, scale )
    }
  },

  __matrixMatrix : function(matrix) {
    CanvasSupport.tMatrixMultiply(this.currentMatrix, matrix)
  },

  __setMatrix : function(ctx, matrix) {
    CanvasSupport.setTransform(ctx, matrix, this.previousMatrix)
  },

  __translate : function(ctx, x,y) {
    if (x.length != null)
      ctx.translate(x[0], x[1])
    else
      ctx.translate(x, y)
  },

  __rotate : function(ctx, rotation) {
    if (rotation.length) {
      if (rotation[1] || rotation[2]) {
        if (rotation[0] % Math.PI*2 == 0) return
        ctx.translate( rotation[1], rotation[2] )
        ctx.rotate( rotation[0] )
        ctx.translate( -rotation[1], -rotation[2] )
      } else {
        ctx.rotate( rotation[0] )
      }
    } else {
      ctx.rotate( rotation )
    }
  },

  __skewX : function(ctx, skewX) {
    if (skewX.length && skewX[0])
      CanvasSupport.skewX(ctx, skewX[0])
    else
      CanvasSupport.skewX(ctx, skewX)
  },

  __skewY : function(ctx, skewY) {
    if (skewY.length && skewY[0])
      CanvasSupport.skewY(ctx, skewY[0])
    else
      CanvasSupport.skewY(ctx, skewY)
  },

  __scale : function(ctx, scale) {
    if (scale.length == 2) {
      ctx.scale(scale[0], scale[1])
    } else if (scale.length == 3) {
      ctx.translate( scale[1], scale[2] )
      if (scale[0].length) {
        ctx.scale(scale[0][0], scale[0][1])
      } else {
        ctx.scale(scale[0], scale[0])
      }
      ctx.translate( -scale[1], -scale[2] )
    } else {
      ctx.scale(scale, scale)
    }
  },

  __matrix : function(ctx, matrix) {
    CanvasSupport.transform(ctx, matrix)
  }

})


/**
  Timeline is an animator that tweens between its frames.

  When object.time = k.time:
       object.state = k.state
  When object.time > k[i-1].time and object.time < k[i].time:
       object.state = k[i].tween(position, k[i-1].state, k[i].state)
       where position = elapsed / duration,
             elapsed = object.time - k[i-1].time,
             duration = k[i].time - k[i-1].time
  */
Timeline = Klass({
  startTime : null,
  repeat : false,
  lastAction : 0,

  initialize : function(repeat, pingpong) {
    this.repeat = repeat
    this.keyframes = []
  },

  addKeyframe : function(time, target, tween) {
    if (arguments.length == 1) this.keyframes.push(time)
    else  this.keyframes.push({
            time : time,
            target : target,
            tween : tween
          })
  },

  appendKeyframe : function(timeDelta, target, tween) {
    this.lastAction += timeDelta
    return this.addKeyframe(this.lastAction, target, tween)
  },

  evaluate : function(object, ot, dt) {
    if (this.startTime == null) this.startTime = ot
    var t = ot - this.startTime
    if (this.keyframes.length > 0) {
      // find current keyframe
      var currentIndex, previousFrame, currentFrame
      for (var i=0; i<this.keyframes.length; i++) {
        if (this.keyframes[i].time > t) {
          currentIndex = i
          break
        }
      }
      if (currentIndex != null) {
        previousFrame = this.keyframes[currentIndex-1]
        currentFrame = this.keyframes[currentIndex]
      }
      if (!currentFrame) {
        if (!this.keyframes.atEnd) {
          this.keyframes.atEnd = true
          previousFrame = this.keyframes[this.keyframes.length - 1]
          Object.extend(object, Object.clone(previousFrame.target))
          if (this.repeat) this.startTime = ot
          object.changed = true
        }
      } else if (previousFrame) {
        this.keyframes.atEnd = false
        // animate towards current keyframe
        var elapsed = t - previousFrame.time
        var duration = currentFrame.time - previousFrame.time
        var pos = elapsed / duration
        for (var k in currentFrame.target) {
          if (previousFrame.target[k] != null) {
            object.tweenVariable(k,
              previousFrame.target[k], currentFrame.target[k],
              pos, currentFrame.tween)
          }
        }
      }
    }
  }

})


Animatable = Klass({
  tweenFunctions : {
    linear : function(v) { return v },

    set : function(v) { return Math.floor(v) },
    discrete : function(v) { return Math.floor(v) },

    sine : function(v) { return 0.5-0.5*Math.cos(v*Math.PI) },

    sproing : function(v) {
      return (0.5-0.5*Math.cos(v*3.59261946538606)) * 1.05263157894737
      // pi + pi-acos(0.9)
    },

    square : function(v) {
      return v*v
    },

    cube : function(v) {
      return v*v*v
    },

    sqrt : function(v) {
      return Math.sqrt(v)
    },

    curt : function(v) {
      return Math.pow(v, -0.333333333333)
    }
  },

  initialize : function() {
    this.lastAction = 0
    this.timeline = []
    this.keyframes = []
    this.pendingKeyframes = []
    this.pendingTimelineEvents = []
    this.timelines = []
    this.animators = []
    this.addFrameListener(this.updateTimelines)
    this.addFrameListener(this.updateKeyframes)
    this.addFrameListener(this.updateTimeline)
    this.addFrameListener(this.updateAnimators)
  },

  updateTimelines : function(t, dt) {
    for (var i=0; i<this.timelines.length; i++)
      this.timelines[i].evaluate(this, t, dt)
  },

  addTimeline : function(tl) {
    this.timelines.push(tl)
  },

  removeTimeline : function(tl) {
    this.timelines.deleteFirst(tl)
  },

  /**
    Tweens between keyframes (a keyframe is an object with the new values of
    the members of this, e.g. { time: 0, target: { x: 10, y: 20 }, tween: 'square'})

    Keyframes are very much like multi-variable animators, the main difference
    is that with keyframes the start value and the duration are implicit.

    While an animation from value A to B would take two keyframes instead of
    a single animator, chaining and reordering keyframes is very easy.
    */
  updateKeyframes : function(t,dt) {
    this.addPendingKeyframes(t)
    if (this.keyframes.length > 0) {
      // find current keyframe
      var currentIndex, previousFrame, currentFrame
      for (var i=0; i<this.keyframes.length; i++) {
        if (this.keyframes[i].time > t) {
          currentIndex = i
          break
        }
      }
      if (currentIndex != null) {
        previousFrame = this.keyframes[currentIndex-1]
        currentFrame = this.keyframes[currentIndex]
      }
      if (!currentFrame) {
        if (!this.keyframes.atEnd) {
          this.keyframes.atEnd = true
          previousFrame = this.keyframes[this.keyframes.length - 1]
          Object.extend(this, Object.clone(previousFrame.target))
          this.changed = true
        }
      } else if (previousFrame) {
        this.keyframes.atEnd = false
        // animate towards current keyframe
        var elapsed = t - previousFrame.time
        var duration = currentFrame.time - previousFrame.time
        var pos = elapsed / duration
        for (var k in currentFrame.target) {
          if (previousFrame.target[k] != null) {
            this.tweenVariable(k,
              previousFrame.target[k], currentFrame.target[k],
              pos, currentFrame.tween)
          }
        }
      }
    }
  },

  addPendingKeyframes : function(t) {
    if (this.pendingKeyframes.length > 0) {
      while (this.pendingKeyframes.length > 0) {
        var kf = this.pendingKeyframes.shift()
        if (kf.time == null)
          kf.time = kf.relativeTime + t
        this.keyframes.push(kf)
      }
      this.keyframes.stableSort(function(a,b) { return a.time - b.time })
    }
  },

  /**
    Run and remove timelineEvents that have startTime <= t.
    TimelineEvents are run in the ascending order of their startTimes.
    */
  updateTimeline : function(t, dt) {
    this.addPendingTimelineEvents(t)
    while (this.timeline[0] && this.timeline[0].startTime <= t) {
      var keyframe = this.timeline.shift()
      var rv = true
      if (typeof(keyframe.action) == 'function')
        rv = keyframe.action.call(this, t, dt, keyframe)
      else
        this.animators.push(keyframe.action)
      if (keyframe.repeatEvery != null && rv != false) {
        if (keyframe.repeatTimes != null) {
          if (keyframe.repeatTimes <= 0) continue
          keyframe.repeatTimes--
        }
        keyframe.startTime += keyframe.repeatEvery
        this.addTimelineEvent(keyframe)
      }
      this.changed = true
    }
  },

  addPendingTimelineEvents : function(t) {
    if (this.pendingTimelineEvents.length > 0) {
      while (this.pendingTimelineEvents.length > 0) {
        var kf = this.pendingTimelineEvents.shift()
        if (!kf.startTime)
          kf.startTime = kf.relativeStartTime + t
        this.timeline.push(kf)
      }
      this.timeline.stableSort(function(a,b) { return a.startTime - b.startTime })
    }
  },

  addTimelineEvent : function(kf) {
    this.pendingTimelineEvents.push(kf)
  },

  /**
    Run each animator, delete ones that have their durations exceeded.
    */
  updateAnimators : function(t, dt) {
    for (var i=0; i<this.animators.length; i++) {
      var ani = this.animators[i]
      if (!ani.startTime) ani.startTime = t
      var elapsed = t - ani.startTime
      var pos = elapsed / ani.duration
      var shouldRemove = false
      if (pos >= 1) {
        if (!ani.repeat) {
          pos = 1
          shouldRemove = true
        } else {
          if (ani.repeat !== true) ani.repeat = Math.max(0, ani.repeat - 1)
          if (ani.accumulate) {
            ani.startValue = Object.clone(ani.endValue)
            ani.endValue = Object.sum(ani.difference, ani.endValue)
          }
          if (ani.repeat == 0) {
            shouldRemove = true
            pos = 1
          } else {
            ani.startTime = t
            pos = pos % 1
          }
        }
      } else if (ani.repeat && ani.repeat !== true && ani.repeat <= pos) {
        shouldRemove = true
        pos = ani.repeat
      }
      this.tweenVariable(ani.variable, ani.startValue, ani.endValue, pos, ani.tween)
      if (shouldRemove) {
        this.animators.splice(i, 1)
        i--
      }
    }
  },

  tweenVariable : function(variable, start, end, pos, tweenFunction) {
    if (typeof(tweenFunction) != 'function') {
      tweenFunction = this.tweenFunctions[tweenFunction] || this.tweenFunctions.linear
    }
    var tweened = tweenFunction(pos)
    if (typeof(variable) != 'function') {
      if (start instanceof Array) {
        for (var j=0; j<start.length; j++) {
          this[variable][j] = start[j] + tweened*(end[j]-start[j])
        }
      } else {
        this[variable] = start + tweened*(end-start)
      }
    } else {
      variable.call(this, tweened, start, end)
    }
    this.changed = true
  },

  animate : function(variable, start, end, duration, tween, config) {
    var start = Object.clone(start)
    var end = Object.clone(end)
    if (!config) config = {}
    if (config.additive) {
      var diff = Object.sub(end, start)
      start = Object.sum(start, this[variable])
      end = Object.sum(end, this[variable])
    }
    if (typeof(variable) != 'function')
      this[variable] = Object.clone(start)
    var ani = {
      id : Animatable.uid++,
      variable : variable,
      startValue : start,
      endValue : end,
      difference : diff,
      duration : duration,
      tween : tween,
      repeat : config.repeat,
      additive : config.additive,
      accumulate : config.accumulate,
      pingpong : config.pingpong
    }
    this.animators.push(ani)
    return ani
  },

  removeAnimator : function(animator) {
    this.animators.deleteFirst(animator)
  },

  animateTo : function(variableName, end, duration, tween, config) {
    return this.animate(variableName, this[variableName], end, duration, tween, config)
  },

  animateFrom : function(variableName, start, duration, tween, config) {
    return this.animate(variableName, start, this[variableName], duration, tween, config)
  },

  animateFactor : function(variableName, start, endFactor, duration, tween, config) {
    var end
    if (start instanceof Array) {
      end = []
      for (var i=0; i<start.length; i++) {
        end[i] = start[i] * endFactor
      }
    } else {
      end = start * endFactor
    }
    return this.animate(variableName, start, end, duration, tween, config)
  },

  animateToFactor : function(variableName, endFactor, duration, tween, config) {
    var start = this[variableName]
    return this.animateFactor(variableName, start, endFactor, duration, tween, config)
  },

  addKeyframe : function(time, target, tween) {
    var kf = {
      relativeTime: time,
      target: target,
      tween: tween
    }
    this.pendingKeyframes.push(kf)
  },

  addKeyframeAt : function(time, target, tween) {
    var kf = {
      time: time,
      target: target,
      tween: tween
    }
    this.pendingKeyframes.push(kf)
  },

  appendKeyframe : function(timeDelta, target, tween) {
    this.lastAction += timeDelta
    return this.addKeyframe(this.lastAction, target, tween)
  },

  every : function(duration, action, noFirst) {
    var kf = {
      action : action,
      relativeStartTime : noFirst ? duration : 0,
      repeatEvery : duration
    }
    this.addTimelineEvent(kf)
    return kf
  },

  at : function(time, action) {
    var kf = {
      action : action,
      startTime : time
    }
    this.addTimelineEvent(kf)
    return kf
  },

  after : function(duration, action) {
    var kf = {
      action : action,
      relativeStartTime : duration
    }
    this.addTimelineEvent(kf)
    return kf
  },

  afterFrame : function(duration, callback) {
    var elapsed = 0
    var animator
    animator = function(t, dt){
      if (elapsed >= duration) {
        callback.call(this)
        this.removeFrameListener(animator)
      }
      elapsed++
    }
    this.addFrameListener(animator)
    return animator
  },

  everyFrame : function(duration, callback, noFirst) {
    var elapsed = noFirst ? 0 : duration
    var animator
    animator = function(t, dt){
      if (elapsed >= duration) {
        if (callback.call(this) == false)
          this.removeFrameListener(animator)
        elapsed = 0
      }
      elapsed++
    }
    this.addFrameListener(animator)
    return animator
  }
})
Animatable.uid = 0



/**
  CanvasNode is the base CAKE scenegraph node. All the other scenegraph nodes
  derive from it. A plain CanvasNode does no drawing, but it can be used for
  grouping other nodes and setting up the group's drawing state.

  var scene = new CanvasNode({x: 10, y: 10})

  The usual way to use CanvasNodes is to append them to a Canvas object:

    var scene = new CanvasNode()
    scene.append(new Rectangle(40, 40, {fill: true}))
    var elem = E.canvas(400, 400)
    var canvas = new Canvas(elem)
    canvas.append(scene)

  You can also use CanvasNodes to draw directly to a canvas element:

    var scene = new CanvasNode()
    scene.append(new Circle(40, {x:200, y:200, stroke: true}))
    var elem = E.canvas(400, 400)
    scene.handleDraw(elem.getContext('2d'))

  */
CanvasNode = Klass(Animatable, Transformable, {
  OBJECTBOUNDINGBOX : 'objectBoundingBox',

  // whether to draw the node and its childNodes or not
  visible : true,

  // whether to draw the node (doesn't affect subtree)
  drawable : true,

  // the CSS display property can be used to affect 'visible'
  // false     => visible = visible
  // 'none'    => visible = false
  // otherwise => visible = true
  display : null,

  // the CSS visibility property can be used to affect 'drawable'
  // false     => drawable = drawable
  // 'hidden'  => drawable = false
  // otherwise => drawable = true
  visibility : null,

  // whether this and the subtree from this register mouse hover
  catchMouse : true,

  // Whether this object registers mouse hover. Only set this to true when you
  // have a drawable object that can be picked. Otherwise the object requires
  // a matrix inversion on Firefox 2 and Safari, which is slow.
  pickable : false,

  // true if this node or one of its descendants is under the mouse
  // cursor and catchMouse is true
  underCursor : false,

  // zIndex in relation to sibling nodes (note: not global)
  zIndex : 0,

  // x translation of the node
  x : 0,

  // y translation of the node
  y : 0,

  // scale factor: number for uniform scaling, [x,y] for dimension-wise
  scale : 1,

  // Rotation of the node, in radians.
  //
  // The rotation can also be the array [angle, cx, cy],
  // where cx and cy define the rotation center.
  //
  // The array form is equivalent to
  // translate(cx, cy); rotate(angle); translate(-cx, -cy);
  rotation : 0,

  // Transform matrix with which to multiply the current transform matrix.
  // Applied after all other transformations.
  matrix : null,

  // Transform matrix with which to replace the current transform matrix.
  // Applied before any other transformation.
  absoluteMatrix : null,

  // SVG-like list of transformations to apply.
  // The different transformations are:
  // ['translate', [x,y]]
  // ['rotate', [angle, cx, cy]] - (optional) cx and cy are the rotation center
  // ['scale', [x,y]]
  // ['matrix', [m11, m12, m21, m22, dx, dy]]
  transformList : null,

  // fillStyle for the node and its descendants
  // Possibilities:
  //   null // use the previous
  //   true      // use the previous but do fill
  //   false     // use the previous but don't do fill
  //   'none'    // use the previous but don't do fill
  //
  //   'white'
  //   '#fff'
  //   '#ffffff'
  //   'rgba(255,255,255, 1.0)'
  //   [255, 255, 255, 1.0]
  //   new Gradient(...)
  //   new Pattern(myImage, 'no-repeat')
  fill : null,

  // strokeStyle for the node and its descendants
  // Possibilities:
  //   null // use the previous
  //   true      // use the previous but do stroke
  //   false     // use the previous but don't do stroke
  //   'none'    // use the previous but don't do stroke
  //
  //   'white'
  //   '#fff'
  //   '#ffffff'
  //   'rgba(255,255,255, 1.0)'
  //   [255, 255, 255, 1.0]
  //   new Gradient(...)
  //   new Pattern(myImage, 'no-repeat')
  stroke : null,

  // stroke line width
  strokeWidth : null,

  // stroke line cap style ('butt' | 'round' | 'square')
  lineCap : null,

  // stroke line join style ('bevel' | 'round' | 'miter')
  lineJoin : null,

  // stroke line miter limit
  miterLimit : null,

  // set globalAlpha to this value
  absoluteOpacity : null,

  // multiply globalAlpha by this value
  opacity : null,

  // fill opacity
  fillOpacity : null,

  // stroke opacity
  strokeOpacity : null,

  // set globalCompositeOperation to this value
  // Possibilities:
  // ( 'source-over' |
  //   'copy' |
  //   'lighter' |
  //   'darker' |
  //   'xor' |
  //   'source-in' |
  //   'source-out' |
  //   'destination-over' |
  //   'destination-atop' |
  //   'destination-in' |
  //   'destination-out' )
  compositeOperation : null,

  // Color for the drop shadow
  shadowColor : null,

  // Drop shadow blur radius
  shadowBlur : null,

  // Drop shadow's x-offset
  shadowOffsetX : null,

  // Drop shadow's y-offset
  shadowOffsetY : null,

  // HTML5 text API
  font : null,
  // horizontal position of the text origin
  // 'left' | 'center' | 'right' | 'start' | 'end'
  textAlign : null,
  // vertical position of the text origin
  // 'top' | 'hanging' | 'middle' | 'alphabetic' | 'ideographic' | 'bottom'
  textBaseline : null,

  cursor : null,

  changed : true,

  tagName : 'g',

  getNextSibling : function(){
    if (this.parentNode)
      return this.parentNode.childNodes[this.parentNode.childNodes.indexOf(this)+1]
    return null
  },

  getPreviousSibling : function(){
    if (this.parentNode)
      return this.parentNode.childNodes[this.parentNode.childNodes.indexOf(this)-1]
    return null
  },

  /**
    Initialize the CanvasNode and merge an optional config hash.
    */
  initialize : function(config) {
    this.root = this
    this.currentMatrix = [1,0,0,1,0,0]
    this.previousMatrix = [1,0,0,1,0,0]
    this.needMatrixUpdate = true
    this.childNodes = []
    this.frameListeners = []
    this.eventListeners = {}
    Animatable.initialize.call(this)
    if (config)
      Object.extend(this, config)
  },

  /**
    Create a clone of the node and its subtree.
    */
  clone : function() {
    var c = Object.clone(this)
    c.parent = c.root = null
    for (var i in this) {
      if (typeof(this[i]) == 'object')
        c[i] = Object.clone(this[i])
    }
    c.parent = c.root = null
    c.childNodes = []
    c.setRoot(null)
    for (var i=0; i<this.childNodes.length; i++) {
      var ch = this.childNodes[i].clone()
      c.append(ch)
    }
    return c
  },

  cloneNode : function(){ return this.clone() },

  /**
    Gets node by id.
    */
  getElementById : function(id) {
    if (this.id == id)
      return this
    for (var i=0; i<this.childNodes.length; i++) {
      var n = this.childNodes[i].getElementById(id)
      if (n) return n
    }
    return null
  },

  $ : function(id) {
    return this.getElementById(id)
  },

  /**
    Alias for append().

    @param Node[s] to append
    */
  appendChild : function() {
    return this.append.apply(this, arguments)
  },

  /**
    Appends arguments as childNodes to the node.

    Adding a child sets child.parent to be the node and calls
    child.setRoot(node.root)

    @param Node[s] to append
    */
  append : function(obj) {
    var a = $A(arguments)
    for (var i=0; i<a.length; i++) {
      if (a[i].parent) a[i].removeSelf()
      this.childNodes.push(a[i])
      a[i].parent = a[i].parentNode = this
      a[i].setRoot(this.root)
    }
    this.changed = true
  },

  /**
    Removes all childNodes from the node.
    */
  removeAllChildren : function() {
    this.remove.apply(this, this.childNodes)
  },

  /**
    Alias for remove().

    @param Node[s] to remove
    */
  removeChild : function() {
    return this.remove.apply(this, arguments)
  },

  /**
    Removes arguments from the node's childNodes.

    Removing a child sets its parent to null and calls
    child.setRoot(null)

    @param Child node[s] to remove
    */
  remove : function(obj) {
    var a = arguments
    for (var i=0; i<a.length; i++) {
      this.childNodes.deleteFirst(a[i])
      delete a[i].parent
      delete a[i].parentNode
      a[i].setRoot(null)
    }
    this.changed = true
  },

  /**
    Calls this.parent.removeChild(this) if this.parent is set.
    */
  removeSelf : function() {
    if (this.parentNode) {
      this.parentNode.remove(this)
    }
  },

  /**
    Returns true if this node's subtree contains obj. (I.e. obj is this or
    obj's parent chain includes this.)

    @param obj Node to look for
    @return True if obj is in this node's subtree, false if it isn't.
    */
  contains : function(obj) {
    while (obj) {
      if (obj == this) return true
      obj = obj.parentNode
    }
    return false
  },

  /**
    Set this.root to the given value and propagate the update to childNodes.

    @param root The new root node
    @private
    */
  setRoot : function(root) {
    if (!root) root = this
    this.dispatchEvent({type: 'rootChanged', canvasTarget: this, relatedTarget: root})
    this.root = root
    for (var i=0; i<this.childNodes.length; i++)
      this.childNodes[i].setRoot(root)
  },

  /**
    Adds a callback function to be called before drawing each frame.

    @param f Callback function
    */
  addFrameListener : function(f) {
    this.frameListeners.push(f)
  },

  /**
    Removes a callback function from update callbacks.

    @param f Callback function
    */
  removeFrameListener : function(f) {
    this.frameListeners.deleteFirst(f)
  },

  addEventListener : function(type, listener, capture) {
    if (!this.eventListeners[type])
      this.eventListeners[type] = {capture:[], bubble:[]}
    this.eventListeners[type][capture ? 'capture' : 'bubble'].push(listener)
  },

  /**
    Synonym for addEventListener.
  */
  when : function(type, listener, capture) {
    this.addEventListener(type, listener, capture || false)
  },

  removeEventListener : function(type, listener, capture) {
    if (!this.eventListeners[type]) return
    this.eventListeners[type][capture ? 'capture' : 'bubble'].deleteFirst(listener)
    if (this.eventListeners[type].capture.length == 0 &&
        this.eventListeners[type].bubble.length == 0)
      delete this.eventListeners[type]
  },

  dispatchEvent : function(event) {
    var type = event.type
    if (!event.canvasTarget) {
      if (type.search(/^(key|text)/i) == 0) {
        event.canvasTarget = this.root.focused || this.root.target
      } else {
        event.canvasTarget = this.root.target
      }
      if (!event.canvasTarget)
        event.canvasTarget = this
    }
    var path = []
    var obj = event.canvasTarget
    while (obj && obj != this) {
      path.push(obj)
      obj = obj.parent
    }
    path.push(this)
    event.canvasPhase = 'capture'
    for (var i=path.length-1; i>=0; i--)
      if (!path[i].handleEvent(event)) return false
    event.canvasPhase = 'bubble'
    for (var i=0; i<path.length; i++)
      if (!path[i].handleEvent(event)) return false
    return true
  },

  broadcastEvent : function(event) {
    var type = event.type
    event.canvasPhase = 'capture'
    if (!this.handleEvent(event)) return false
    for (var i=0; i<this.childNodes.length; i++)
      if (!this.childNodes[i].broadcastEvent(event)) return false
    event.canvasPhase = 'bubble'
    if (!this.handleEvent(event)) return false
    return true
  },

  handleEvent : function(event) {
    var type = event.type
    var phase = event.canvasPhase
    if (this.cursor && phase == 'capture')
      event.cursor = this.cursor
    var els = this.eventListeners[type]
    els = els && els[phase]
    if (els) {
      for (var i=0; i<els.length; i++) {
        var rv = els[i].call(this, event)
        if (rv == false || event.stopped) {
          if (!event.stopped)
            event.stopPropagation()
          event.stopped = true
          return false
        }
      }
    }
    return true
  },

  /**
    Handle scenegraph update.
    Called with current time before drawing each frame.

    This method should be touched only if you know what you're doing.
    If you need your own update handler, either add a frame listener or
    overwrite {@link CanvasNode#update}.

    @param time Current animation time
    @param timeDelta Time since last frame in milliseconds
    */
  handleUpdate : function(time, timeDelta) {
    this.update(time, timeDelta)
    this.willBeDrawn = (!this.parent || this.parent.willBeDrawn) && (this.display ? this.display != 'none' : this.visible)
    for(var i=0; i<this.childNodes.length; i++)
      this.childNodes[i].handleUpdate(time, timeDelta)
    // TODO propagate dirty area bbox up the scene graph
    if (this.parent && this.changed) {
      this.parent.changed = this.changed
      this.changed = false
    }
    this.needMatrixUpdate = true
  },

  /**
    Update this node. Calls all frame listener callbacks in the order they
    were added.

    Overwrite this with your own method if you want to do things differently.

    @param time Current animation time
    @param timeDelta Time since last frame in milliseconds
    */
  update : function(time, timeDelta) {
    // need to operate on a copy, otherwise bad stuff happens
    var fl = this.frameListeners.slice(0)
    for(var i=0; i<fl.length; i++) {
      if (this.frameListeners.includes(fl[i]))
        fl[i].apply(this, arguments)
    }
  },

  /**
    Tests if this node or its subtree is under the mouse cursor and
    sets this.underCursor accordingly.

    If this node (and not one of its childNodes) is under the mouse cursor
    this.root.target is set to this. This way, the topmost (== drawn last)
    node under the mouse cursor is the root target.

    To see whether a subtree node is the current target:

    if (this.underCursor && this.contains(this.root.target)) {
      // we are the target, let's roll
    }

    This method should be touched only if you know what you're doing.
    Overwrite {@link CanvasNode#drawPickingPath} to change the way the node's
    picking path is created.

    Called after handleUpdate, but before handleDraw.

    @param ctx Canvas 2D context
    */
  handlePick : function(ctx) {
    // CSS display & visibility
    if (this.display)
      this.visible = (this.display != 'none')
    if (this.visibility)
      this.drawable = (this.visibility != 'hidden')
    this.underCursor = false
    if (this.visible && this.catchMouse && this.root.absoluteMouseX != null) {
      ctx.save()
      this.transform(ctx, true)
      if (this.pickable && this.drawable) {
        if (ctx.isPointInPath) {
          ctx.beginPath()
          if (this.drawPickingPath)
            this.drawPickingPath(ctx)
        }
        this.underCursor = CanvasSupport.isPointInPath(
                              this.drawPickingPath ? ctx : false,
                              this.root.mouseX,
                              this.root.mouseY,
                              this.currentMatrix,
                              this)
        if (this.underCursor)
          this.root.target = this
      } else {
        this.underCursor = false
      }
      var c = this.__getChildrenCopy()
      this.__zSort(c)
      for(var i=0; i<c.length; i++) {
        c[i].handlePick(ctx)
        if (!this.underCursor)
          this.underCursor = c[i].underCursor
      }
      ctx.restore()
    } else {
      var c = this.__getChildrenCopy()
      while (c.length > 0) {
        var c0 = c.pop()
        if (c0.underCursor) {
          c0.underCursor = false
          Array.prototype.push.apply(c, c0.childNodes)
        }
      }
    }
  },

  __zSort : function(c) {
    c.stableSort(function(c1,c2) { return c1.zIndex - c2.zIndex; });
  },

  __getChildrenCopy : function() {
    if (this.__childNodesCopy) {
      while (this.__childNodesCopy.length > this.childNodes.length)
        this.__childNodesCopy.pop()
      for (var i=0; i<this.childNodes.length; i++)
        this.__childNodesCopy[i] = this.childNodes[i]
    } else {
      this.__childNodesCopy = this.childNodes.slice(0)
    }
    return this.__childNodesCopy
  },

  /**
    Returns true if the point x,y is inside the path of a drawable node.

    The x,y point is in user-space coordinates, meaning that e.g. the point
    5,5 will always be inside the rectangle [0, 0, 10, 10], regardless of the
    transform on the rectangle.

    Leave isPointInPath to false to avoid unnecessary matrix inversions for
    non-drawables.

    @param x X-coordinate of the point.
    @param y Y-coordinate of the point.
    @return Whether the point is inside the path of this node.
    @type boolean
    */
  isPointInPath : false,

  /**
    Handles transforming and drawing the node and its childNodes
    on each frame.

    Pushes context state, applies state transforms and draws the node.
    Then sorts the node's childNodes by zIndex, smallest first, and
    calls their handleDraws in that order. Finally, pops the context state.

    Called after handleUpdate and handlePick.

    This method should be touched only if you know what you're doing.
    Overwrite {@link CanvasNode#draw} when you need to draw things.

    @param ctx Canvas 2D context
    */
  handleDraw : function(ctx) {
    // CSS display & visibility
    if (this.display)
      this.visible = (this.display != 'none')
    if (this.visibility)
      this.drawable = (this.visibility != 'hidden')
    if (!this.visible) return
    ctx.save()
    var pff = ctx.fontFamily
    var pfs = ctx.fontSize
    var pfo = ctx.fillOn
    var pso = ctx.strokeOn
    if (this.fontFamily)
      ctx.fontFamily = this.fontFamily
    if (this.fontSize)
      ctx.fontSize = this.fontSize
    this.transform(ctx)
    if (this.clipPath) {
      ctx.beginPath()
      if (this.clipPath.units == this.OBJECTBOUNDINGBOX) {
        var bb = this.getSubtreeBoundingBox(true)
        ctx.save()
        ctx.translate(bb[0], bb[1])
        ctx.scale(bb[2], bb[3])
        this.clipPath.createSubtreePath(ctx, true)
        ctx.restore()
        ctx.clip()
      } else {
        this.clipPath.createSubtreePath(ctx, true)
        ctx.clip()
      }
    }
    if (this.drawable && this.draw)
      this.draw(ctx)
    var c = this.__getChildrenCopy()
    this.__zSort(c);
    for(var i=0; i<c.length; i++) {
      c[i].handleDraw(ctx)
    }
    ctx.fontFamily = pff
    ctx.fontSize = pfs
    ctx.fillOn = pfo
    ctx.strokeOn = pso
    ctx.restore()
  },

  /**
    Transforms the context state according to this node's attributes.

    @param ctx Canvas 2D context
    @param onlyTransform If set to true, only do matrix transforms.
    */
  transform : function(ctx, onlyTransform) {
    Transformable.prototype.transform.call(this, ctx)

    if (onlyTransform) return

    // stroke / fill modifiers
    if (this.fill != null) {
      if (!this.fill || this.fill == 'none') {
        ctx.fillOn = false
      } else {
        ctx.fillOn = true
        if (this.fill != true) {
          var fillStyle = Colors.parseColorStyle(this.fill, ctx)
          ctx.setFillStyle( fillStyle )
        }
      }
    }
    if (this.stroke != null) {
      if (!this.stroke || this.stroke == 'none') {
        ctx.strokeOn = false
      } else {
        ctx.strokeOn = true
        if (this.stroke != true)
          ctx.setStrokeStyle( Colors.parseColorStyle(this.stroke, ctx) )
      }
    }
    if (this.strokeWidth != null)
      ctx.setLineWidth( this.strokeWidth )
    if (this.lineCap != null)
      ctx.setLineCap( this.lineCap )
    if (this.lineJoin != null)
      ctx.setLineJoin( this.lineJoin )
    if (this.miterLimit != null)
      ctx.setMiterLimit( this.miterLimit )

    // compositing modifiers
    if (this.absoluteOpacity != null)
      ctx.setGlobalAlpha( this.absoluteOpacity )
    if (this.opacity != null)
      ctx.setGlobalAlpha( ctx.globalAlpha * this.opacity )
    if (this.compositeOperation != null)
      ctx.setGlobalCompositeOperation( this.compositeOperation )

    // shadow modifiers
    if (this.shadowColor != null)
      ctx.setShadowColor( Colors.parseColorStyle(this.shadowColor, ctx) )
    if (this.shadowBlur != null)
      ctx.setShadowBlur( this.shadowBlur )
    if (this.shadowOffsetX != null)
      ctx.setShadowOffsetX( this.shadowOffsetX )
    if (this.shadowOffsetY != null)
      ctx.setShadowOffsetY( this.shadowOffsetY )

    // text modifiers
    if (this.textAlign != null)
      ctx.setTextAlign( this.textAlign )
    if (this.textBaseline != null)
      ctx.setTextBaseline( this.textBaseline )
    if (this.font != null)
      ctx.setFont( this.font )
  },

  /**
    Draws the picking path for the node for testing if the mouse cursor
    is inside the node.

    False by default, overwrite if you need special behaviour.

    @param ctx Canvas 2D context
    */
  drawPickingPath : false,

  /**
    Draws the node.

    False by default, overwrite to actually draw something.

    @param ctx Canvas 2D context
    */
  draw : false,

  createSubtreePath : function(ctx, skipTransform) {
    ctx.save()
    if (!skipTransform) this.transform(ctx, true)
    for (var i=0; i<this.childNodes.length; i++)
      this.childNodes[i].createSubtreePath(ctx)
    ctx.restore()
  },

  getSubtreeBoundingBox : function(identity) {
    if (identity) {
      var p = this.parent
      this.parent = null
      this.needMatrixUpdate = true
    }
    var bb = this.getAxisAlignedBoundingBox()
    for (var i=0; i<this.childNodes.length; i++) {
      var cbb = this.childNodes[i].getSubtreeBoundingBox()
      if (!bb) {
        bb = cbb
      } else if (cbb) {
        this.mergeBoundingBoxes(bb, cbb)
      }
    }
    if (identity) {
      this.parent = p
      this.needMatrixUpdate = true
    }
    return bb
  },

  mergeBoundingBoxes : function(bb, bb2) {
    var obx = bb[0], oby = bb[1]
    if (bb[0] > bb2[0]) bb[0] = bb2[0]
    if (bb[1] > bb2[1]) bb[1] = bb2[1]
    bb[2] = bb[2] + obx - bb[0]
    bb[3] = bb[3] + oby - bb[1]
    if (bb[2]+bb[0] < bb2[2]+bb2[0]) bb[2] = bb2[2]+bb2[0]-bb[0]
    if (bb[3]+bb[1] < bb2[3]+bb2[1]) bb[3] = bb2[3]+bb2[1]-bb[1]
  },

  getAxisAlignedBoundingBox : function() {
    this.transform(null, true)
    if (!this.getBoundingBox) return null
    var bbox = this.getBoundingBox()
    var xy1 = CanvasSupport.tMatrixMultiplyPoint(this.currentMatrix,
      bbox[0], bbox[1])
    var xy2 = CanvasSupport.tMatrixMultiplyPoint(this.currentMatrix,
      bbox[0]+bbox[2], bbox[1]+bbox[3])
    var xy3 = CanvasSupport.tMatrixMultiplyPoint(this.currentMatrix,
      bbox[0], bbox[1]+bbox[3])
    var xy4 = CanvasSupport.tMatrixMultiplyPoint(this.currentMatrix,
      bbox[0]+bbox[2], bbox[1])
    var x1 = Math.min(xy1[0], xy2[0], xy3[0], xy4[0])
    var x2 = Math.max(xy1[0], xy2[0], xy3[0], xy4[0])
    var y1 = Math.min(xy1[1], xy2[1], xy3[1], xy4[1])
    var y2 = Math.max(xy1[1], xy2[1], xy3[1], xy4[1])
    return [x1, y1, x2-x1, y2-y1]
  },

  makeDraggable : function() {
    this.addEventListener('dragstart', function(ev) {
      this.dragStartPosition = {x: this.x, y: this.y};
      ev.stopPropagation();
      ev.preventDefault();
      return false;
    }, false);
    this.addEventListener('drag', function(ev) {
      this.x = this.dragStartPosition.x + this.root.dragX / this.parent.currentMatrix[0];
      this.y = this.dragStartPosition.y + this.root.dragY / this.parent.currentMatrix[3];
      ev.stopPropagation();
      ev.preventDefault();
      return false;
    }, false);
  }
})


/**
  Canvas is the canvas manager class.
  It takes care of updating and drawing its childNodes on a canvas element.

  An example with a rotating rectangle:

    var c = E.canvas(500, 500)
    var canvas = new Canvas(c)
    var rect = new Rectangle(100, 100)
    rect.x = 250
    rect.y = 250
    rect.fill = true
    rect.fillStyle = 'green'
    rect.addFrameListener(function(t) {
      this.rotation = ((t / 3000) % 1) * Math.PI * 2
    })
    canvas.append(rect)
    document.body.appendChild(c)


  To use the canvas as a manually updated image:

    var canvas = new Canvas(E.canvas(200,40), {
      isPlaying : false,
      redrawOnlyWhenChanged : true
    })
    var c = new Circle(20)
    c.x = 100
    c.y = 20
    c.fill = true
    c.fillStyle = 'red'
    c.addFrameListener(function(t) {
      if (this.root.absoluteMouseX != null) {
        this.x = this.root.mouseX // relative to canvas surface
        this.root.changed = true
      }
    })
    canvas.append(c)


  Or by using raw onFrame-calls:

    var canvas = new Canvas(E.canvas(200,40), {
      isPlaying : false,
      fill : true,
      fillStyle : 'white'
    })
    var c = new Circle(20)
    c.x = 100
    c.y = 20
    c.fill = true
    c.fillStyle = 'red'
    canvas.append(c)
    canvas.onFrame()


  Which is also the recommended way to use a canvas inside another canvas:

    var canvas = new Canvas(E.canvas(200,40), {
      isPlaying : false
    })
    var c = new Circle(20, {
      x: 100, y: 20,
      fill: true, fillStyle: 'red'
    })
    canvas.append(c)

    var topCanvas = new Canvas(E.canvas(500, 500))
    var canvasImage = new ImageNode(canvas.canvas, {x: 250, y: 250})
    topCanvas.append(canvasImage)
    canvasImage.addFrameListener(function(t) {
      this.rotation = (t / 3000 % 1) * Math.PI * 2
      canvas.onFrame(t)
    })

  */
Canvas = Klass(CanvasNode, {

  clear : true,
  frameLoop : false,
  recording : false,
  opacity : 1,
  frame : 0,
  elapsed : 0,
  frameDuration : 30,
  speed : 1.0,
  time : 0,
  fps : 0,
  currentRealFps : 0,
  currentFps : 0,
  fpsFrames : 30,
  startTime : 0,
  realFps : 0,
  fixedTimestep : false,
  playOnlyWhenFocused : true,
  isPlaying : true,
  redrawOnlyWhenChanged : false,
  changed : true,
  drawBoundingBoxes : false,
  cursor : 'default',

  mouseDown : false,
  mouseEvents : [],

  // absolute pixel coordinates from canvas top-left
  absoluteMouseX : null,
  absoluteMouseY : null,

  /*
    Coordinates relative to the canvas's surface scale.
    Example:
      canvas.width
      #=> 100
      canvas.style.width
      #=> '100px'
      canvas.absoluteMouseX
      #=> 50
      canvas.mouseX
      #=> 50

      canvas.style.width = '200px'
      canvas.width
      #=> 100
      canvas.absoluteMouseX
      #=> 100
      canvas.mouseX
      #=> 50
  */
  mouseX : null,
  mouseY : null,

  elementNodeZIndexCounter : 0,

  initialize : function(canvas, config) {
    if (arguments.length > 2) {
      var container = arguments[0]
      var w = arguments[1]
      var h = arguments[2]
      var config = arguments[3]
      var canvas = E.canvas(w,h)
      var canvasContainer = E('div', canvas, {style:
        {overflow:'hidden', width:w+'px', height:h+'px', position:'relative'}
      })
      this.canvasContainer = canvasContainer
      if (container)
        container.appendChild(canvasContainer)
    }
    CanvasNode.initialize.call(this, config)
    this.mouseEventStack = []
    this.canvas = canvas
    canvas.canvas = this
    this.width = this.canvas.width
    this.height = this.canvas.height
    var th = this
    this.frameHandler = function() { th.onFrame() }
    this.canvas.addEventListener('DOMNodeInserted', function(ev) {
      if (ev.target == this)
        th.addEventListeners()
    }, false)
    this.canvas.addEventListener('DOMNodeRemoved', function(ev) {
      if (ev.target == this)
        th.removeEventListeners()
    }, false)
    if (this.canvas.parentNode) this.addEventListeners()
    this.startTime = new Date().getTime()
    if (this.isPlaying)
      this.play()
  },

  // FIXME
  removeEventListeners : function() {
  },

  addEventListeners : function() {
    var th = this
    this.canvas.parentNode.addMouseEvent = function(e){
      var xy = Mouse.getRelativeCoords(this, e)
      th.absoluteMouseX = xy.x
      th.absoluteMouseY = xy.y
      var style = document.defaultView.getComputedStyle(th.canvas,"")
      var w = parseFloat(style.getPropertyValue('width'))
      var h = parseFloat(style.getPropertyValue('height'))
      th.mouseX = th.absoluteMouseX * (w / th.canvas.width)
      th.mouseY = th.absoluteMouseY * (h / th.canvas.height)
      th.addMouseEvent(th.mouseX, th.mouseY, th.mouseDown)
    }
    this.canvas.parentNode.contains = this.contains

    this.canvas.parentNode.addEventListener('mousedown', function(e) {
      th.mouseDown = true
      if (th.keyTarget != th.target) {
        if (th.keyTarget)
          th.dispatchEvent({type: 'blur', canvasTarget: th.keyTarget})
        th.keyTarget = th.target
        if (th.keyTarget)
          th.dispatchEvent({type: 'focus', canvasTarget: th.keyTarget})
      }
      this.addMouseEvent(e)
    }, true)

    this.canvas.parentNode.addEventListener('mouseup', function(e) {
      this.addMouseEvent(e)
      th.mouseDown = false
    }, true)

    this.canvas.parentNode.addEventListener('mousemove', function(e) {
      this.addMouseEvent(e)
      if (th.prevClientX == null) {
        th.prevClientX = e.clientX
        th.prevClientY = e.clientY
      }
      if (th.dragTarget) {
        var nev = document.createEvent('MouseEvents')
        nev.initMouseEvent('drag', true, true, window, e.detail,
          e.screenX, e.screenY, e.clientX, e.clientY, e.ctrlKey, e.altKey,
          e.shiftKey, e.metaKey, e.button, e.relatedTarget)
        nev.canvasTarget = th.dragTarget
        nev.dx = e.clientX - th.prevClientX
        nev.dy = e.clientY - th.prevClientY
        th.dragX += nev.dx
        th.dragY += nev.dy
        th.dispatchEvent(nev)
      }
      if (!th.mouseDown) {
        if (th.dragTarget) {
          var nev = document.createEvent('MouseEvents')
          nev.initMouseEvent('dragend', true, true, window, e.detail,
            e.screenX, e.screenY, e.clientX, e.clientY, e.ctrlKey, e.altKey,
            e.shiftKey, e.metaKey, e.button, e.relatedTarget)
          nev.canvasTarget = th.dragTarget
          th.dispatchEvent(nev)
          th.dragX = th.dragY = 0
          th.dragTarget = false
        }
      } else if (!th.dragTarget && th.target) {
        th.dragTarget = th.target
        var nev = document.createEvent('MouseEvents')
        nev.initMouseEvent('dragstart', true, true, window, e.detail,
          e.screenX, e.screenY, e.clientX, e.clientY, e.ctrlKey, e.altKey,
          e.shiftKey, e.metaKey, e.button, e.relatedTarget)
        nev.canvasTarget = th.dragTarget
        th.dragStartX = e.clientX
        th.dragStartY = e.clientY
        th.dragX = th.dragY = 0
        th.dispatchEvent(nev)
      }
      th.prevClientX = e.clientX
      th.prevClientY = e.clientY
    }, true)

    this.canvas.parentNode.addEventListener('mouseout', function(e) {
      if (!CanvasNode.contains.call(this, e.relatedTarget))
        th.absoluteMouseX = th.absoluteMouseY = th.mouseX = th.mouseY = null
    }, true)

    var dispatch = this.dispatchEvent.bind(this)
    var types = [
      'mousemove', 'mouseover', 'mouseout',
      'click', 'dblclick',
      'mousedown', 'mouseup',
      'keypress', 'keydown', 'keyup',
      'DOMMouseScroll', 'mousewheel', 'mousemultiwheel', 'textInput',
      'focus', 'blur'
    ]
    for (var i=0; i<types.length; i++) {
      this.canvas.parentNode.addEventListener(types[i], dispatch, false)
    }
    this.keys = {}

    this.windowEventListeners = {

      keydown : function(ev) {
        if (th.keyTarget) {
          th.updateKeys(ev)
          ev.canvasTarget = th.keyTarget
          th.dispatchEvent(ev)
        }
      },

      keyup : function(ev) {
        if (th.keyTarget) {
          th.updateKeys(ev)
          ev.canvasTarget = th.keyTarget
          th.dispatchEvent(ev)
        }
      },

      // do we even want to have this?
      keypress : function(ev) {
        if (th.keyTarget) {
          ev.canvasTarget = th.keyTarget
          th.dispatchEvent(ev)
        }
      },

      blur : function(ev) {
        th.absoluteMouseX = th.absoluteMouseY = null
        if (th.playOnlyWhenFocused && th.isPlaying) {
          th.stop()
          th.__blurStop = true
        }
      },

      focus : function(ev) {
        if (th.__blurStop && !th.isPlaying) th.play()
      },

      mouseup : function(e) {
        th.mouseDown = false
        if (th.dragTarget) {
          // TODO
          // find the object that receives the drag (i.e. drop target)
          var nev = document.createEvent('MouseEvents')
          nev.initMouseEvent('dragend', true, true, window, e.detail,
            e.screenX, e.screenY, e.clientX, e.clientY, e.ctrlKey, e.altKey,
            e.shiftKey, e.metaKey, e.button, e.relatedTarget)
          nev.canvasTarget = th.dragTarget
          th.dispatchEvent(nev)
          th.dragTarget = false
        }
        if (!th.canvas.parentNode.contains(e.target)) {
          var rv = th.dispatchEvent(e)
          if (th.keyTarget) {
            th.dispatchEvent({type: 'blur', canvasTarget: th.keyTarget})
            th.keyTarget = null
          }
          return rv
        }
      },

      mousemove : function(ev) {
        if (th.__blurStop && !th.isPlaying) th.play()
        if (!th.canvas.parentNode.contains(ev.target) && th.mouseDown)
          return th.dispatchEvent(ev)
      }

    }

    this.canvas.parentNode.addEventListener('DOMNodeRemoved', function(ev) {
      if (ev.target == this)
        th.removeWindowEventListeners()
    }, false)
    this.canvas.parentNode.addEventListener('DOMNodeInserted', function(ev) {
      if (ev.target == this)
        th.addWindowEventListeners()
    }, false)
    if (this.canvas.parentNode.parentNode) this.addWindowEventListeners()
  },

  updateKeys : function(ev) {
    this.keys.shift = ev.shiftKey
    this.keys.ctrl = ev.ctrlKey
    this.keys.alt = ev.altKey
    this.keys.meta = ev.metaKey
    var state = (ev.type == 'keydown')
    switch (ev.keyCode) {
      case 37: this.keys.left = state; break
      case 38: this.keys.up = state; break
      case 39: this.keys.right = state; break
      case 40: this.keys.down = state; break
      case 32: this.keys.space = state; break
      case 13: this.keys.enter = state; break
      case 9: this.keys.tab = state; break
      case 8: this.keys.backspace = state; break
      case 16: this.keys.shift = state; break
      case 17: this.keys.ctrl = state; break
      case 18: this.keys.alt = state; break
    }
    this.keys[ev.keyCode] = state
  },

  addWindowEventListeners : function() {
    for (var i in this.windowEventListeners)
      window.addEventListener(i, this.windowEventListeners[i], false)
  },

  removeWindowEventListeners : function() {
    for (var i in this.windowEventListeners)
      window.removeEventListener(i, this.windowEventListeners[i], false)
  },

  addMouseEvent : function(x,y,mouseDown) {
    var a = this.allocMouseEvent()
    a[0] = x
    a[1] = y
    a[2] = mouseDown
    this.mouseEvents.push(a)
  },

  allocMouseEvent : function() {
    if (this.mouseEventStack.length > 0) {
      return this.mouseEventStack.pop()
    } else {
      return [null, null, null]
    }
  },

  freeMouseEvent : function(ev) {
    this.mouseEventStack.push(ev)
    if (this.mouseEventStack.length > 100)
      this.mouseEventStack.splice(0,this.mouseEventStack.length)
  },

  clearMouseEvents : function() {
    while (this.mouseEvents.length > 0)
      this.freeMouseEvent(this.mouseEvents.pop())
  },

  createFrameLoop : function() {
    var self = this;
    var fl = {
      running : true,
      stop : function() {
        this.running = false;
      },
      run : function() {
        if (fl.running) {
          self.onFrame();
          requestAnimFrame(fl.run, self.canvas);
        }
      }
    };
    requestAnimFrame(fl.run, this.canvas);
    return fl;
  },

  /**
    Start frame loop.

    The frame loop is an interval, where #onFrame is called every
    #frameDuration milliseconds.
    */
  play : function() {
    this.stop();
    this.realTime = new Date().getTime();
    this.frameLoop = this.createFrameLoop();
    this.isPlaying = true;
  },

  /**
    Stop frame loop.
    */
  stop : function() {
    this.__blurStop = false;
    if (this.frameLoop) {
      this.frameLoop.stop();
      this.frameLoop = null;
    }
    this.isPlaying = false;
  },

  dispatchEvent : function(ev) {
    var rv = CanvasNode.prototype.dispatchEvent.call(this, ev)
    if (ev.cursor) {
      if (this.canvas.style.cursor != ev.cursor)
        this.canvas.style.cursor = ev.cursor
    } else {
      if (this.canvas.style.cursor != this.cursor)
        this.canvas.style.cursor = this.cursor
    }
    return rv
  },

  /**
    The frame loop function. Called every #frameDuration milliseconds.
    Takes an optional external time parameter (for syncing Canvases with each
    other, e.g. when using a Canvas as an image.)

    If the time parameter is given, the second parameter is used as the frame
    time delta (i.e. the time elapsed since last frame.)

    If time or timeDelta is not given, the canvas computes its own timeDelta.

    @param time The external time. Optional.
    @param timeDelta Time since last frame in milliseconds. Optional.
    */
  onFrame : function(time, timeDelta) {
    this.elementNodeZIndexCounter = 0
    var ctx = this.getContext()
    try {
      var realTime = new Date().getTime()
      this.currentRealElapsed = (realTime - this.realTime)
      this.currentRealFps = 1000 / this.currentRealElapsed
      var dt = this.frameDuration * this.speed
      if (!this.fixedTimestep)
        dt = this.currentRealElapsed * this.speed
      this.realTime = realTime
      if (time != null) {
        this.time = time
        if (timeDelta)
          dt = timeDelta
      } else {
        this.time += dt
      }
      this.previousTarget = this.target
      this.target = null
      if (this.catchMouse)
        this.handlePick(ctx)
      if (this.previousTarget != this.target) {
        if (this.previousTarget) {
          var nev = document.createEvent('MouseEvents')
          nev.initMouseEvent('mouseout', true, true, window,
            0, 0, 0, 0, 0, false, false, false, false, 0, null)
          nev.canvasTarget = this.previousTarget
          this.dispatchEvent(nev)
        }
        if (this.target) {
          var nev = document.createEvent('MouseEvents')
          nev.initMouseEvent('mouseover', true, true, window,
            0, 0, 0, 0, 0, false, false, false, false, 0, null)
          nev.canvasTarget = this.target
          this.dispatchEvent(nev)
        }
      }
      this.handleUpdate(this.time, dt)
      this.clearMouseEvents()
      if (!this.redrawOnlyWhenChanged || this.changed) {
        try {
          this.handleDraw(ctx)
        } catch(e) {
          console.log(e)
          throw(e)
        }
        this.changed = false
      }
      this.currentElapsed = (new Date().getTime() - this.realTime)
      this.elapsed += this.currentElapsed
      this.currentFps = 1000 / this.currentElapsed
      this.frame++
      if (this.frame % this.fpsFrames == 0) {
        this.fps = this.fpsFrames*1000 / (this.elapsed)
        this.realFps = this.fpsFrames*1000 / (new Date().getTime() - this.startTime)
        this.elapsed = 0
        this.startTime = new Date().getTime()
      }
    } catch(e) {
      if (ctx) {
        // screwed up, context is borked
        try {
          // FIXME don't be stupid
          for (var i=0; i<1000; i++)
            ctx.restore()
        } catch(er) {}
      }
      delete this.context
      throw(e)
    }
  },

  /**
    Returns the canvas drawing context object.

    @return Canvas drawing context
    */
  getContext : function() {
    if (this.recording)
      return this.getRecordingContext()
    else if (this.useMockContext)
      return this.getMockContext()
    else
      return this.get2DContext()
  },

  /**
    Gets and returns an augmented canvas 2D drawing context.

    The canvas 2D context is augmented by setter functions for all
    its instance variables, making it easier to record canvas operations in
    a cross-browser fashion.
    */
  get2DContext : function() {
    if (!this.context) {
      var ctx = CanvasSupport.getContext(this.canvas, '2d')
      this.context = ctx
    }
    return this.context
  },

  /**
    Creates and returns a mock drawing context.

    @return Mock drawing context
    */
  getMockContext : function() {
    if (!this.fakeContext) {
      var ctx = this.get2DContext()
      this.fakeContext = {}
      var f = function(){ return this }
      for (var i in ctx) {
        if (typeof(ctx[i]) == 'function')
          this.fakeContext[i] = f
        else
          this.fakeContext[i] = ctx[i]
      }
      this.fakeContext.isMockObject = true
      this.fakeContext.addColorStop = f
    }
    return this.fakeContext
  },

  getRecordingContext : function() {
    if (!this.recordingContext)
      this.recordingContext = new RecordingContext()
    return this.recordingContext
  },

  /**
    Canvas drawPickingPath uses the canvas rectangle as its path.

    @param ctx Canvas drawing context
    */
  drawPickingPath : function(ctx) {
    ctx.rect(0,0, this.canvas.width, this.canvas.height)
  },

  isPointInPath : function(x,y) {
    return ((x >= 0) && (x <= this.canvas.width) && (y >= 0) && (y <= this.canvas.height))
  },

  /**
    Sets globalAlpha to this.opacity and clears the canvas if #clear is set to
    true. If #fill is also set to true, fills the canvas rectangle instead of
    clearing (using #fillStyle as the color.)

    @param ctx Canvas drawing context
    */
  draw : function(ctx) {
    ctx.setGlobalAlpha( this.opacity )
    if (this.clear) {
      if (ctx.fillOn) {
        ctx.beginPath()
        ctx.rect(0,0, this.canvas.width, this.canvas.height)
        ctx.fill()
      } else {
        ctx.clearRect(0,0, this.canvas.width, this.canvas.height)
      }
    }
    // set default fill and stroke for the canvas contents
    ctx.fillStyle = 'black'
    ctx.strokeStyle = 'black'
    ctx.fillOn = false
    ctx.strokeOn = false
  }
})


/**
  Hacky link class for emulating <a>.

  The correct way would be to have a real <a> under the cursor while hovering
  this, or an imagemap polygon built from the clipped subtree path.

  @param href Link href.
  @param target Link target, defaults to _self.
  @param config Optional config hash.
  */
LinkNode = Klass(CanvasNode, {
  href : null,
  target : '_self',
  cursor : 'pointer',

  initialize : function(href, target, config) {
    this.href = href
    if (target)
      this.target = target
    CanvasNode.initialize.call(this, config)
    this.setupLinkEventListeners()
  },

  setupLinkEventListeners : function() {
    this.addEventListener('click', function(ev) {
      if (ev.button == Mouse.RIGHT) return
      var target = this.target
      if ((ev.ctrlKey || ev.button == Mouse.MIDDLE) && target == '_self')
        target = '_blank'
      window.open(this.href, target)
    }, false)
  }
})


/**
  AudioNode is a CanvasNode used to play a sound.

  */
AudioNode = Klass(CanvasNode, {
  ready : false,
  autoPlay : false,
  playing : false,
  paused : false,
  pan : 0,
  volume : 1,
  loop : false,

  transformSound : false,

  initialize : function(filename, params) {
    CanvasNode.initialize.call(this, params)
    this.filename = filename
    this.when('load', this._autoPlaySound)
    this.loadSound()
  },

  loadSound : function() {
    this.sound = CanvasSupport.getSoundObject()
    if (!this.sound) return
    var self = this
    this.sound.onready = function() {
      self.ready = true
      self.root.dispatchEvent({type: 'ready', canvasTarget: self})
    }
    this.sound.onload = function() {
      self.loaded = true
      self.root.dispatchEvent({type: 'load', canvasTarget: self})
    }
    this.sound.onerror = function() {
      self.root.dispatchEvent({type: 'error', canvasTarget: self})
    }
    this.sound.onfinish = function() {
      if (self.loop) self.play()
      else self.stop()
    }
    this.sound.load(this.filename)
  },

  play : function() {
    this.playing = true
    this.needPlayUpdate = true
  },

  stop : function() {
    this.playing = false
    this.needPlayUpdate = true
  },

  pause : function() {
    if (this.needPauseUpdate) {
      this.needPauseUpdate = false
      return
    }
    this.paused = !this.paused
    this.needPauseUpdate = true
  },

  setVolume : function(v) {
    this.volume = v
    this.needStatusUpdate = true
  },

  setPan : function(p) {
    this.pan = p
    this.needStatusUpdate = true
  },

  handleUpdate : function() {
    CanvasNode.handleUpdate.apply(this, arguments)
    if (this.willBeDrawn) {
      this.transform(null, true)
      if (!this.sound) this.loadSound()
      if (this.ready) {
        if (this.transformSound) {
          var x = this.currentMatrix[4]
          var y = this.currentMatrix[5]
          var a = this.currentMatrix[2]
          var b = this.currentMatrix[3]
          var c = this.currentMatrix[0]
          var d = this.currentMatrix[1]
          var hw = this.root.width * 0.5
          var ys = Math.sqrt(a*a + b*b)
          var xs = Math.sqrt(c*c + d*d)
          this.setVolume(ys)
          this.setPan((x - hw) / hw)
        }
        if (this.needPauseUpdate) {
          this.needPauseUpdate = false
          this._pauseSound()
        }
        if (this.needPlayUpdate) {
          this.needPlayUpdate = false
          if (this.playing) this._playSound()
          else this._stopSound()
        }
        if (this.needStatusUpdate) {
          this._setSoundVolume()
          this._setSoundPan()
        }
      }
    }
  },

  _autoPlaySound : function() {
    if (this.autoPlay) this.play()
  },

  _setSoundVolume : function() {
    this.sound.setVolume(this.volume)
  },

  _setSoundPan : function() {
    this.sound.setPan(this.pan)
  },

  _playSound : function() {
    if (this.sound.play() == false)
      return this.playing = false
    this.root.dispatchEvent({type: 'play', canvasTarget: this})
  },

  _stopSound : function() {
    this.sound.stop()
    this.root.dispatchEvent({type: 'stop', canvasTarget: this})
  },

  _pauseSound : function() {
    this.sound.pause()
    this.root.dispatchEvent({type: this.paused ? 'pause' : 'play', canvasTarget: this})
  }
})


/**
  ElementNode is a CanvasNode that has an HTML element as its content.

  The content is added to an absolutely positioned HTML element, which is added
  to the root node's canvases parentNode. The content element follows the
  current transformation matrix.

  The opacity of the element is set to the globalAlpha of the drawing context
  unless #noAlpha is true.

  The font-size of the element is set to the current y-scale unless #noScaling
  is true.

  Use ElementNode when you need accessible web content in your animations.

    var e = new ElementNode(
      E('h1', 'HERZLICH WILLKOMMEN IM BAHNHOF'),
      {
        x : 40,
        y : 30
      }
    )
    e.addFrameListener(function(t) {
      this.scale = 1 + 0.5*Math.cos(t/1000)
    })

  @param content An HTML element or string of HTML to use as the content.
  @param config Optional config has.
  */
ElementNode = Klass(CanvasNode, {
  noScaling : false,
  noAlpha : false,
  inherit : 'inherit',
  align: null, // left | center | right
  valign: null, // top | center | bottom
  xOffset: 0,
  yOffset: 0,

  initialize : function(content, config) {
    CanvasNode.initialize.call(this, config)
    this.content = content
    this.element = E('div', content)
    this.element.style.MozTransformOrigin =
    this.element.style.webkitTransformOrigin = '0 0'
    this.element.style.position = 'absolute'
  },

  clone : function() {
    var c = CanvasNode.prototype.clone.call(this)
    if (this.content && this.content.cloneNode)
      c.content = this.content.cloneNode(true)
    c.element = E('div', c.content)
    c.element.style.position = 'absolute'
    c.element.style.MozTransformOrigin =
    c.element.style.webkitTransformOrigin = '0 0'
    return c
  },

  setRoot : function(root) {
    CanvasNode.setRoot.call(this, root)
    if (this.element && this.element.parentNode && this.element.parentNode.removeChild)
      this.element.parentNode.removeChild(this.element)
  },

  handleUpdate : function(t, dt) {
    CanvasNode.handleUpdate.call(this, t, dt)
    if (!this.willBeDrawn || !this.visible || this.display == 'none' || this.visibility == 'hidden' || !this.drawable) {
      if (this.element.style.display != 'none')
        this.element.style.display = 'none'
    } else if (this.element.style.display == 'none') {
      this.element.style.display = 'block'
    }
  },

  addEventListener : function(event, callback, capture) {
    var th = this
    var ccallback = function() { callback.apply(th, arguments) }
    return this.element.addEventListener(event, ccallback, capture||false)
  },

  removeEventListener : function(event, callback, capture) {
    var th = this
    var ccallback = function() { callback.apply(th, arguments) }
    return this.element.removeEventListener(event, ccallback, capture||false)
  },

  draw : function(ctx) {
    if (this.cursor && this.element.style.cursor != this.cursor)
      this.element.style.cursor = this.cursor
    if (this.element.style.zIndex != this.root.elementNodeZIndexCounter)
      this.element.style.zIndex = this.root.elementNodeZIndexCounter
    this.root.elementNodeZIndexCounter++
    var baseTransform = this.currentMatrix
    xo = this.xOffset
    yo = this.yOffset
    if (this.fillBoundingBox && this.parent && this.parent.getBoundingBox) {
      var bb = this.parent.getBoundingBox()
      xo += bb[0]
      yo += bb[1]
    }
    var xy = CanvasSupport.tMatrixMultiplyPoint(baseTransform.slice(0,4).concat([0,0]),
      xo, yo)
    var x = this.currentMatrix[4] + xy[0]
    var y = this.currentMatrix[5] + xy[1]
    var a = this.currentMatrix[2]
    var b = this.currentMatrix[3]
    var c = this.currentMatrix[0]
    var d = this.currentMatrix[1]
    var ys = Math.sqrt(a*a + b*b)
    var xs = Math.sqrt(c*c + d*d)
    if (ctx.fontFamily != null)
      this.element.style.fontFamily = ctx.fontFamily

    var wkt = CanvasSupport.isCSSTransformSupported()
    if (wkt && !this.noScaling) {
      this.element.style.MozTransform =
      this.element.style.webkitTransform = 'matrix('+baseTransform.join(",")+')'
    } else {
      this.element.style.MozTransform =
      this.element.style.webkitTransform = ''
    }
    if (ctx.fontSize != null) {
      if (this.noScaling || wkt) {
        this.element.style.fontSize = ctx.fontSize + 'px'
      } else {
        this.element.style.fontSize = ctx.fontSize * ys + 'px'
      }
    } else {
      if (this.noScaling || wkt) {
        this.element.style.fontSize = 'inherit'
      } else {
        this.element.style.fontSize = 100 * ys + '%'
      }
    }
    if (this.noAlpha)
      this.element.style.opacity = 1
    else
      this.element.style.opacity = ctx.globalAlpha
    if (!this.element.parentNode && this.root.canvas.parentNode) {
      this.element.style.visibility = 'hidden'
      this.root.canvas.parentNode.appendChild(this.element)
      var hidden = true
    }
    var fs = this.color || this.fill
    if (this.parent) {
      if (!fs || !fs.length)
        fs = this.parent.color
      if (!fs || !fs.length)
        fs = this.parent.fill
    }
    if (!fs || !fs.length)
      fs = ctx.fillStyle
    if (typeof(fs) == 'string') {
      if (fs.search(/^rgba\(/) != -1) {
        this.element.style.color = 'rgb(' +
          fs.match(/\d+/g).slice(0,3).join(",") +
          ')'
      } else {
        this.element.style.color = fs
      }
    } else if (fs.length) {
      this.element.style.color = 'rgb(' + fs.slice(0,3).map(Math.floor).join(",") + ')'
    }
    var dx = 0, dy = 0
    if (bb) {
      this.element.style.width = Math.floor(xs * bb[2]) + 'px'
      this.element.style.height = Math.floor(ys * bb[3]) + 'px'
      this.eWidth = xs
      this.eHeight = ys
    } else {
      this.element.style.width = ''
      this.element.style.height = ''
      var align = this.align || this.textAnchor
      var origin = [0,0]
      if (align == 'center' || align == 'middle') {
        dx = -this.element.offsetWidth / 2
        origin[0] = '50%'
      } else if (align == 'right') {
        dx = -this.element.offsetWidth
        origin[0] = '100%'
      }
      var valign = this.valign
      if (valign == 'center' || valign == 'middle') {
        dy = -this.element.offsetHeight / 2
        origin[1] = '50%'
      } else if (valign == 'bottom') {
        dy = -this.element.offsetHeight
        origin[1] = '100%'
      }
      this.element.style.webkitTransformOrigin =
      this.element.style.MozTransformOrigin = origin.join(" ")
      this.eWidth = this.element.offsetWidth / xs
      this.eHeight = this.element.offsetHeight / ys
    }
    if (wkt && !this.noScaling) {
      this.element.style.left = Math.floor(dx) + 'px'
      this.element.style.top = Math.floor(dy) + 'px'
    } else {
      this.element.style.left = Math.floor(x+dx) + 'px'
      this.element.style.top = Math.floor(y+dy) + 'px'
    }
    if (hidden)
      this.element.style.visibility = 'visible'
  }
})


/**
  A Drawable is a CanvasNode with possible fill, stroke and clip.

  It draws the path by calling #drawGeometry
  */
Drawable = Klass(CanvasNode, {
  pickable : true,
  //   'inside' // clip before drawing the stroke
  // | 'above'  // draw stroke after the fill
  // | 'below'  // draw stroke before the fill
  strokeMode : 'above',

  ABOVE : 'above', BELOW : 'below', INSIDE : 'inside',

  initialize : function(config) {
    CanvasNode.initialize.call(this, config)
  },

  /**
    Draws the picking path for the Drawable.

    The default version begins a new path and calls drawGeometry.

    @param ctx Canvas drawing context
    */
  drawPickingPath : function(ctx) {
    if (!this.drawGeometry) return
    ctx.beginPath()
    this.drawGeometry(ctx)
  },

  /**
    Returns true if the point x,y is inside the path of a drawable node.

    The x,y point is in user-space coordinates, meaning that e.g. the point
    5,5 will always be inside the rectangle [0, 0, 10, 10], regardless of the
    transform on the rectangle.

    @param x X-coordinate of the point.
    @param y Y-coordinate of the point.
    @return Whether the point is inside the path of this node.
    @type boolean
    */
  isPointInPath : function(x, y) {
    return false
  },

  isVisible : function(ctx) {
    var abb = this.getAxisAlignedBoundingBox()
    if (!abb) return true
    var x1 = abb[0], x2 = abb[0]+abb[2], y1 = abb[1], y2 = abb[1]+abb[3]
    var w = this.root.width
    var h = this.root.height
    if (this.root.drawBoundingBoxes) {
      ctx.save()
        var bbox = this.getBoundingBox()
        ctx.beginPath()
        ctx.rect(bbox[0], bbox[1], bbox[2], bbox[3])
        ctx.strokeStyle = 'green'
        ctx.lineWidth = 1
        ctx.stroke()
      ctx.restore()
      ctx.save()
        CanvasSupport.setTransform(ctx, [1,0,0,1,0,0], this.currentMatrix)
        ctx.beginPath()
        ctx.rect(x1, y1, x2-x1, y2-y1)
        ctx.strokeStyle = 'red'
        ctx.lineWidth = 1.5
        ctx.stroke()
      ctx.restore()
    }
    var visible = !(x2 < 0 || x1 > w || y2 < 0 || y1 > h)
    return visible
  },

  createSubtreePath : function(ctx, skipTransform) {
    ctx.save()
    if (!skipTransform) this.transform(ctx, true)
    if (this.drawGeometry) this.drawGeometry(ctx)
    for (var i=0; i<this.childNodes.length; i++)
      this.childNodes[i].createSubtreePath(ctx)
    ctx.restore()
  },

  /**
    Draws the Drawable. Begins a path and calls this.drawGeometry, followed by
    possibly filling, stroking and clipping the path, depending on whether
    #fill, #stroke and #clip are set.

    @param ctx Canvas drawing context
    */
  draw : function(ctx) {
    if (!this.drawGeometry) return
    // bbox checking is slower than just drawing in most cases.
    // and caching the bboxes is hard to do correctly.
    // plus, bboxes aren't hierarchical.
    // so we are being glib :|
    if (this.root.drawBoundingBoxes)
      this.isVisible(ctx)
    var ft = (ctx.fillStyle.transformList ||
              ctx.fillStyle.matrix ||
              ctx.fillStyle.scale != null ||
              ctx.fillStyle.rotation ||
              ctx.fillStyle.x ||
              ctx.fillStyle.y )
    var st = (ctx.strokeStyle.transformList ||
              ctx.strokeStyle.matrix ||
              ctx.strokeStyle.scale != null ||
              ctx.strokeStyle.rotation ||
              ctx.strokeStyle.x ||
              ctx.strokeStyle.y )
    ctx.beginPath()
    this.drawGeometry(ctx)
    if (ctx.strokeOn) {
      switch (this.strokeMode) {
        case this.ABOVE:
          if (ctx.fillOn) this.doFill(ctx,ft)
          this.doStroke(ctx, st)
          break
        case this.BELOW:
          this.doStroke(ctx, st)
          if (ctx.fillOn) this.doFill(ctx,ft)
          break
        case this.INSIDE:
          if (ctx.fillOn) this.doFill(ctx,ft)
          ctx.save()
          var lw = ctx.lineWidth
          ctx.setLineWidth(1)
          this.doStroke(ctx, st)
          ctx.setLineWidth(lw)
          ctx.clip()
          this.doStroke(ctx, st)
          ctx.restore()
          break
      }
    } else if (ctx.fillOn) {
      this.doFill(ctx,ft)
    }
    this.drawMarkers(ctx)
    if (this.clip) ctx.clip()
  },

  doFill : function(ctx, ft) {
    if (ft || (this.getBoundingBox && ctx.fillStyle.units == this.OBJECTBOUNDINGBOX)) {
      ctx.save()
      if (this.getBoundingBox && ctx.fillStyle.units == this.OBJECTBOUNDINGBOX) {
        var bb = this.getBoundingBox()
        var sx = bb[2]
        var sy = bb[3]
        ctx.translate(bb[0],bb[1])
        ctx.scale(sx,sy)
      }
      ctx.fillStyle.transform(ctx)
    }
    if (this.fillOpacity != null) {
      var go = ctx.globalAlpha
      ctx.setGlobalAlpha(go * this.fillOpacity)
      ctx.fill()
      ctx.globalAlpha = go
    } else {
      ctx.fill()
    }
    if (ft) ctx.restore()
  },

  doStroke : function(ctx, st) {
    if (st || (this.getBoundingBox && ctx.strokeStyle.units == this.OBJECTBOUNDINGBOX)) {
      ctx.save()
      if (this.getBoundingBox && ctx.strokeStyle.units == this.OBJECTBOUNDINGBOX) {
        var bb = this.getBoundingBox()
        var sx = bb[2]
        var sy = bb[3]
        ctx.translate(bb[0],bb[1])
        ctx.scale(sx,sy)
      }
      ctx.strokeStyle.needMatrixUpdate = true
      ctx.strokeStyle.transform(ctx)
      if (sx != null)
        CanvasSupport.tScale(ctx.strokeStyle.currentMatrix, sx, sy)
      var cm = ctx.strokeStyle.currentMatrix
      // fix stroke width scale (non-uniform scales screw us up though)
      var sw = Math.sqrt(Math.max(
        cm[0]*cm[0] + cm[1]*cm[1],
        cm[2]*cm[2] + cm[3]*cm[3]
      ))
      ctx.setLineWidth(((ctx.lineWidth == null) ? 1 : ctx.lineWidth) / sw)
    }
    if (this.strokeOpacity != null) {
      var go = ctx.globalAlpha
      ctx.setGlobalAlpha(go * this.strokeOpacity)
      ctx.stroke()
      ctx.globalAlpha = go
    } else {
      ctx.stroke()
    }
    if (st) ctx.restore()
  },

  drawMarkers : function(ctx) {
    var sm = this.markerStart || this.marker
    var em = this.markerEnd || this.marker
    var mm = this.markerMid || this.marker
    if (sm && this.getStartPoint) {
      var pa = this.getStartPoint()
      if (sm.orient != null && sm.orient != 'auto')
        pa.angle = sm.orient
      var scale = (sm.markerUnits == 'strokeWidth') ? ctx.lineWidth : 1
      ctx.save()
        ctx.translate(pa.point[0], pa.point[1])
        ctx.scale(scale, scale)
        ctx.rotate(pa.angle)
        var mat = CanvasSupport.tRotate(
          CanvasSupport.tScale(
          CanvasSupport.tTranslate(
            this.currentMatrix.slice(0),
            pa.point[0], pa.point[1]
          ), scale, scale), pa.angle)
        sm.__copyMatrix(mat)
        sm.handleDraw(ctx)
      ctx.restore()
    }
    if (em && this.getEndPoint) {
      var pa = this.getEndPoint()
      if (em.orient != null && em.orient != 'auto')
        pa.angle = em.orient
      var scale = (em.markerUnits == 'strokeWidth') ? ctx.lineWidth : 1
      ctx.save()
        ctx.translate(pa.point[0], pa.point[1])
        ctx.scale(scale, scale)
        ctx.rotate(pa.angle)
        var mat = CanvasSupport.tRotate(
          CanvasSupport.tScale(
          CanvasSupport.tTranslate(
            this.currentMatrix.slice(0),
            pa.point[0], pa.point[1]
          ), scale, scale), pa.angle)
        em.__copyMatrix(mat)
        em.handleDraw(ctx)
      ctx.restore()
    }
    if (mm && this.getMidPoints) {
      var pas = this.getMidPoints()
      var scale = (mm.markerUnits == 'strokeWidth') ? ctx.lineWidth : 1
      for (var i=0; i<pas.length; i++) {
        var pa = pas[i]
        ctx.save()
          ctx.translate(pa.point[0], pa.point[1])
          ctx.scale(scale, scale)
          if (mm.orient != null && mm.orient != 'auto')
            pa.angle = em.orient
          ctx.rotate(pa.angle)
          var mat = CanvasSupport.tRotate(
            CanvasSupport.tScale(
            CanvasSupport.tTranslate(
              this.currentMatrix.slice(0),
              pa.point[0], pa.point[1]
            ), scale, scale), pa.angle)
          mm.__copyMatrix(mat)
          mm.handleDraw(ctx)
        ctx.restore()
      }
    }
  },

  getStartPoint : false,
  getEndPoint : false,
  getMidPoints : false,
  getBoundingBox : false

})


/**
  A Line is a line drawn from x1,y1 to x2,y2. Lines are stroked by default.

  @param x1 X-coordinate of the line's first point.
  @param y1 Y-coordinate of the line's first point.
  @param x2 X-coordinate of the line's second point.
  @param y2 Y-coordinate of the line's second point.
  @param config Optional config hash.
  */
Line = Klass(Drawable, {
  x1 : 0,
  y1 : 0,
  x2 : 0,
  y2 : 0,
  stroke : true,

  initialize : function(x1,y1, x2,y2, config) {
    this.x1 = x1
    this.y1 = y1
    this.x2 = x2
    this.y2 = y2
    Drawable.initialize.call(this, config)
  },

  drawGeometry : function(ctx) {
    ctx.moveTo(this.x1, this.y1)
    ctx.lineTo(this.x2, this.y2)
  },

  getStartPoint : function() {
    return {
      point: [this.x1, this.y1],
      angle: Math.atan2(this.y2-this.y1, this.x2-this.x1)
    }
  },

  getEndPoint : function() {
    return {
      point: [this.x2, this.y2],
      angle: Math.atan2(this.y2-this.y1, this.x2-this.x1)
    }
  },

  getBoundingBox : function() {
    return [this.x1, this.y1, this.x2-this.x1, this.y2-this.y1]
  },

  getLength : function() {
    return Curves.lineLength([this.x1, this.y1], [this.x2, this.y2])
  }

})



/**
  Circle is used for creating circular paths.

  Uses context.arc(...).

  Attributes:
    cx, cy, radius, startAngle, endAngle, clockwise, closePath, includeCenter

  @param radius Radius of the circle.
  @param config Optional config hash.
  */
Circle = Klass(Drawable, {
  cx : 0,
  cy : 0,
  radius : 10,
  startAngle : 0,
  endAngle : Math.PI * 2,
  clockwise : false,
  closePath : true,
  includeCenter : false,

  initialize : function(radius, config) {
    if (radius != null) this.radius = radius
    Drawable.initialize.call(this, config)
  },

  /**
    Creates a circular path using ctx.arc(...).

    @param ctx Canvas drawing context.
    */
  drawGeometry : function(ctx) {
    if (this.radius == 0) return
    if (this.includeCenter)
      ctx.moveTo(this.cx, this.cy)
    ctx.arc(this.cx, this.cy, this.radius, this.startAngle, this.endAngle, this.clockwise)
    if (this.closePath) {
      // firefox 2 is buggy without the endpoint
      var x2 = Math.cos(this.endAngle)
      var y2 = Math.sin(this.endAngle)
      ctx.moveTo(this.cx + x2*this.radius, this.cy + y2 * this.radius)
      ctx.closePath()
    }
  },

  /**
    Returns true if the point x,y is inside the radius of the circle.

    The x,y point is in user-space coordinates, meaning that e.g. the point
    5,0 will always be inside a circle with radius of 10 and center at origin,
    regardless of the transform on the circle.

    @param x X-coordinate of the point.
    @param y Y-coordinate of the point.
    @return Whether the point is inside the radius of this circle.
    @type boolean
    */
  isPointInPath : function(x,y) {
    x -= this.cx
    y -= this.cy
    return (x*x + y*y) <= (this.radius*this.radius)
  },

  getBoundingBox : function() {
    return [this.cx-this.radius, this.cy-this.radius,
            2*this.radius, 2*this.radius]
  }
})


/**
  Ellipse is a scaled circle. Except it isn't. Because that wouldn't work in
  Opera.
  */
Ellipse = Klass(Circle, {
  radiusX : 0,
  radiusY : 0,

  initialize : function(radiusX, radiusY, config) {
    this.radiusX = radiusX
    this.radiusY = radiusY
    Circle.initialize.call(this, 1, config)
  },

  drawGeometry : function(ctx) {
    if (this.radiusX == 0 || this.radiusY == 0) return
    var k = 0.5522847498
    var x = this.cx
    var y = this.cy
    var krx = k*this.radiusX
    var kry = k*this.radiusY
    ctx.moveTo(x+this.radiusX, y)
    ctx.bezierCurveTo(x+this.radiusX, y-kry, x+krx, y-this.radiusY, x, y-this.radiusY)
    ctx.bezierCurveTo(x-krx, y-this.radiusY, x-this.radiusX, y-kry, x-this.radiusX, y)
    ctx.bezierCurveTo(x-this.radiusX, y+kry, x-krx, y+this.radiusY, x, y+this.radiusY)
    ctx.bezierCurveTo(x+krx, y+this.radiusY, x+this.radiusX, y+kry, x+this.radiusX, y)
  },

  isPointInPath : function(x, y) {
    // does this work?
    x -= this.cx
    y -= this.cy
    x /= this.radiusX
    y /= this.radiusY
    return (x*x + y*y) <= 1
  },

  getBoundingBox : function() {
    return [this.cx-this.radiusX, this.cy-this.radiusY,
            this.radiusX*2, this.radiusY*2]
  }
})


/**
  A Spiral is a function graph drawn in polar coordinates from startAngle to
  endAngle. And the source of all life energy, etc.
  */
Spiral = Klass(Drawable, {
  cx : 0,
  cy : 0,
  startRadius : 0,
  startAngle : 0,
  endAngle : 0,

  radiusFunction : function(a) {
    return a
  },

  initialize : function(endAngle, config) {
    this.endAngle = endAngle
    Drawable.initialize.call(this, config)
  },

  drawGeometry : function(ctx) {
    var x = this.cx
    var y = this.cy
    var a = this.startAngle
    var r = this.startRadius + this.radiusFunction(a)
    ctx.moveTo(x+Math.cos(a)*r, y-Math.sin(a)*r)
    if (this.startAngle < this.endAngle) {
      a += 0.1
      r = this.startRadius + this.radiusFunction(a)
      while (a < this.endAngle) {
        ctx.lineTo(x+Math.cos(a)*r, y-Math.sin(a)*r)
        a += 0.1
        r = this.startRadius + this.radiusFunction(a)
      }
    } else {
      a -= 0.1
      r = this.startRadius + this.radiusFunction(a)
      while (a > this.endAngle) {
        ctx.lineTo(x+Math.cos(a)*r, y-Math.sin(a)*r)
        a -= 0.1
        r = this.startRadius + this.radiusFunction(a)
      }
    }
    a = this.endAngle
    r = this.startRadius + this.radiusFunction(a)
    ctx.lineTo(x+Math.cos(a)*r, y-Math.sin(a)*r)
  },

  isPointInPath : function(x, y) {
    return false
  }
})


/**
  Rectangle is used for creating rectangular paths.

  Uses context.rect(...).

  Attributes:
    cx, cy, width, height, centered, rx, ry

  If centered is set to true, centers the rectangle on the origin.
  Otherwise the top-left corner of the rectangle is on the origin.

  @param width Width of the rectangle.
  @param height Height of the rectangle.
  @param config Optional config hash.
  */
Rectangle = Klass(Drawable, {
  cx : 0,
  cy : 0,
  x2 : 0,
  y2 : 0,
  width : 0,
  height : 0,
  rx : 0,
  ry : 0,
  centered : false,

  initialize : function(width, height, config) {
    if (width != null) {
      this.width = width
      this.height = width
    }
    if (height != null) this.height = height
    Drawable.initialize.call(this, config)
  },

  /**
    Creates a rectangular path using ctx.rect(...).

    @param ctx Canvas drawing context.
    */
  drawGeometry : function(ctx) {
    var x = this.cx
    var y = this.cy
    var w = (this.width || (this.x2 - x))
    var h = (this.height || (this.y2 - y))
    if (w == 0 || h == 0) return
    if (this.centered) {
      x -= 0.5*w
      y -= 0.5*h
    }
    if (this.rx || this.ry) {
      // hahaa, welcome to the undocumented rounded corners path
      // using bezier curves approximating ellipse quadrants
      var rx = Math.min(w * 0.5, this.rx || this.ry)
      var ry = Math.min(h * 0.5, this.ry || rx)
      var k = 0.5522847498
      var krx = k*rx
      var kry = k*ry
      ctx.moveTo(x+rx, y)
      ctx.lineTo(x-rx+w, y)
      ctx.bezierCurveTo(x-rx+w + krx, y, x+w, y+ry-kry, x+w, y+ry)
      ctx.lineTo(x+w, y+h-ry)
      ctx.bezierCurveTo(x+w, y+h-ry+kry, x-rx+w+krx, y+h, x-rx+w, y+h)
      ctx.lineTo(x+rx, y+h)
      ctx.bezierCurveTo(x+rx-krx, y+h, x, y+h-ry+kry, x, y+h-ry)
      ctx.lineTo(x, y+ry)
      ctx.bezierCurveTo(x, y+ry-kry, x+rx-krx, y, x+rx, y)
      ctx.closePath()
    } else {
      if (w < 0) x += w
      if (h < 0) y += h
      ctx.rect(x, y, Math.abs(w), Math.abs(h))
    }
  },

  /**
    Returns true if the point x,y is inside this rectangle.

    The x,y point is in user-space coordinates, meaning that e.g. the point
    5,5 will always be inside the rectangle [0, 0, 10, 10], regardless of the
    transform on the rectangle.

    @param x X-coordinate of the point.
    @param y Y-coordinate of the point.
    @return Whether the point is inside this rectangle.
    @type boolean
    */
  isPointInPath : function(x,y) {
    x -= this.cx
    y -= this.cy
    if (this.centered) {
      x += this.width/2
      y += this.height/2
    }
    return (x >= 0 && x <= this.width && y >= 0 && y <= this.height)
  },

  getBoundingBox : function() {
    var x = this.cx
    var y = this.cy
    if (this.centered) {
      x -= this.width/2
      y -= this.height/2
    }
    return [x,y,this.width,this.height]
  }
})


/**
  Polygon is used for creating paths consisting of straight line
  segments.

  Attributes:
    segments - The vertices of the polygon, e.g. [0,0, 1,1, 1,2, 0,1]
    closePath - Whether to close the path, default is true.

  @param segments The vertices of the polygon.
  @param closePath Whether to close the path.
  @param config Optional config hash.
  */
Polygon = Klass(Drawable, {
  segments : [],
  closePath : true,

  initialize : function(segments, config) {
    this.segments = segments
    Drawable.initialize.call(this, config)
  },

  drawGeometry : function(ctx) {
    if (!this.segments || this.segments.length < 2) return
    var s = this.segments
    ctx.moveTo(s[0], s[1])
    for (var i=2; i<s.length; i+=2) {
      ctx.lineTo(s[i], s[i+1])
    }
    if (this.closePath)
      ctx.closePath()
  },

  isPointInPath : function(px,py) {
    if (!this.segments || this.segments.length < 2) return false
    var bbox = this.getBoundingBox()
    return (px >= bbox[0] && px <= bbox[0]+bbox[2] &&
            py >= bbox[1] && py <= bbox[1]+bbox[3])
  },

  getStartPoint : function() {
    if (!this.segments || this.segments.length < 2)
      return {point:[0,0], angle:0}
    var a = 0
    if (this.segments.length > 2) {
      a = Curves.lineAngle(this.segments.slice(0,2), this.segments.slice(2,4))
    }
    return {point: this.segments.slice(0,2),
            angle: a}
  },

  getEndPoint : function() {
    if (!this.segments || this.segments.length < 2)
      return {point:[0,0], angle:0}
    var a = 0
    if (this.segments.length > 2) {
      a = Curves.lineAngle(this.segments.slice(-4,-2), this.segments.slice(-2))
    }
    return {point: this.segments.slice(-2),
            angle: a}
  },

  getMidPoints : function() {
    if (!this.segments || this.segments.length < 2)
      return []
    var segs = this.segments
    var verts = []
    for (var i=2; i<segs.length-2; i+=2) {
      var a = segs.slice(i-2,i)
      var b = segs.slice(i, i+2)
      var c = segs.slice(i+2, i+4)
      var t = 0.5 * (Curves.lineAngle(a,b) + Curves.lineAngle(b,c))
      verts.push(
        {point: b, angle: t}
      )
    }
    return verts
  },

  getBoundingBox : function() {
    var minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
    var s = this.segments
    for (var i=0; i<s.length; i+=2) {
      var x = s[i], y = s[i+1]
      if (x < minX) minX = x
      if (x > maxX) maxX = x
      if (y < minY) minY = y
      if (y > maxY) maxY = y
    }
    return [minX, minY, maxX-minX, maxY-minY]
  }
})



/**
  CatmullRomSpline draws a Catmull-Rom spline, with optional looping and
  path closing. Handy for motion paths.

  @param segments Control points for the spline, as [[x,y], [x,y], ...]
  @param config Optional config hash.
  */
CatmullRomSpline = Klass(Drawable, {
  segments : [],
  loop : false,
  closePath : false,

  initialize : function(segments, config) {
    this.segments = segments
    Drawable.initialize.call(this, config)
  },

  drawGeometry : function(ctx) {
    var x1 = this.currentMatrix[0]
    var x2 = this.currentMatrix[1]
    var y1 = this.currentMatrix[2]
    var y2 = this.currentMatrix[3]
    var xs = x1*x1 + x2*x2
    var ys = y1*y1 + y2*y2
    var s = Math.floor(Math.sqrt(Math.max(xs, ys)))
    var cmp = this.compiled
    if (!cmp || cmp.scale != s) {
      cmp = this.compile(s)
    }
    for (var i=0; i<cmp.length; i++) {
      var cmd = cmp[i]
      ctx[cmd[0]].apply(ctx, cmd[1])
    }
    if (this.closePath)
      ctx.closePath()
  },

  compile : function(scale) {
    if (!scale) scale = 1
    var compiled = []
    if (this.segments && this.segments.length >= (this.loop ? 1 : 4)) {
      var segs = this.segments
      if (this.loop) {
        segs = segs.slice(0)
        segs.unshift(segs[segs.length-1])
        segs.push(segs[1])
        segs.push(segs[2])
      }
      // FIXME don't be stupid
      var point_spacing = 1 / (15 * (scale+0.5))
      var a,b,c,d,p,pp
      compiled.push(['moveTo', segs[1].slice(0)])
      p = segs[1]
      for (var j=1; j<segs.length-2; j++) {
        a = segs[j-1]
        b = segs[j]
        c = segs[j+1]
        d = segs[j+2]
        for (var i=0; i<1; i+=point_spacing) {
          pp = p
          p = Curves.catmullRomPoint(a,b,c,d,i)
          compiled.push(['lineTo', p])
        }
      }
      p = Curves.catmullRomPoint(a,b,c,d,1)
      compiled.push(['lineTo', p])
    }
    compiled.scale = scale
    this.compiled = compiled
    return compiled
  },

  getBoundingBox : function() {
    var minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
    var segments = (this.compiled ? this.compiled : this.compile())
    for (var i=0; i<segments.length; i++) {
      var seg = segments[i][1]
      for (var j=0; j<seg.length; j+=2) {
        var x = seg[j], y = seg[j+1]
        if (x < minX) minX = x
        if (x > maxX) maxX = x
        if (y < minY) minY = y
        if (y > maxY) maxY = y
      }
    }
    return [minX, minY, maxX-minX, maxY-minY]
  },

  pointAt : function(t) {
    if (!this.segments) return [0,0]
    if (this.segments.length >= (this.loop ? 1 : 4)) {
      var segs = this.segments
      if (this.loop) {
        segs = segs.slice(0)
        segs.unshift(segs[segs.length-1])
        segs.push(segs[1])
        segs.push(segs[2])
      }
      // turn t into segment_index.segment_t
      var rt = t * (segs.length - 3)
      var j = Math.floor(rt)
      var st = rt-j
      var a = segs[j],
          b = segs[j+1],
          c = segs[j+2],
          d = segs[j+3]
      return Curves.catmullRomPoint(a,b,c,d,st)
    } else {
      return this.segments[0]
    }
  },

  pointAngleAt : function(t) {
    if (!this.segments) return {point: [0,0], angle: 0}
    if (this.segments.length >= (this.loop ? 1 : 4)) {
      var segs = this.segments
      if (this.loop) {
        segs = segs.slice(0)
        segs.unshift(segs[segs.length-1])
        segs.push(segs[1])
        segs.push(segs[2])
      }
      // turn t into segment_index.segment_t
      var rt = t * (segs.length - 3)
      var j = Math.floor(rt)
      var st = rt-j
      var a = segs[j],
          b = segs[j+1],
          c = segs[j+2],
          d = segs[j+3]
      return Curves.catmullRomPointAngle(a,b,c,d,st)
    } else {
      return {point:this.segments[0] || [0,0], angle: 0}
    }
  }
})


/**
  Path is used for creating custom paths.

  Attributes: segments, closePath.

    var path = new Path([
      ['moveTo', [-50, -60]],
      ['lineTo', [30, 50],
      ['lineTo', [-50, 50]],
      ['bezierCurveTo', [-50, 100, -50, 100, 0, 100]],
      ['quadraticCurveTo', [0, 120, -20, 130]],
      ['quadraticCurveTo', [0, 140, 0, 160]],
      ['bezierCurveTo', [-10, 160, -20, 170, -30, 180]],
      ['quadraticCurveTo', [10, 230, -50, 260]]
    ])

  The path segments are used as [methodName, arguments] on the canvas
  drawing context, so the possible path segments are:

    ['moveTo', [x, y]]
    ['lineTo', [x, y]]
    ['quadraticCurveTo', [control_point_x, control_point_y, x, y]]
    ['bezierCurveTo', [cp1x, cp1y, cp2x, cp2y, x, y]]
    ['arc', [x, y, radius, startAngle, endAngle, drawClockwise]]
    ['arcTo', [x1, y1, x2, y2, radius]]
    ['rect', [x, y, width, height]]

  You can also pass an SVG path string as segments.

    var path = new Path("M 100 100 L 300 100 L 200 300 z", {
      stroke: true, strokeStyle: 'blue',
      fill: true, fillStyle: 'red',
      lineWidth: 3
    })

  @param segments The path segments.
  @param config Optional config hash.
  */
Path = Klass(Drawable, {
  segments : [],
  closePath : false,

  initialize : function(segments, config) {
    this.segments = segments
    Drawable.initialize.call(this, config)
  },

  /**
    Creates a path on the given drawing context.

    For each path segment, calls the context method named in the first element
    of the segment with the rest of the segment elements as arguments.

    SVG paths are parsed and executed.

    Closes the path if closePath is true.

    @param ctx Canvas drawing context.
    */
  drawGeometry : function(ctx) {
    var segments = this.getSegments()
    for (var i=0; i<segments.length; i++) {
      var seg = segments[i]
      ctx[seg[0]].apply(ctx, seg[1])
    }
    if (this.closePath)
      ctx.closePath()
  },

  /**
    Returns true if the point x,y is inside the path's bounding rectangle.

    The x,y point is in user-space coordinates, meaning that e.g. the point
    5,5 will always be inside the rectangle [0, 0, 10, 10], regardless of the
    transform on the rectangle.

    @param px X-coordinate of the point.
    @param py Y-coordinate of the point.
    @return Whether the point is inside the path's bounding rectangle.
    @type boolean
    */
  isPointInPath : function(px,py) {
    var bbox = this.getBoundingBox()
    return (px >= bbox[0] && px <= bbox[0]+bbox[2] &&
            py >= bbox[1] && py <= bbox[1]+bbox[3])
  },

  getBoundingBox : function() {
    if (!(this.compiled && this.compiledBoundingBox)) {
      var minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
      var segments = this.getSegments()
      for (var i=0; i<segments.length; i++) {
        var seg = segments[i][1]
        for (var j=0; j<seg.length; j+=2) {
          var x = seg[j], y = seg[j+1]
          if (x < minX) minX = x
          if (x > maxX) maxX = x
          if (y < minY) minY = y
          if (y > maxY) maxY = y
        }
      }
      this.compiledBoundingBox = [minX, minY, maxX-minX, maxY-minY]
    }
    return this.compiledBoundingBox
  },

  getStartPoint : function() {
    var segs = this.getSegments()
    if (!segs || !segs[0]) return {point: [0,0], angle: 0}
    var fs = segs[0]
    var c = fs[1]
    var point = [c[c.length-2], c[c.length-1]]
    var ss = segs[1]
    var angle = 0
    if (ss) {
      c2 = ss[1]
      angle = Curves.lineAngle(point, [c2[c2.length-2], c2[c2.length-1]])
    }
    return {
      point: point,
      angle: angle
    }
  },

  getEndPoint : function() {
    var segs = this.getSegments()
    if (!segs || !segs[0]) return {point: [0,0], angle: 0}
    var fs = segs[segs.length-1]
    var c = fs[1]
    var point = [c[c.length-2], c[c.length-1]]
    var ss = segs[segs.length-2]
    var angle = 0
    if (ss) {
      c2 = ss[1]
      angle = Curves.lineAngle([c2[c2.length-2], c2[c2.length-1]], point)
    }
    return {
      point: point,
      angle: angle
    }
  },

  getMidPoints : function() {
    var segs = this.getSegments()
    if (this.vertices)
      return this.vertices.slice(1,-1)
    var verts = []
    for (var i=1; i<segs.length-1; i++) {
      var b = segs[i-1][1].slice(-2)
      var c = segs[i][1].slice(0,2)
      if (segs[i-1].length > 2) {
        var a = segs[i-1][1].slice(-4,-2)
        var t = 0.5 * (Curves.lineAngle(a,b) + Curves.lineAngle(b,c))
      } else {
        var t = Curves.lineAngle(b,c)
      }
      verts.push(
        {point: b, angle: t}
      )
      var id = segs[i][2]
      if (id != null) {
        i++
        while (segs[i] && segs[i][2] == id) i++
        i--
      }
    }
    return verts
  },

  getSegments : function() {
    if (typeof(this.segments) == 'string') {
      if (!this.compiled || this.segments != this.compiledSegments) {
        this.compiled = this.compileSVGPath(this.segments)
        this.compiledSegments = this.segments
      }
    } else if (!this.compiled) {
      this.compiled = Object.clone(this.segments)
    }
    return this.compiled
  },

  /**
    Compiles an SVG path string into an array of canvas context method calls.

    Returns an array of [methodName, [arg1, arg2, ...]] method call arrays.
    */
  compileSVGPath : function(svgPath) {
    var segs = svgPath.split(/(?=[a-z])/i)
    var x = 0
    var y = 0
    var px,py
    var pc
    var commands = []
    for (var i=0; i<segs.length; i++) {
      var seg = segs[i]
      var cmd = seg.match(/[a-z]/i)
      if (!cmd) return [];
      cmd = cmd[0];
      var coords = seg.match(/[+-]?\d+(\.\d+(e\d+(\.\d+)?)?)?/gi)
      if (coords) coords = coords.map(parseFloat)
      switch(cmd) {
        case 'M':
          x = coords[0]
          y = coords[1]
          px = py = null
          commands.push(['moveTo', [x, y]])
          break
        case 'm':
          x += coords[0]
          y += coords[1]
          px = py = null
          commands.push(['moveTo', [x, y]])
          break

        case 'L':
          x = coords[0]
          y = coords[1]
          px = py = null
          commands.push(['lineTo', [x, y]])
          break
        case 'l':
          x += coords[0]
          y += coords[1]
          px = py = null
          commands.push(['lineTo', [x, y]])
          break
        case 'H':
          x = coords[0]
          px = py = null
          commands.push(['lineTo', [x, y]])
          break
        case 'h':
          x += coords[0]
          px = py = null
          commands.push(['lineTo', [x,y]])
          break
        case 'V':
          y = coords[0]
          px = py = null
          commands.push(['lineTo', [x,y]])
          break
        case 'v':
          y += coords[0]
          px = py = null
          commands.push(['lineTo', [x,y]])
          break

        case 'C':
          x = coords[4]
          y = coords[5]
          px = coords[2]
          py = coords[3]
          commands.push(['bezierCurveTo', coords])
          break
        case 'c':
          commands.push(['bezierCurveTo',[
            coords[0] + x, coords[1] + y,
            coords[2] + x, coords[3] + y,
            coords[4] + x, coords[5] + y
          ]])
          px = x + coords[2]
          py = y + coords[3]
          x += coords[4]
          y += coords[5]
          break

        case 'S':
          if (px == null || !pc.match(/[sc]/i)) {
            px = x
            py = y
          }
          commands.push(['bezierCurveTo',[
            x-(px-x), y-(py-y),
            coords[0], coords[1],
            coords[2], coords[3]
          ]])
          px = coords[0]
          py = coords[1]
          x = coords[2]
          y = coords[3]
          break
        case 's':
          if (px == null || !pc.match(/[sc]/i)) {
            px = x
            py = y
          }
          commands.push(['bezierCurveTo',[
            x-(px-x), y-(py-y),
            x + coords[0], y + coords[1],
            x + coords[2], y + coords[3]
          ]])
          px = x + coords[0]
          py = y + coords[1]
          x += coords[2]
          y += coords[3]
          break

        case 'Q':
          px = coords[0]
          py = coords[1]
          x = coords[2]
          y = coords[3]
          commands.push(['quadraticCurveTo', coords])
          break
        case 'q':
          commands.push(['quadraticCurveTo',[
            coords[0] + x, coords[1] + y,
            coords[2] + x, coords[3] + y
          ]])
          px = x + coords[0]
          py = y + coords[1]
          x += coords[2]
          y += coords[3]
          break

        case 'T':
          if (px == null || !pc.match(/[qt]/i)) {
            px = x
            py = y
          } else {
            px = x-(px-x)
            py = y-(py-y)
          }
          commands.push(['quadraticCurveTo',[
            px, py,
            coords[0], coords[1]
          ]])
          px = x-(px-x)
          py = y-(py-y)
          x = coords[0]
          y = coords[1]
          break
        case 't':
          if (px == null || !pc.match(/[qt]/i)) {
            px = x
            py = y
          } else {
            px = x-(px-x)
            py = y-(py-y)
          }
          commands.push(['quadraticCurveTo',[
            px, py,
            x + coords[0], y + coords[1]
          ]])
          x += coords[0]
          y += coords[1]
          break

        case 'A':
          var arc_segs = this.solveArc(x,y, coords)
          for (var l=0; l<arc_segs.length; l++) arc_segs[l][2] = i
          commands.push.apply(commands, arc_segs)
          x = coords[5]
          y = coords[6]
          break
        case 'a':
          coords[5] += x
          coords[6] += y
          var arc_segs = this.solveArc(x,y, coords)
          for (var l=0; l<arc_segs.length; l++) arc_segs[l][2] = i
          commands.push.apply(commands, arc_segs)
          x = coords[5]
          y = coords[6]
          break

        case 'Z':
          commands.push(['closePath', []])
          break
        case 'z':
          commands.push(['closePath', []])
          break
      }
      pc = cmd
    }
    return commands
  },

  solveArc : function(x, y, coords) {
    var rx = coords[0]
    var ry = coords[1]
    var rot = coords[2]
    var large = coords[3]
    var sweep = coords[4]
    var ex = coords[5]
    var ey = coords[6]
    var segs = this.arcToSegments(ex, ey, rx, ry, large, sweep, rot, x, y)
    var retval = []
    for (var i=0; i<segs.length; i++) {
      retval.push(['bezierCurveTo', this.segmentToBezier.apply(this, segs[i])])
    }
    return retval
  },


  // Copied from Inkscape svgtopdf, thanks!
  arcToSegments : function(x, y, rx, ry, large, sweep, rotateX, ox, oy) {
    var th = rotateX * (Math.PI/180)
    var sin_th = Math.sin(th)
    var cos_th = Math.cos(th)
    rx = Math.abs(rx)
    ry = Math.abs(ry)
    var px = cos_th * (ox - x) * 0.5 + sin_th * (oy - y) * 0.5
    var py = cos_th * (oy - y) * 0.5 - sin_th * (ox - x) * 0.5
    var pl = (px*px) / (rx*rx) + (py*py) / (ry*ry)
    if (pl > 1) {
      pl = Math.sqrt(pl)
      rx *= pl
      ry *= pl
    }

    var a00 = cos_th / rx
    var a01 = sin_th / rx
    var a10 = (-sin_th) / ry
    var a11 = (cos_th) / ry
    var x0 = a00 * ox + a01 * oy
    var y0 = a10 * ox + a11 * oy
    var x1 = a00 * x + a01 * y
    var y1 = a10 * x + a11 * y

    var d = (x1-x0) * (x1-x0) + (y1-y0) * (y1-y0)
    var sfactor_sq = 1 / d - 0.25
    if (sfactor_sq < 0) sfactor_sq = 0
    var sfactor = Math.sqrt(sfactor_sq)
    if (sweep == large) sfactor = -sfactor
    var xc = 0.5 * (x0 + x1) - sfactor * (y1-y0)
    var yc = 0.5 * (y0 + y1) + sfactor * (x1-x0)

    var th0 = Math.atan2(y0-yc, x0-xc)
    var th1 = Math.atan2(y1-yc, x1-xc)

    var th_arc = th1-th0
    if (th_arc < 0 && sweep == 1){
      th_arc += 2*Math.PI
    } else if (th_arc > 0 && sweep == 0) {
      th_arc -= 2 * Math.PI
    }

    var segments = Math.ceil(Math.abs(th_arc / (Math.PI * 0.5 + 0.001)))
    var result = []
    for (var i=0; i<segments; i++) {
      var th2 = th0 + i * th_arc / segments
      var th3 = th0 + (i+1) * th_arc / segments
      result[i] = [xc, yc, th2, th3, rx, ry, sin_th, cos_th]
    }

    return result
  },

  segmentToBezier : function(cx, cy, th0, th1, rx, ry, sin_th, cos_th) {
    var a00 = cos_th * rx
    var a01 = -sin_th * ry
    var a10 = sin_th * rx
    var a11 = cos_th * ry

    var th_half = 0.5 * (th1 - th0)
    var t = (8/3) * Math.sin(th_half * 0.5) * Math.sin(th_half * 0.5) / Math.sin(th_half)
    var x1 = cx + Math.cos(th0) - t * Math.sin(th0)
    var y1 = cy + Math.sin(th0) + t * Math.cos(th0)
    var x3 = cx + Math.cos(th1)
    var y3 = cy + Math.sin(th1)
    var x2 = x3 + t * Math.sin(th1)
    var y2 = y3 - t * Math.cos(th1)
    return [
      a00 * x1 + a01 * y1,      a10 * x1 + a11 * y1,
      a00 * x2 + a01 * y2,      a10 * x2 + a11 * y2,
      a00 * x3 + a01 * y3,      a10 * x3 + a11 * y3
    ]
  },

  getLength : function() {
    var segs = this.getSegments()
    if (segs.arcLength == null) {
      segs.arcLength = 0
      var x=0, y=0
      for (var i=0; i<segs.length; i++) {
        var args = segs[i][1]
        if (args.length < 2) continue
        switch(segs[i][0]) {
          case 'bezierCurveTo':
            segs[i][3] = Curves.cubicLength(
              [x, y], [args[0], args[1]], [args[2], args[3]], [args[4], args[5]])
            break
          case 'quadraticCurveTo':
            segs[i][3] = Curves.quadraticLength(
              [x, y], [args[0], args[1]], [args[2], args[3]])
            break
          case 'lineTo':
            segs[i][3] = Curves.lineLength(
              [x, y], [args[0], args[1]])
            break
        }
        if (segs[i][3])
          segs.arcLength += segs[i][3]
        x = args[args.length-2]
        y = args[args.length-1]
      }
    }
    return segs.arcLength
  },

  pointAngleAt : function(t, config) {
    var segments = []
    var segs = this.getSegments()
    var length = this.getLength()
    var x = 0, y = 0
    for (var i=0; i<segs.length; i++) {
      var seg = segs[i]
      if (seg[1].length < 2) continue
      if (seg[0] != 'moveTo') {
        segments.push([x, y, seg])
      }
      x = seg[1][seg[1].length-2]
      y = seg[1][seg[1].length-1]
    }
    if (segments.length < 1)
      return {point: [x, y], angle: 0 }
    if (t >= 1) {
      var rt = 1
      var seg = segments[segments.length-1]
    } else if (config && config.discrete) {
      var idx = Math.floor(t * segments.length)
      var seg = segments[idx]
      var rt = 0
    } else if (config && config.linear) {
      var idx = t * segments.length
      var rt = idx - Math.floor(idx)
      var seg = segments[Math.floor(idx)]
    } else {
      var len = t * length
      var rlen = 0, idx, rt
      for (var i=0; i<segments.length; i++) {
        if (rlen + segments[i][2][3] > len) {
          idx = i
          rt = (len - rlen) / segments[i][2][3]
          break
        }
        rlen += segments[i][2][3]
      }
      var seg = segments[idx]
    }
    var angle = 0
    var cmd = seg[2][0]
    var args = seg[2][1]
    switch (cmd) {
      case 'bezierCurveTo':
        return Curves.cubicLengthPointAngle([seg[0], seg[1]], [args[0], args[1]], [args[2], args[3]], [args[4], args[5]], rt)
        break
      case 'quadraticCurveTo':
        return Curves.quadraticLengthPointAngle([seg[0], seg[1]], [args[0], args[1]], [args[2], args[3]], rt)
        break
      case 'lineTo':
        x = Curves.linearValue(seg[0], args[0], rt)
        y = Curves.linearValue(seg[1], args[1], rt)
        angle = Curves.lineAngle([seg[0], seg[1]], [args[0], args[1]], rt)
        break
    }
    return {point: [x, y], angle: angle }
  }

})


/**
  ImageNode is used for drawing images. Creates a rectangular path around
  the drawn image.

  Attributes:

    centered - If true, image center is at the origin.
               Otherwise image top-left is at the origin.
    usePattern - Use a pattern fill for drawing the image (instead of
                 drawImage.) Doesn't do sub-image drawing, and Safari doesn't
                 like scaled image patterns.
    sX, sY, sWidth, sHeight - Area of image to draw. Optional.
    dX, dY - Coordinates where to draw the image. Default is 0, 0.
    dWidth, dHeight - Size of the drawn image. Optional.

  Example:

    var img = new Image()
    img.src = 'foo.jpg'
    var imageGeo = new ImageNode(img)

  @param image Image to draw.
  @param config Optional config hash.
  */
ImageNode = Klass(Drawable, {
  centered : false,
  usePattern : false,

  sX : 0,
  sY : 0,
  sWidth : null,
  sHeight : null,

  dX : 0,
  dY : 0,
  dWidth : null,
  dHeight : null,

  initialize : function(image, config) {
    this.image = image
    Drawable.initialize.call(this, config)
  },

  /**
    Draws the image on the given drawing context.

    Creates a rectangular path around the drawn image (for possible stroke
    and/or fill.)

    @param ctx Canvas drawing context.
    */
  drawGeometry : function(ctx) {
    if (Object.isImageLoaded(this.image)) {
      var w = this.dWidth == null ? this.image.width : this.dWidth
      var h = this.dHeight == null ? this.image.height : this.dHeight
      var x = this.dX + (this.centered ? -w * 0.5 : 0)
      var y = this.dY + (this.centered ? -h * 0.5 : 0)
      if (this.dWidth != null) {
        if (this.sWidth != null) {
          ctx.drawImage(this.image,
            this.sX, this.sY, this.sWidth, this.sHeight,
            x, y, w, h)
        } else {
          ctx.drawImage(this.image, x, y, w, h)
        }
      } else {
        w = this.image.width
        h = this.image.height
        if (this.usePattern) {
          if (!this.imagePattern)
            this.imagePattern = new Pattern(this.image, 'repeat')
          var fs = this.imagePattern.compiled
          if (!fs)
            fs = this.imagePattern.compile(ctx)
          ctx.save()
          ctx.beginPath()
          ctx.rect(x, y, w, h)
          ctx.setFillStyle(fs)
          ctx.fill()
          ctx.restore()
          ctx.beginPath()
        } else {
          ctx.drawImage(this.image, x, y)
        }
      }
    } else {
      var w = this.dWidth
      var h = this.dHeight
      if (!( w && h )) return
      var x = this.dX + (this.centered ? -w * 0.5 : 0)
      var y = this.dY + (this.centered ? -h * 0.5 : 0)
    }
    ctx.rect(x, y, w, h)
  },

  /**
    Creates a bounding rectangle path for the image on the given drawing
    context.

    @param ctx Canvas drawing context.
    */
  drawPickingPath : function(ctx) {
    var x = this.dX + (this.centered ? -this.image.width * 0.5 : 0)
    var y = this.dY + (this.centered ? -this.image.height * 0.5 : 0)
    var w = this.dWidth
    var h = this.dHeight
    if (this.dWidth == null) {
      w = this.image.width
      h = this.image.height
    }
    ctx.rect(x, y, w, h)
  },

  /**
    Returns true if the point x,y is inside the image rectangle.

    The x,y point is in user-space coordinates, meaning that e.g. the point
    5,5 will always be inside the rectangle [0, 0, 10, 10], regardless of the
    transform on the rectangle.

    @param x X-coordinate of the point.
    @param y Y-coordinate of the point.
    @return Whether the point is inside the image rectangle.
    @type boolean
    */
  isPointInPath : function(x,y) {
    x -= this.dX
    y -= this.dY
    if (this.centered) {
      x += this.image.width * 0.5
      y += this.image.height * 0.5
    }
    var w = this.dWidth
    var h = this.dHeight
    if (this.dWidth == null) {
      w = this.image.width
      h = this.image.height
    }
    return ((x >= 0) && (x <= w) && (y >= 0) && (y <= h))
  },

  getBoundingBox : function() {
    x = this.dX
    y = this.dY
    if (this.centered) {
      x -= this.image.width * 0.5
      y -= this.image.height * 0.5
    }
    var w = this.dWidth
    var h = this.dHeight
    if (this.dWidth == null) {
      w = this.image.width
      h = this.image.height
    }
    return [x, y, w, h]
  }
})

ImageNode.load = function(src) {
  var img = new Image();
  img.src = src;
  var imgn = new ImageNode(img);
  return imgn;
}


/**
  TextNode is used for drawing text on a canvas.

  Attributes:

    text - The text string to draw.
    align - Horizontal alignment for the text.
            'left', 'right', 'center', 'start' or 'end'
    baseline - Baseline used for the text.
               'top', 'hanging', 'middle', 'alphabetic', 'ideographic' or 'bottom'
    asPath - If true, creates a text path instead of drawing the text.
    pathGeometry - A geometry object the path of which the text follows.

  Example:

    var text = new TextGeometry('The cake is a lie.')

  @param text The text string to draw.
  @param config Optional config hash.
  */
TextNode = Klass(Drawable, {
  text : 'Text',
  align : 'start', // 'left' | 'right' | 'center' | 'start' | 'end'
  baseline : 'alphabetic', // 'top' | 'hanging' | 'middle' | 'alphabetic' |
                           // 'ideographic' | 'bottom'
  accuratePicking : false,
  asPath : false,
  pathGeometry : null,
  maxWidth : null,
  width : 0,
  height : 20,
  cx : 0,
  cy : 0,

  __drawMethodName : 'draw' + CanvasSupport.getTextBackend(),
  __pickingMethodName : 'drawPickingPath' + CanvasSupport.getTextBackend(),

  initialize : function(text, config) {
    this.lastText = this.text
    this.text = text
    Drawable.initialize.call(this, config)
  },

  drawGeometry : function(ctx) {
    this.drawUsing(ctx, this.__drawMethodName)
  },

  drawPickingPath : function(ctx) {
    this.drawUsing(ctx, this.__pickingMethodName)
  },

  drawUsing : function(ctx, methodName) {
    if (!this.text || this.text.length == 0)
      return
    if (this.lastText != this.text || this.lastStyle != ctx.font) {
      this.dimensions = this.measureText(ctx)
      this.lastText = this.text
      this.lastStyle = ctx.font
    }
    if (this[methodName])
      this[methodName](ctx)
  },

  measureText : function(ctx) {
    var mn = 'measureText' + CanvasSupport.getTextBackend().capitalize()
    if (this[mn]) {
      return this[mn](ctx)
    } else {
      return {width: 0, height: 0}
    }
  },

  computeXForAlign : function() {
    if (this.align == 'left') // most hit branch
      return 0
    else if (this.align == 'right')
      return -this.dimensions.width
    else if (this.align == 'center')
      return  -this.dimensions.width * 0.5
  },

  measureTextHTML5 : function(ctx) {
    // FIXME measureText is retarded
    return {width: ctx.measureText(this.text).width, height: 20}
  },

  drawHTML5 : function(ctx) {
    ctx.fillText(this.text, this.cx, this.cy, this.maxWidth)
  },

  drawPickingPathHTML5 : function(ctx) {
    var ascender = 15 // this.dimensions.ascender
    var ry = this.cy - ascender
    ctx.rect(this.cx, ry, this.dimensions.width, this.dimensions.height)
  },

  measureTextMozText : function(ctx) {
    return {width: ctx.mozMeasureText(this.text), height: 20}
  },

  drawMozText : function(ctx) {
    var x = this.cx + this.computeXForAlign()
    var y = this.cy + 0
    if (this.pathGeometry) {
      this.pathGeometry.draw(ctx)
      ctx.mozDrawTextAlongPath(this.text, this.path)
    } else {
      ctx.save()
      ctx.translate(x,y)
      if (this.asPath) {
        ctx.mozPathText(this.text)
      } else {
        ctx.mozDrawText(this.text)
      }
      ctx.restore()
    }
  },

  drawPickingPathMozText : function(ctx) {
    var x = this.cx + this.computeXForAlign()
    var y = this.cy + 0
    if (this.pathGeometry) { // FIXME how to draw a text path along path?
        this.pathGeometry.draw(ctx)
        // ctx.mozDrawTextAlongPath(this.text, this.path)
    } else if (!this.accuratePicking) {
      var ascender = 15 // this.dimensions.ascender
      var ry = y - ascender
      ctx.rect(x, ry, this.dimensions.width, this.dimensions.height)
    } else {
      ctx.save()
      ctx.translate(x,y)
      ctx.mozPathText(this.text)
      ctx.restore()
    }
  },

  drawDrawString : function(ctx) {
    var x = this.cx + this.computeXForAlign()
    var y = this.cy + 0
    ctx.drawString(x,y, this.text)
  },

  measureTextPerfectWorld : function(ctx) {
    return ctx.measureText(this.text)
  },

  drawPerfectWorld : function(ctx) {
    if (this.pathGeometry) {
      this.pathGeometry.draw(ctx)
      if (this.asPath)
        ctx.pathTextAlongPath(this.text)
      else
        ctx.drawTextAlongPath(this.text)
    } else if (this.asPath) {
      ctx.pathText(this.text)
    } else {
      ctx.drawText(this.text)
    }
  },

  drawPickingPathPerfectWorld : function(ctx) {
    if (this.accuratePicking) {
      if (this.pathGeometry) {
        ctx.pathTextAlongPath(this.text)
      } else {
        ctx.pathText(this.text)
      }
    } else { // creates a path of text bounding box
      if (this.pathGeometry) {
        ctx.textRectAlongPath(this.text)
      } else {
        ctx.textRect(this.text)
      }
    }
  }
})


/**
  Gradient is a linear or radial color gradient that can be used as a
  strokeStyle or fillStyle.

  Attributes:

    type - Type of the gradient. 'linear' or 'radial'
    startX, startY - Coordinates for the starting point of the gradient.
                     Center of the starting circle of a radial gradient.
                     Default is 0, 0.
    endX, endY - Coordinates for the ending point of the gradient.
                 Center of the ending circle of a radial gradient.
                 Default is 0, 0.
    startRadius - The radius of the starting circle of a radial gradient.
                  Default is 0.
    endRadius - The radius of the ending circle of a radial gradient.
                Default is 100.
    colorStops - The color stops for the gradient. The format for the color
                 stops is: [[position_1, color_1], [position_2, color_2], ...].
                 The possible color formats are: 'red', '#000', '#000000',
                 'rgba(0,0,0, 0.2)', [0,0,0] and [0,0,0, 0.2].
                 Default color stops are [[0, '#000000'], [1, '#FFFFFF']].

  Example:

    var g = new Gradient({
      type : 'radial',
      endRadius : 40,
      colorStops : [
        [0, '#000'],
        [0.2, '#ffffff'],
        [0.5, [255, 0, 0]],
        [0.8, [0, 255, 255, 0.5]],
        [1.0, 'rgba(255, 0, 255, 0.8)']
      ]
    })

  @param config Optional config hash.
  */
Gradient = Klass({
  type : 'linear',
  isPattern : true,
  startX : 0,
  startY : 0,
  endX : 1,
  endY : 0,
  startRadius : 0,
  endRadius : 1,
  colorStops : [],

  initialize : function(config) {
    this.colorStops = [[0, '#000000'], [1, '#FFFFFF']]
    if (config) Object.extend(this, config)
  },

  /**
    Compiles the gradient using the given drawing context.
    Returns a gradient object that can be used as drawing context
    fill/strokeStyle.

    @param ctx Drawing context to compile pattern on.
    @return Gradient object.
    */
  compile : function(ctx) {
    if (this.type == 'linear') {
      var go = ctx.createLinearGradient(
                    this.startX, this.startY,
                    this.endX, this.endY)
    } else {
      var go = ctx.createRadialGradient(
                    this.startX, this.startY, this.startRadius,
                    this.endX, this.endY, this.endRadius)
    }
    for(var i=0; i<this.colorStops.length; i++) {
      var cs = this.colorStops[i]
      if (typeof(cs[1]) == 'string') {
        go.addColorStop(cs[0], cs[1])
      } else {
        var ca = cs[1]
        var a = (ca.length == 3) ? 1 : ca[3]
        var g = 'rgba('+ca.slice(0,3).map(Math.round).join(",")+', '+a+')'
        go.addColorStop(cs[0], g)
      }
    }
    Object.extend(go, Transformable.prototype)
    go.transformList = this.transformList
    go.scale = this.scale
    go.x = this.x
    go.y = this.y
    go.matrix = this.matrix
    go.rotation = this.rotation
    go.units = this.units
    if (!go.isMockObject)
      this.compiled = go
    return go
  }
})


/**
  Pattern is a possibly repeating image that can be used as a strokeStyle or
  fillStyle.

    var image = new Image()
    image.src = 'foo.jpg'
    var pattern = new Pattern(image, 'no-repeat')
    var rect = new Rectangle(200, 200, {fill: true, fillStyle: pattern})

  @param image The image object for the pattern. IMG and CANVAS elements, and
               Image objects all work.
  @param repeat The repeat mode of the pattern. One of 'repeat', 'repeat-y',
                'repeat-x' and 'no-repeat'. The default is 'repeat'.
  */
Pattern = Klass({
  isPattern : true,
  repeat: 'repeat',

  initialize : function(image, repeat) {
    this.image = image
    if (repeat)
      this.repeat = repeat
  },

  /**
    Compiles the pattern using the given drawing context.
    Returns a pattern object that can be used as drawing context
    fill/strokeStyle.

    @param ctx Drawing context to compile pattern on.
    @return Pattern object.
    */
  compile : function(ctx) {
    var pat = ctx.createPattern(this.image, this.repeat)
    Object.extend(pat, Transformable.prototype)
    pat.transformList = this.transformList
    pat.scale = this.scale
    pat.x = this.x
    pat.y = this.y
    pat.matrix = this.matrix
    pat.rotation = this.rotation
    pat.units = this.units
    if (!pat.isMockObject)
      this.compiled = pat
    return pat
  }
})












/**
  SVG parser for simple documents. Converts SVG DOM to CAKE scenegraph.
  Emphasis on graphical images, not on the "HTML-killer" features of SVG.

  var svgNode = SVGParser.parse(
    svgRootElement, filename, containerWidth, containerHeight, fontSize
  )

  Features:
    * <svg> width and height, viewBox clipping.
    * Clipping (objectBoundingBox clipping too)
    * Paths, rectangles, ellipses, circles, lines, polylines and polygons
    * Simple untransformed text using HTML
    * Nested transforms
    * Transform lists (transform="rotate(30) translate(2,2) scale(4)")
    * Gradient and pattern transforms
    * Strokes with miter, joins and caps
    * Flat fills and gradient fills, ditto for strokes
    * Parsing simple stylesheets (tag, class or id)
    * Images
    * Non-pixel units (cm, mm, in, pt, pc, em, ex, %)
    * <use>-tags
    * preserveAspectRatio
    * Dynamic gradient sizes (objectBoundingBox, etc.)
    * Markers (though buggy)

  Some of the several missing features:
    * Masks
    * Patterns
    * viewBox clipping for elements other than <marker> and <svg>
    * Text styling
    * tspan, tref, textPath, many things text
    * Fancy style rules (tag .class + #foo > bob#alice { ... })
    * Filters
    * Animation
    * Dashed strokes
  */
SVGParser = {
  /**
    Loads an SVG document using XMLHttpRequest and calls the given onSuccess
    callback with the parsed document. If loading fails, calls onFailure
    instead if one is given. When loading and an onLoading callback is given,
    calls onLoading every time xhr.readyState is 3.

    The callbacks will be called with the following parameters:

    onSuccess(svgNode, xmlHttpRequest,
      filename, config)

    onFailure(xmlHttpRequest, possibleException,
      filename, config)

    onLoading(xmlHttpRequest,
      filename, config)

    Config hash parameters:
      filename: Filename for the SVG document. Used for parsing image paths.
      width: Width of the bounding box to fit the SVG in.
      height: Height of the bounding box to fit the SVG in.
      fontSize: Default font size for the SVG document.
      onSuccess: Function to call on successful load. Required.
      onFailure: Function to call on failed load.
      onLoading: Function to call while loading.

    @param config The config hash.
    @param filename The URL of the SVG document to load. Must conform to SOP.
    */
  load : function(filename, config) {
    if (!config.onSuccess) throw("Need to provide an onSuccess function.")
    if (!config.filename)
      config.filename = filename
    var xhr = window.XMLHttpRequest ? new XMLHttpRequest() :
                                      new ActiveXObject("MSXML2.XMLHTTP.3.0")
    xhr.open('GET', filename, true)
    xhr.overrideMimeType('text/xml')
    var failureFired = false
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        if (xhr.status == 200 || xhr.status == 0) {
          try {
            var svg = xhr.responseXML
            var svgNode = SVGParser.parse(svg, config)
            svgNode.svgRootElement = svg
          } catch(e) {
            if (config.onFailure)
              config.onFailure(xhr, e, filename, config)
            return
          }
          config.onSuccess(svgNode, xhr, filename, config)
        } else {
          if (config.onFailure && !failureFired)
            config.onFailure(xhr, null, filename, config)
        }
      } else if (xhr.readyState == 3) {
        if (config.onLoading)
          config.onLoading(xhr, filename, config)
      }
    }
    try {
      xhr.send(null)
    } catch(e) {
      if (config.onFailure) {
        config.onFailure(xhr, e, filename, config)
        failureFired = true
      }
      xhr.abort()
    }
  },

  /**
    Parses an SVG DOM into CAKE scenegraph.

    Config hash parameters:
      filename: Filename for the SVG document. Used for parsing image paths.
      width: Width of the bounding box to fit the SVG in.
      height: Height of the bounding box to fit the SVG in.
      fontSize: Default font size for the SVG document.
      currentColor: HTML text color of the containing element.

    @param svgRootElement The root element of the SVG DOM.
    @param config The config hash.
    @returns The root CanvasNode of the scenegraph created from the SVG document.
    @type CanvasNode
    */
  parse : function(svgRootElement, config) {
    var n = new CanvasNode()
    var w = config.width, h = config.height, fs = config.fontSize
    n.innerWidth = w || window.innerWidth
    n.innerHeight = h || window.innerHeight
    n.innerSize = Math.sqrt(w*w + h*h) / Math.sqrt(2)
    n.fontSize = fs || 12
    n.filename = config.filename || '.'
    var defs = {}
    var style = { ids : {}, classes : {}, tags : {} }
    n.color = config.currentColor || 'black'
    this.parseChildren(svgRootElement, n, defs, style)
    n.defs = defs
    n.style = style
    return n
  },

  parsePreserveAspectRatio : function(aspect, w, h, vpw, vph) {
    var aspect = aspect || ""
    var aspa = aspect.split(/\s+/)
    var defer = (aspa[0] == 'defer')
    if (defer) aspa.shift()
    var align = (aspa[0] || 'xMidYMid')
    var meet = (aspa[1] || 'meet')
    var wf = w / vpw
    var hf = h / vph
    var xywh = {x:0, y:0, w:wf, h:hf}
    if (align == 'none') return xywh
    xywh.w = xywh.h = (meet == 'meet' ? Math.min : Math.max)(wf, hf)
    var xa = align.slice(1, 4).toLowerCase()
    var ya = align.slice(5, 8).toLowerCase()
    var xf = (this.SVGAlignMap[xa] || 0)
    var yf = (this.SVGAlignMap[ya] || 0)
    xywh.x = xf * (w-vpw*xywh.w)
    xywh.y = yf * (h-vph*xywh.h)
    return xywh
  },

  SVGAlignMap : {
    min : 0,
    mid : 0.5,
    max : 1
  },

  SVGTagMapping : {
    svg : function(c, cn, defs, style) {
      var p = new Rectangle()
      p.width = 0
      p.height = 0
      p.doFill = function(){}
      p.doStroke = function(){}
      p.drawMarkers = function(){}
      p.fill = 'black'
      p.stroke = 'none'
      var vb = c.getAttribute('viewBox')
      var w = c.getAttribute('width')
      var h = c.getAttribute('height')
      if (!w) w = h
      else if (!h) h = w
      if (w) {
        var wpx = this.parseUnit(w, cn, 'x')
        var hpx = this.parseUnit(h, cn, 'y')
      }
      if (vb) {
        xywh = vb.match(/[-+]?\d+/g).map(parseFloat)
        p.cx = xywh[0]
        p.cy = xywh[1]
        p.width = xywh[2]
        p.height = xywh[3]
        var iw = cn.innerWidth = p.width
        var ih = cn.innerHeight = p.height
        cn.innerSize = Math.sqrt(iw*iw + ih*ih) / Math.sqrt(2)
        if (c.getAttribute('overflow') != 'visible')
          p.clip = true
      }
      if (w) {
        if (vb) { // nuts, let's parse the alignment :|
          var aspect = c.getAttribute('preserveAspectRatio')
          var align = this.parsePreserveAspectRatio(aspect,
            wpx, hpx,
            p.width, p.height)
          p.cx -= align.x / align.w
          p.cy -= align.y / align.h
          p.width = wpx / align.w
          p.height = hpx / align.h
          p.x += align.x
          p.y += align.y
          p.scale = [align.w, align.h]
        }
        // wrong place!
        cn.docWidth = wpx
        cn.docHeight = hpx
      }
      return p
    },

    marker : function(c, cn) {
      var p = new CanvasNode()
      p.draw = function(ctx) {
        if (this.overflow != 'hidden' && this.viewBox) return
        ctx.beginPath()
        ctx.rect(
          this.viewBox[0],this.viewBox[1],
          this.viewBox[2],this.viewBox[3]
        )
        ctx.clip()
      }
      var x = -this.parseUnit(c.getAttribute('refX'), cn, 'x') || 0
      var y = -this.parseUnit(c.getAttribute('refY'), cn, 'y') || 0
      p.transformList = [['translate', [x,y]]]
      p.markerUnits = c.getAttribute('markerUnits') || 'strokeWidth'
      p.markerWidth = this.parseUnit(c.getAttribute('markerWidth'), cn, 'x') || 3
      p.markerHeight = this.parseUnit(
                          c.getAttribute('markerHeight'), cn, 'y') ||
                          3
      p.overflow = c.getAttribute('overflow') || 'hidden'
      p.viewBox = c.getAttribute('viewBox')
      p.orient = c.getAttribute('orient') || 0
      if (p.orient && p.orient != 'auto')
        p.orient = parseFloat(p.orient)*SVGMapping.DEG_TO_RAD_FACTOR
      if (p.viewBox) {
        p.viewBox = p.viewBox.strip().split(/[\s,]+/g).map(parseFloat)
        var vbw = p.viewBox[2] - p.viewBox[0]
        var vbh = p.viewBox[3] - p.viewBox[1]
        if (p.markerWidth) {
          var sx = sy = Math.min(
            p.markerWidth / vbw,
            p.markerHeight / vbh
          )
          p.transformList.unshift(['scale', [sx,sy]])
        }
      }
      return p
    },

    clipPath : function(c,cn) {
      var p = new CanvasNode()
      p.units = c.getAttribute('clipPathUnits')
      return p
    },

    title : function(c, canvasNode) {
      canvasNode.root.title = c.textContent
    },

    desc : function(c,cn) {
      cn.root.description = c.textContent
    },

    metadata : function(c, cn) {
      cn.root.metadata = c
    },








    parseAnimateTag : function(c, cn) {
      var after = SVGParser.SVGTagMapping.parseTime(c.getAttribute('begin'))
      var dur = SVGParser.SVGTagMapping.parseTime(c.getAttribute('dur'))
      var end = SVGParser.SVGTagMapping.parseTime(c.getAttribute('end'))
      if (dur == null) dur = end-after
      dur = isNaN(dur) ? 0 : dur
      var variable = c.getAttribute('attributeName')
      var fill = c.getAttribute('fill')
      if (cn.tagName == 'rect') {
        if (variable == 'x') variable = 'cx'
        if (variable == 'y') variable = 'cy'
      }
      var accum = c.getAttribute('accumulate') == 'sum'
      var additive = c.getAttribute('additive')
      if (additive) additive = additive == 'sum'
      else additive = accum
      var repeat = c.getAttribute('repeatCount')
      if (repeat == 'indefinite') repeat = true
      else repeat = parseFloat(repeat)
      if (!repeat && dur > 0) {
        var repeatDur = c.getAttribute('repeatDur')
        if (repeatDur == 'indefinite') repeat = true
        else repeat = SVGParser.SVGTagMapping.parseTime(repeatDur) / dur
      }
      return {
        after: isNaN(after) ? 0 : after,
        duration: dur,
        restart: c.getAttribute('restart'),
        calcMode : c.getAttribute('calcMode'),
        additive : additive,
        accumulate : accum,
        repeat : repeat,
        variable: variable,
        fill: fill
      }
    },

    parseTime : function(value) {
      if (!value) return null
      if (value.match(/[0-9]$/)) {
        var hms = value.split(":")
        var s = hms[hms.length-1] || 0
        var m = hms[hms.length-2] || 0
        var h = hms[hms.length-3] || 0
        return (parseFloat(h)*3600 + parseFloat(m)*60 + parseFloat(s)) * 1000
      } else {
        var fac = 60
        if (value.match(/s$/i)) fac = 1
        else if (value.match(/h$/i)) fac = 3600
        return parseFloat(value) * fac * 1000
      }
    },






    animate : function(c, cn) {
      var from = this.parseUnit(c.getAttribute('from'), cn, 'x')
      var to = this.parseUnit(c.getAttribute('to'), cn, 'x')
      var by = this.parseUnit(c.getAttribute('by'), cn, 'x')
      var o = SVGParser.SVGTagMapping.parseAnimateTag(c, cn)
      if (c.getAttribute('values')) {
        var self = this
        var vals = c.getAttribute('values')
        vals = vals.split(";").map(function(v) {
          var xy = v.split(/[, ]+/)
          if (xy.length > 2) {
            return xy.map(function(x){ return self.parseUnit(x, cn, 'x') })
          } else if (xy.length > 1) {
            return [
              self.parseUnit(xy[0], cn, 'x'),
              self.parseUnit(xy[1], cn, 'y')
            ]
          } else {
            return self.parseUnit(v, cn, 'x')
          }
        })
      } else {
        if (to == null) to = from + by
      }
      cn.after(o.after, function() {
        if (o.fill == 'remove') {
          var orig = Object.clone(this[o.variable])
          this.after(o.duration, function(){ this[o.variable] = orig })
        }
        if (vals) {
          if (o.additive) {
            var ov = this[o.variable]
            vals = vals.map(function(v){
              return Object.sum(v, ov)
            })
          }
          var length = 0
          var lens = []
          if (vals[0] instanceof Array) {
            for (var i=1; i<vals.length; i++) {
              var diff = Object.sub(vals[i] - vals[i-1])
              var sl = Math.sqrt(diff.reduce(function(s, i) { return s + i*i }, 0))
              lens.push(sl)
              length += sl
            }
          } else {
            for (var i=1; i<vals.length; i++) {
              var sl = Math.abs(vals[i] - vals[i-1])
              lens.push(sl)
              length += sl
            }
          }
          var animator = function(pos) {
            if (pos == 1) {
              this[o.variable] = vals[vals.length-1]
            } else {
              if (o.calcMode == 'paced') {
                var len = pos * length
                var rlen = 0, idx, rt
                for (var i=0; i<lens.length; i++) {
                  if (rlen + lens[i] > len) {
                    idx = i
                    rt = (len - rlen) / lens[i]
                    break
                  }
                  rlen += lens[i]
                }
                var v0 = idx
                var v1 = v0 + 1
              } else {
                var idx = pos * (vals.length-1)
                var v0 = Math.floor(idx)
                var rt = idx - v0
                var v1 = v0 + 1
              }
              this.tweenVariable(o.variable, vals[v0], vals[v1], rt, o.calcMode)
            }
          }
          this.animate(animator, from, to, o.duration, 'linear', {
            repeat: o.repeat,
            additive: o.additive,
            accumulate: o.accumulate
          })
        } else {
          if (from == null) {
            from = this[o.variable]
            if (by != null) to = from + by
          }
          if (o.additive) {
            from = Object.sum(from, this[o.variable])
            to = Object.sum(to, this[o.variable])
          }
          this.animate(o.variable, from, to, o.duration, o.calcMode, {
            repeat: o.repeat,
            additive: o.additive,
            accumulate: o.accumulate
          })
        }
      })
    },

    set : function(c, cn) {
      var to = c.getAttribute('to')
      var o = SVGParser.SVGTagMapping.parseAnimateTag(c, cn)
      cn.after(o.after, function() {
        if (o.fill == 'remove') {
          var orig = Object.clone(this[o.variable])
          this.after(o.duration, function(){ this[o.variable] = orig })
        }
        this[o.variable] = to
      })
    },

    animateMotion : function(c,cn) {
      var path
      if (c.getAttribute('path')) {
        path = new Path(c.getAttribute('path'))
      } else if (c.getAttribute('values')) {
        var vals = c.getAttribute('values')
        path = new Path("M" + vals.split(";").join("L"))
      } else if (c.getAttribute('from') || c.getAttribute('to') || c.getAttribute('by')) {
        var from = c.getAttribute('from')
        var to = c.getAttribute('to')
        var by = c.getAttribute('by')
        if (!from) from = "0,0"
        if (!to) to = "l" + by
        else to = "L" + to
        path = new Path("M" + from + to)
      }
      var p = new CanvasNode()
      p.__motionPath = path
      var rotate = c.getAttribute('rotate')
      var o = SVGParser.SVGTagMapping.parseAnimateTag(c, cn)
      cn.after(o.after, function() {
        if (o.fill == 'remove') {
          var ox = this.x, oy = this.y
          this.after(o.duration, function(){ this.x = ox; this.y = oy})
        }
        var motion = function(pos) {
          var pa = p.__motionPath.pointAngleAt(pos, {
            discrete: o.calcMode == 'discrete',
            linear : o.calcMode == 'linear'
          })
          this.x = pa.point[0]
          this.y = pa.point[1]
          if (rotate == 'auto') {
            this.rotation = pa.angle
          } else if (rotate == 'auto-reverse') {
            this.rotation = pa.angle + Math.PI
          }
        }
        this.animate(motion, 0, 1, o.duration, 'linear', {
          repeat: o.repeat,
          additive: o.additive,
          accumulate: o.accumulate
        })
      })
      return p
    },

    mpath : function(c,cn, defs) {
      var href = c.getAttribute('xlink:href')
      href = href.replace(/^#/,'')
      this.getDef(defs, href, function(obj) {
        cn.__motionPath = obj
      })
    },

    animateColor : function(c, cn, defs) {
      var from = c.getAttribute('from')
      var to = c.getAttribute('to')
      from = SVGParser.SVGMapping.__parseStyle(from, null, defs)
      to = SVGParser.SVGMapping.__parseStyle(to, null, defs)
      var o = SVGParser.SVGTagMapping.parseAnimateTag(c, cn)
      cn.after(o.after, function() {
        if (o.fill == 'remove') {
          var orig = Object.clone(this[o.variable])
          this.after(o.duration, function(){ this[o.variable] = orig })
        }
        this.animate(o.variable, from, to, o.duration, 'linear', {
          repeat: o.repeat,
          additive: o.additive,
          accumulate: o.accumulate
        })
      })
    },

    animateTransform : function(c, cn) {
      var from = c.getAttribute('from')
      var to = c.getAttribute('to')
      var by = c.getAttribute('by')
      var o = SVGParser.SVGTagMapping.parseAnimateTag(c, cn)
      if (from) from = from.split(/[ ,]+/).map(parseFloat)
      if (to) to = to.split(/[ ,]+/).map(parseFloat)
      if (by) by = by.split(/[ ,]+/).map(parseFloat)
      o.variable = c.getAttribute('type')
      if (o.variable == 'rotate') {
        o.variable = 'rotation'
        if (from) from = from.map(function(v) { return v * Math.PI/180 })
        if (to) to = to.map(function(v) { return v * Math.PI/180 })
        if (by) by = by.map(function(v) { return v * Math.PI/180 })
      } else if (o.variable.match(/^skew/)) {
        if (from) from = from.map(function(v) { return v * Math.PI/180 })
        if (to) to = to.map(function(v) { return v * Math.PI/180 })
        if (by) by = by.map(function(v) { return v * Math.PI/180 })
      }
      if (to == null) to = Object.sum(from, by)
      cn.after(o.after, function() {
        if (o.variable == 'translate') {
          if (from == null) {
            from = [this.x, this.y]
            if (by != null) to = Object.sum(from, by)
          }
          if (o.fill == 'remove') {
            var ox = this.x
            var oy = this.y
            this.after(o.duration, function(){ this.x = ox; this.y = oy })
          }
          this.animate('x', from[0], to[0], o.duration, 'linear', {
            repeat: o.repeat,
            additive: o.additive,
            accumulate: o.accumulate
          })
          if (from[1] != null) {
            this.animate('y', from[1], to[1], o.duration, 'linear', {
              repeat: o.repeat,
              additive: o.additive,
              accumulate: o.accumulate
            })
          }
        } else {
          if (from) {
            if (from.length == 1) from = from[0]
          }
          if (to) {
            if (to.length == 1) to = to[0]
          }
          if (by) {
            if (by.length == 1) by = by[0]
          }
          if (from == null) {
            from = this[o.variable]
            if (by != null) to = Object.sum(from, by)
          }
          if (o.variable == 'scale' && o.additive) {
            // +1 in SMIL's additive scale means *1, welcome to brokenville
            o.additive = false
          }
          if (o.fill == 'remove') {
            var orig = Object.clone(this[o.variable])
            this.after(o.duration, function(){ this[o.variable] = orig })
          }
          this.animate(o.variable, from, to, o.duration, 'linear', {
            repeat: o.repeat,
            additive: o.additive,
            accumulate: o.accumulate
          })
        }
      })
    },

    a : function(c, cn) {
      var href = c.getAttribute('xlink:href') ||
                 c.getAttribute('href')
      var target = c.getAttribute('target')
      var p = new LinkNode(href, target)
      return p
    },

    use : function(c, cn, defs, style) {
      var id = c.getAttribute('xlink:href') ||
                c.getAttribute('href')
      var p = new CanvasNode()
      if (id) {
        id = id.replace(/^#/,'')
        this.getDef(defs, id, function(obj) {
          var oc = obj.clone()
          var par = p.parent
          if (par) {
            if (p.stroke) oc.stroke = p.stroke
            if (p.fill) oc.fill = p.fill
            p.append(oc)
          } else {
            p = oc
          }
        })
      }
      return p
    },

    image : function(c, cn, defs, style) {
      var src = c.getAttribute('xlink:href') ||
                c.getAttribute('href')
      if (src && src.search(/^[a-z]+:/i) != 0) {
        src = cn.root.filename.split("/").slice(0,-1).join("/") + "/" + src
      }
      var p = new ImageNode(src ? Object.loadImage(src) : null)
      p.fill = 'none'
      p.dX = this.parseUnit(c.getAttribute('x'), cn, 'x') || 0
      p.dY = this.parseUnit(c.getAttribute('y'), cn, 'y') || 0
      p.srcWidth = this.parseUnit(c.getAttribute('width'), cn, 'x')
      p.srcHeight = this.parseUnit(c.getAttribute('height'), cn, 'y')
      return p
    },

    path : function(c) {
      return new Path(c.getAttribute("d"))
    },

    polygon : function(c) {
      return new Polygon(c.getAttribute("points").toString().strip()
                          .split(/[\s,]+/).map(parseFloat))
    },

    polyline : function(c) {
      return new Polygon(c.getAttribute("points").toString().strip()
                          .split(/[\s,]+/).map(parseFloat), {closePath:false})
    },

    rect : function(c, cn) {
      var p = new Rectangle(
        this.parseUnit(c.getAttribute('width'), cn, 'x'),
        this.parseUnit(c.getAttribute('height'), cn, 'y')
      )
      p.cx = this.parseUnit(c.getAttribute('x'), cn, 'x') || 0
      p.cy = this.parseUnit(c.getAttribute('y'), cn, 'y') || 0
      p.rx = this.parseUnit(c.getAttribute('rx'), cn, 'x') || 0
      p.ry = this.parseUnit(c.getAttribute('ry'), cn, 'y') || 0
      return p
    },

    line : function(c, cn) {
      var x1 = this.parseUnit(c.getAttribute('x1'), cn, 'x') || 0
      var y1 = this.parseUnit(c.getAttribute('y1'), cn, 'y') || 0
      var x2 = this.parseUnit(c.getAttribute('x2'), cn, 'x') || 0
      var y2 = this.parseUnit(c.getAttribute('y2'), cn, 'y') || 0
      var p = new Line(x1,y1, x2,y2)
      return p
    },

    circle : function(c, cn) {
      var p = new Circle(this.parseUnit(c.getAttribute('r'), cn) || 0)
      p.cx = this.parseUnit(c.getAttribute('cx'), cn, 'x') || 0
      p.cy = this.parseUnit(c.getAttribute('cy'), cn, 'y') || 0
      return p
    },

    ellipse : function(c, cn) {
      var p = new Ellipse(
        this.parseUnit(c.getAttribute('rx'), cn, 'x') || 0,
        this.parseUnit(c.getAttribute('ry'), cn, 'y') || 0
      )
      p.cx = this.parseUnit(c.getAttribute('cx'), cn, 'x') || 0
      p.cy = this.parseUnit(c.getAttribute('cy'), cn, 'y') || 0
      return p
    },

    text : function(c, cn) {
      if (false) {
        var p = new TextNode(c.textContent.strip())
        p.setAsPath(true)
        p.cx = this.parseUnit(c.getAttribute('x'),cn, 'x') || 0
        p.cy = this.parseUnit(c.getAttribute('y'),cn, 'y') || 0
        return p
      } else {
        var e = E('div', c.textContent.strip())
        e.style.marginTop = '-1em'
        e.style.whiteSpace = 'nowrap'
        var p = new ElementNode(e)
        p.xOffset = this.parseUnit(c.getAttribute('x'),cn, 'x') || 0
        p.yOffset = this.parseUnit(c.getAttribute('y'),cn, 'y') || 0
        return p
      }
    },

    style : function(c, cn, defs, style) {
      this.parseStyle(c, style)
    },

    defs : function(c, cn, defs, style) {
      return new CanvasNode({visible: false})
    },

    linearGradient : function(c, cn,defs,style) {
      var g = new Gradient({type:'linear'})
      g.color = cn.color
      if (c.getAttribute('color')) {
        SVGParser.SVGMapping.color(g, c.getAttribute('color'), defs, style)
      }
      g.svgNode = c
      var x1 = c.getAttribute('x1')
      var y1 = c.getAttribute('y1')
      var x2 = c.getAttribute('x2')
      var y2 = c.getAttribute('y2')
      var transform = c.getAttribute('gradientTransform')
      g.units = c.getAttribute('gradientUnits') || "objectBoundingBox"
      if (x1) g.startX = parseFloat(x1) * (x1.charAt(x1.length-1) == '%' ? 0.01 : 1)
      if (y1) g.startY = parseFloat(y1) * (y1.charAt(y1.length-1) == '%' ? 0.01 : 1)
      if (x2) g.endX = parseFloat(x2) * (x2.charAt(x2.length-1) == '%' ? 0.01 : 1)
      if (y2) g.endY = parseFloat(y2) * (y2.charAt(y2.length-1) == '%' ? 0.01 : 1)
      if (transform) this.applySVGTransform(g, transform, defs, style)
      this.parseStops(g, c, defs, style)
      return g
    },

    radialGradient : function(c, cn, defs, style) {
      var g = new Gradient({type:'radial'})
      g.color = cn.color
      if (c.getAttribute('color')) {
        SVGParser.SVGMapping.color(g, c.getAttribute('color'), defs, style)
      }
      g.svgNode = c
      var r = c.getAttribute('r')
      var fx = c.getAttribute('fx')
      var fy = c.getAttribute('fy')
      var cx = c.getAttribute('cx')
      var cy = c.getAttribute('cy')
      var transform = c.getAttribute('gradientTransform')
      g.units = c.getAttribute('gradientUnits') || "objectBoundingBox"
      if (r) g.endRadius = parseFloat(r) * (r.charAt(r.length-1) == '%' ? 0.01 : 1)
      if (fx) g.startX = parseFloat(fx) * (fx.charAt(fx.length-1) == '%' ? 0.01 : 1)
      if (fy) g.startY = parseFloat(fy) * (fy.charAt(fy.length-1) == '%' ? 0.01 : 1)
      if (cx) g.endX = parseFloat(cx) * (cx.charAt(cx.length-1) == '%' ? 0.01 : 1)
      if (cy) g.endY = parseFloat(cy) * (cy.charAt(cy.length-1) == '%' ? 0.01 : 1)
      if (transform) this.applySVGTransform(g, transform, defs, style)
      this.parseStops(g, c, defs, style)
      return g
    }
  },

  parseChildren : function(node, canvasNode, defs, style) {
    var childNodes = []
    var cn = canvasNode
    for (var i=0; i<node.childNodes.length; i++) {
      var c = node.childNodes[i]
      var p = false // argh, remember to initialize vars inside loops
      if (c.childNodes) {
        if (c.tagName) {
          if (this.SVGTagMapping[c.tagName]) {
            p = this.SVGTagMapping[c.tagName].call(
                  this, c, canvasNode, defs, style)
          } else {
            p = new CanvasNode()
          }
          if (p) {
            p.root = canvasNode.root
            p.fontSize = cn.fontSize
            p.strokeWidth = cn.strokeWidth
            if (c.attributes) {
              for (var j=0; j<c.attributes.length; j++) {
                var attr = c.attributes[j]
                if (this.SVGMapping[attr.nodeName])
                  this.SVGMapping[attr.nodeName](p, attr.nodeValue, defs, style)
              }
            }
            if (p.id) {
              this.setDef(defs, p.id, p)
            }
            p.tagName = c.tagName
            this.applySVGTransform(p, c.getAttribute("transform"), defs, style)
            this.applySVGStyle(p, c.getAttribute("style"), defs, style)
            if (p.tagName && style.tags[p.tagName])
              this.applySVGStyle(p, style.tags[p.tagName], defs, style)
            if (p.className && style.classes[p.className])
              this.applySVGStyle(p, style.classes[p.className], defs, style)
            if (p.id && style.ids[p.id])
              this.applySVGStyle(p, style.ids[p.id], defs, style)
            if (!p.marker) p.marker = cn.marker
            if (!p.markerStart) p.markerStart = cn.markerStart
            if (!p.markerEnd) p.markerEnd = cn.markerEnd
            if (!p.markerMid) p.markerMid = cn.markerMid
          }
        }
        if (p && p.setRoot) {
          p.zIndex = i
          canvasNode.append(p)
          this.parseChildren(c, p, defs, style)
        }
      }
    }
  },

  parseStyle : function(node, style) {
    var text = node.textContent
    var segs = text.split(/\}/m)
    for (var i=0; i<segs.length; i++) {
      var seg = segs[i]
      var kv = seg.split(/\{/m)
      if (kv.length < 2) continue
      var key = kv[0].strip()
      var value = kv[1].strip()
      switch (key.charAt(0)) {
        case '.':
          style.classes[key.slice(1)] = value
          break;
        case '#':
          style.ids[key.slice(1)] = value
          break;
        default:
          style.tags[key] = value
          break;
      }
    }
  },

  parseStops : function(g, node, defs, style) {
    var href = node.getAttribute('xlink:href')
    g.colorStops = []
    if (href) {
      href = href.replace(/^#/,'')
      this.getDef(defs, href, function(g2) {
        if (g.colorStops.length == 0)
          g.colorStops = g2.colorStops
      })
    }
    var stops = []
    for (var i=0; i<node.childNodes.length; i++) {
      var c = node.childNodes[i]
      if (c.tagName == 'stop') {
        var offset = parseFloat(c.getAttribute('offset'))
        if (c.getAttribute('offset').search(/%/) != -1)
          offset *= 0.01
        var stop = [offset]
        stop.color = g.color
        for (var j=0; j<c.attributes.length; j++) {
          var attr = c.attributes[j]
          if (this.SVGMapping[attr.nodeName])
            this.SVGMapping[attr.nodeName](stop, attr.nodeValue, defs, style)
        }
        this.applySVGStyle(stop, c.getAttribute('style'), defs, style)
        var id = c.getAttribute('id')
        if (id) this.setDef(defs, id, stop)
        stops.push(stop)
      }
    }
    if (stops.length > 0)
      g.colorStops = stops
  },

  applySVGTransform : function(node, transform, defs, style) {
    if (!transform) return
    node.transformList = []
    var segs = transform.match(/[a-z]+\s*\([^)]*\)/ig)
    for (var i=0; i<segs.length; i++) {
      var kv = segs[i].split("(")
      var k = kv[0].strip()
      if (this.SVGMapping[k]) {
        var v = kv[1].strip().slice(0,-1)
        this.SVGMapping[k](node, v, defs, style)
      }
    }
    this.breakDownTransformList(node)
  },

  breakDownTransformList : function(node) {
    var tl = node.transformList
    if (node.transformList.length == 1) {
      var tr = tl[0]
      if (tr[0] == 'translate') {
        node.x = tr[1][0]
        node.y = tr[1][1]
      } else if (tr[0] == 'scale') {
        node.scale = tr[1]
      } else if (tr[0] == 'rotate') {
        node.rotation = tr[1]
      } else if (tr[0] == 'matrix') {
        node.matrix = tr[1]
      } else if (tr[0] == 'skewX') {
        node.skewX = tr[1][0]
      } else if (tr[0] == 'skewY') {
        node.skewY = tr[1][0]
      } else {
        return
      }
      node.transformList = null
    }
  },

  applySVGStyle : function(node, style, defs, st) {
    if (!style) return
    var segs = style.split(";")
    for (var i=0; i<segs.length; i++) {
      var kv = segs[i].split(":")
      var k = kv[0].strip()
      if (this.SVGMapping[k]) {
        var v = kv[1].strip()
        this.SVGMapping[k](node, v, defs, st)
      }
    }
  },

  getDef : function(defs, id, f) {
    if (defs[id] && defs[id] instanceof Array) {
      defs[id].push(f)
    } else if (defs[id]) {
      f(defs[id])
    } else {
      defs[id] = [f]
    }
  },

  setDef : function(defs, id, obj) {
    if (defs[id] && defs[id] instanceof Array) {
      for (var i=0; i<defs[id].length; i++) {
        defs[id][i](obj)
      }
    }
    defs[id] = obj
  },

  parseUnit : function(v, parent, dir) {
    if (v == null) {
      return null
    } else {
      return this.parseUnitMultiplier(v, parent, dir) * parseFloat(v.strip())
    }
  },

  parseUnitMultiplier : function(str, parent, dir) {
    var cm = this.getCmInPixels()
    if (str.search(/cm$/i) != -1)
      return cm
    else if (str.search(/mm$/i) != -1)
      return 0.1 * cm
    else if (str.search(/pt$/i) != -1)
      return 0.0352777778 * cm
    else if (str.search(/pc$/i) != -1)
      return 0.4233333333 * cm
    else if (str.search(/in$/i) != -1)
      return 2.54 * cm
    else if (str.search(/em$/i) != -1)
      return parent.fontSize
    else if (str.search(/ex$/i) != -1)
      return parent.fontSize / 2
    else if (str.search(/%$/i) != -1)
      if (dir == 'x')
        return parent.root.innerWidth * 0.01
      else if (dir == 'y')
        return parent.root.innerHeight * 0.01
      else
        return parent.root.innerSize * 0.01
    else
      return 1
  },

  getCmInPixels : function() {
    if (!this.cmInPixels) {
      var e = E('div',{ style: {
        margin: '0px',
        padding: '0px',
        width: '1cm',
        height: '1cm',
        position: 'absolute',
        visibility: 'hidden'
      }})
      document.body.appendChild(e)
      var cm = e.offsetWidth
      document.body.removeChild(e)
      this.cmInPixels = cm || 38
    }
    return this.cmInPixels
  },

  getEmInPixels : function() {
    if (!this.emInPixels) {
      var e = E('div',{ style: {
        margin: '0px',
        padding: '0px',
        width: '1em',
        height: '1em',
        position: 'absolute',
        visibility: 'hidden'
      }})
      document.body.appendChild(e)
      var em = e.offsetWidth
      document.body.removeChild(e)
      this.emInPixels = em || 12
    }
    return this.emInPixels
  },

  getExInPixels : function() {
    if (!this.exInPixels) {
      var e = E('div',{ style: {
        margin: '0px',
        padding: '0px',
        width: '1ex',
        height: '1ex',
        position: 'absolute',
        visibility: 'hidden'
      }})
      document.body.appendChild(e)
      var ex = e.offsetWidth
      document.body.removeChild(e)
      this.exInPixels = ex || 6
    }
    return this.exInPixels
  },

  SVGMapping : {
    DEG_TO_RAD_FACTOR : Math.PI / 180,
    RAD_TO_DEG_FACTOR : 180 / Math.PI,

    parseUnit : function(v, cn, dir) {
      return SVGParser.parseUnit(v, cn, dir)
    },

    "class" : function(node, v) {
      node.className = v
    },

    marker : function(node, v, defs) {
      SVGParser.getDef(defs, v.replace(/^url\(#|\)$/g, ''), function(g) {
        node.marker = g
      })
    },

    "marker-start" : function(node, v, defs) {
      SVGParser.getDef(defs, v.replace(/^url\(#|\)$/g, ''), function(g) {
        node.markerStart = g
      })
    },

    "marker-end" : function(node, v, defs) {
      SVGParser.getDef(defs, v.replace(/^url\(#|\)$/g, ''), function(g) {
        node.markerEnd = g
      })
    },

    "marker-mid" : function(node, v, defs) {
      SVGParser.getDef(defs, v.replace(/^url\(#|\)$/g, ''), function(g) {
        node.markerMid = g
      })
    },

    "clip-path" : function(node, v, defs) {
      SVGParser.getDef(defs, v.replace(/^url\(#|\)$/g, ''), function(g) {
        node.clipPath = g
      })
    },

    id : function(node, v) {
      node.id = v
    },

    translate : function(node, v) {
      var xy = v.split(/[\s,]+/).map(parseFloat)
      node.transformList.push(['translate', [xy[0], xy[1] || 0]])
    },

    rotate : function(node, v) {
      if (v == 'auto' || v == 'auto-reverse') return
      var rot = v.split(/[\s,]+/).map(parseFloat)
      var angle = rot[0] * this.DEG_TO_RAD_FACTOR
      if (rot.length > 1)
        node.transformList.push(['rotate', [angle, rot[1], rot[2] || 0]])
      else
        node.transformList.push(['rotate', [angle]])
    },

    scale : function(node, v) {
      var xy = v.split(/[\s,]+/).map(parseFloat)
      var trans = ['scale']
      if (xy.length > 1)
        trans[1] = [xy[0], xy[1]]
      else
        trans[1] = [xy[0], xy[0]]
      node.transformList.push(trans)
    },

    matrix : function(node, v) {
      var mat = v.split(/[\s,]+/).map(parseFloat)
      node.transformList.push(['matrix', mat])
    },

    skewX : function(node, v) {
      var angle = parseFloat(v)*this.DEG_TO_RAD_FACTOR
      node.transformList.push(['skewX', [angle]])
    },

    skewY : function(node, v) {
      var angle = parseFloat(v)*this.DEG_TO_RAD_FACTOR
      node.transformList.push(['skewY', [angle]])
    },

    opacity : function(node, v) {
      node.opacity = parseFloat(v)
    },

    display : function (node, v) {
      node.display = v
    },

    visibility : function (node, v) {
      node.visibility = v
    },

    'stroke-miterlimit' : function(node, v) {
      node.miterLimit = parseFloat(v)
    },

    'stroke-linecap' : function(node, v) {
      node.lineCap = v
    },

    'stroke-linejoin' : function(node, v) {
      node.lineJoin = v
    },

    'stroke-width' : function(node, v) {
      node.strokeWidth = this.parseUnit(v, node)
    },

    fill : function(node, v, defs, style) {
      node.fill = this.__parseStyle(v, node.fill, defs, node.color)
    },

    stroke : function(node, v, defs, style) {
      node.stroke = this.__parseStyle(v, node.stroke, defs, node.color)
    },

    color : function(node, v, defs, style) {
      if (v == 'inherit') return
      node.color = this.__parseStyle(v, false, defs, node.color)
    },

    'stop-color' : function(node, v, defs, style) {
      if (v == 'none') {
        node[1] = [0,0,0,0]
      } else {
        node[1] = this.__parseStyle(v, node[1], defs, node.color)
      }
    },

    'fill-opacity' : function(node, v) {
      node.fillOpacity = Math.min(1,Math.max(0,parseFloat(v)))
    },

    'stroke-opacity' : function(node, v) {
      node.strokeOpacity = Math.min(1,Math.max(0,parseFloat(v)))
    },

    'stop-opacity' : function(node, v) {
      node[1] = node[1] || [0,0,0]
      node[1][3] = Math.min(1,Math.max(0,parseFloat(v)))
    },

    'text-anchor' : function(node, v) {
      node.textAnchor = v
      if (node.setAlign) {
        if (v == 'middle')
          node.setAlign('center')
        else
          node.setAlign(v)
      }
    },

    'font-family' : function(node, v) {
      node.fontFamily = v
    },

    'font-size' : function(node, v) {
      node.fontSize = this.parseUnit(v, node)
    },

    __parseStyle : function(v, currentStyle, defs, currentColor) {

      if (v.charAt(0) == '#') {
        if (v.length == 4)
          v = v.replace(/([^#])/g, '$1$1')
        var a = v.slice(1).match(/../g).map(
          function(i) { return parseInt(i, 16) })
        return a

      } else if (v.search(/^rgb\(/) != -1) {
        var a = v.slice(4,-1).split(",")
        for (var i=0; i<a.length; i++) {
          var c = a[i].strip()
          if (c.charAt(c.length-1) == '%')
            a[i] = Math.round(parseFloat(c.slice(0,-1)) * 2.55)
          else
            a[i] = parseInt(c)
        }
        return a

      } else if (v.search(/^rgba\(/) != -1) {
        var a = v.slice(5,-1).split(",")
        for (var i=0; i<3; i++) {
          var c = a[i].strip()
          if (c.charAt(c.length-1) == '%')
            a[i] = Math.round(parseFloat(c.slice(0,-1)) * 2.55)
          else
            a[i] = parseInt(c)
        }
        var c = a[3].strip()
        if (c.charAt(c.length-1) == '%')
          a[3] = Math.round(parseFloat(c.slice(0,-1)) * 0.01)
        else
          a[3] = Math.max(0, Math.min(1, parseFloat(c)))
        return a

      } else if (v.search(/^url\(/) != -1) {
        var id = v.match(/\([^)]+\)/)[0].slice(1,-1).replace(/^#/, '')
        if (defs[id]) {
          return defs[id]
        } else { // missing defs, let's make it known that we're screwed
          return 'rgba(255,0,255,1)'
        }

      } else if (v == 'currentColor') {
        return currentColor

      } else if (v == 'none') {
        return 'none'

      } else if (v == 'freeze') { // SMIL is evil, but so are we
        return null

      } else if (v == 'remove') {
        return null

      } else { // unknown value, maybe it's an ICC color
        return v
      }
    }
  }
}
