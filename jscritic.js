/* jshint laxbreak:true, laxcomma:true */

function jscritic(content) {
  'use strict';

  var globalVarsToIgnore = [
      'Array'
    , 'Boolean'
    , 'Date'
    , 'decodeURI'
    , 'decodeURIComponent'
    , 'encodeURI'
    , 'encodeURIComponent'
    , 'Error'
    , 'eval'
    , 'EvalError'
    , 'Function'
    , 'hasOwnProperty'
    , 'isFinite'
    , 'isNaN'
    , 'JSON'
    , 'Map'
    , 'Math'
    , 'NaN'
    , 'Number'
    , 'Object'
    , 'parseFloat'
    , 'parseInt'
    , 'RangeError'
    , 'ReferenceError'
    , 'RegExp'
    , 'Set'
    , 'String'
    , 'SyntaxError'
    , 'TypeError'
    , 'URIError'
    , 'WeakMap'

    , 'addEventListener'
    , 'applicationCache'
    , 'atob'
    , 'Audio'
    , 'Blob'
    , 'blur'
    , 'btoa'
    , 'CanvasGradient'
    , 'CanvasPattern'
    , 'CanvasRenderingContext2D'
    , 'clearInterval'
    , 'clearTimeout'
    , 'close'
    , 'closed'
    , 'CustomEvent'
    , 'defaultStatus'
    , 'document'
    , 'DOMParser'
    , 'Element'
    , 'ElementTimeControl'
    , 'event'
    , 'FileReader'
    , 'focus'
    , 'FormData'
    , 'frames'
    , 'getComputedStyle'
    , 'history'
    , 'HTMLAnchorElement'
    , 'HTMLBaseElement'
    , 'HTMLBlockquoteElement'
    , 'HTMLBodyElement'
    , 'HTMLBRElement'
    , 'HTMLButtonElement'
    , 'HTMLCanvasElement'
    , 'HTMLDirectoryElement'
    , 'HTMLDivElement'
    , 'HTMLDListElement'
    , 'HTMLElement'
    , 'HTMLFieldSetElement'
    , 'HTMLFontElement'
    , 'HTMLFormElement'
    , 'HTMLFrameElement'
    , 'HTMLFrameSetElement'
    , 'HTMLHeadElement'
    , 'HTMLHeadingElement'
    , 'HTMLHRElement'
    , 'HTMLHtmlElement'
    , 'HTMLIFrameElement'
    , 'HTMLImageElement'
    , 'HTMLInputElement'
    , 'HTMLIsIndexElement'
    , 'HTMLLabelElement'
    , 'HTMLLayerElement'
    , 'HTMLLegendElement'
    , 'HTMLLIElement'
    , 'HTMLLinkElement'
    , 'HTMLMapElement'
    , 'HTMLMenuElement'
    , 'HTMLMetaElement'
    , 'HTMLModElement'
    , 'HTMLObjectElement'
    , 'HTMLOListElement'
    , 'HTMLOptGroupElement'
    , 'HTMLOptionElement'
    , 'HTMLParagraphElement'
    , 'HTMLParamElement'
    , 'HTMLPreElement'
    , 'HTMLQuoteElement'
    , 'HTMLScriptElement'
    , 'HTMLSelectElement'
    , 'HTMLStyleElement'
    , 'HTMLTableCaptionElement'
    , 'HTMLTableCellElement'
    , 'HTMLTableColElement'
    , 'HTMLTableElement'
    , 'HTMLTableRowElement'
    , 'HTMLTableSectionElement'
    , 'HTMLTextAreaElement'
    , 'HTMLTitleElement'
    , 'HTMLUListElement'
    , 'HTMLVideoElement'
    , 'Image'
    , 'length'
    , 'localStorage'
    , 'location'
    , 'matchMedia'
    , 'MessageChannel'
    , 'MessageEvent'
    , 'MessagePort'
    , 'MouseEvent'
    , 'moveBy'
    , 'moveTo'
    , 'MutationObserver'
    , 'name'
    , 'navigator'
    , 'Node'
    , 'NodeFilter'
    , 'onbeforeunload'
    , 'onblur'
    , 'onerror'
    , 'onfocus'
    , 'onload'
    , 'onresize'
    , 'onunload'
    , 'open'
    , 'openDatabase'
    , 'opener'
    , 'Option'
    , 'parent'
    , 'print'
    , 'removeEventListener'
    , 'resizeBy'
    , 'resizeTo'
    , 'screen'
    , 'scroll'
    , 'scrollBy'
    , 'scrollTo'
    , 'sessionStorage'
    , 'setInterval'
    , 'setTimeout'
    , 'SharedWorker'
    , 'status'
    , 'SVGAElement'
    , 'SVGAltGlyphDefElement'
    , 'SVGAltGlyphElement'
    , 'SVGAltGlyphItemElement'
    , 'SVGAngle'
    , 'SVGAnimateColorElement'
    , 'SVGAnimatedAngle'
    , 'SVGAnimatedBoolean'
    , 'SVGAnimatedEnumeration'
    , 'SVGAnimatedInteger'
    , 'SVGAnimatedLength'
    , 'SVGAnimatedLengthList'
    , 'SVGAnimatedNumber'
    , 'SVGAnimatedNumberList'
    , 'SVGAnimatedPathData'
    , 'SVGAnimatedPoints'
    , 'SVGAnimatedPreserveAspectRatio'
    , 'SVGAnimatedRect'
    , 'SVGAnimatedString'
    , 'SVGAnimatedTransformList'
    , 'SVGAnimateElement'
    , 'SVGAnimateMotionElement'
    , 'SVGAnimateTransformElement'
    , 'SVGAnimationElement'
    , 'SVGCircleElement'
    , 'SVGClipPathElement'
    , 'SVGColor'
    , 'SVGColorProfileElement'
    , 'SVGColorProfileRule'
    , 'SVGComponentTransferFunctionElement'
    , 'SVGCSSRule'
    , 'SVGCursorElement'
    , 'SVGDefsElement'
    , 'SVGDescElement'
    , 'SVGDocument'
    , 'SVGElement'
    , 'SVGElementInstance'
    , 'SVGElementInstanceList'
    , 'SVGEllipseElement'
    , 'SVGExternalResourcesRequired'
    , 'SVGFEBlendElement'
    , 'SVGFEColorMatrixElement'
    , 'SVGFEComponentTransferElement'
    , 'SVGFECompositeElement'
    , 'SVGFEConvolveMatrixElement'
    , 'SVGFEDiffuseLightingElement'
    , 'SVGFEDisplacementMapElement'
    , 'SVGFEDistantLightElement'
    , 'SVGFEFloodElement'
    , 'SVGFEFuncAElement'
    , 'SVGFEFuncBElement'
    , 'SVGFEFuncGElement'
    , 'SVGFEFuncRElement'
    , 'SVGFEGaussianBlurElement'
    , 'SVGFEImageElement'
    , 'SVGFEMergeElement'
    , 'SVGFEMergeNodeElement'
    , 'SVGFEMorphologyElement'
    , 'SVGFEOffsetElement'
    , 'SVGFEPointLightElement'
    , 'SVGFESpecularLightingElement'
    , 'SVGFESpotLightElement'
    , 'SVGFETileElement'
    , 'SVGFETurbulenceElement'
    , 'SVGFilterElement'
    , 'SVGFilterPrimitiveStandardAttributes'
    , 'SVGFitToViewBox'
    , 'SVGFontElement'
    , 'SVGFontFaceElement'
    , 'SVGFontFaceFormatElement'
    , 'SVGFontFaceNameElement'
    , 'SVGFontFaceSrcElement'
    , 'SVGFontFaceUriElement'
    , 'SVGForeignObjectElement'
    , 'SVGGElement'
    , 'SVGGlyphElement'
    , 'SVGGlyphRefElement'
    , 'SVGGradientElement'
    , 'SVGHKernElement'
    , 'SVGICCColor'
    , 'SVGImageElement'
    , 'SVGLangSpace'
    , 'SVGLength'
    , 'SVGLengthList'
    , 'SVGLinearGradientElement'
    , 'SVGLineElement'
    , 'SVGLocatable'
    , 'SVGMarkerElement'
    , 'SVGMaskElement'
    , 'SVGMatrix'
    , 'SVGMetadataElement'
    , 'SVGMissingGlyphElement'
    , 'SVGMPathElement'
    , 'SVGNumber'
    , 'SVGNumberList'
    , 'SVGPaint'
    , 'SVGPathElement'
    , 'SVGPathSeg'
    , 'SVGPathSegArcAbs'
    , 'SVGPathSegArcRel'
    , 'SVGPathSegClosePath'
    , 'SVGPathSegCurvetoCubicAbs'
    , 'SVGPathSegCurvetoCubicRel'
    , 'SVGPathSegCurvetoCubicSmoothAbs'
    , 'SVGPathSegCurvetoCubicSmoothRel'
    , 'SVGPathSegCurvetoQuadraticAbs'
    , 'SVGPathSegCurvetoQuadraticRel'
    , 'SVGPathSegCurvetoQuadraticSmoothAbs'
    , 'SVGPathSegCurvetoQuadraticSmoothRel'
    , 'SVGPathSegLinetoAbs'
    , 'SVGPathSegLinetoHorizontalAbs'
    , 'SVGPathSegLinetoHorizontalRel'
    , 'SVGPathSegLinetoRel'
    , 'SVGPathSegLinetoVerticalAbs'
    , 'SVGPathSegLinetoVerticalRel'
    , 'SVGPathSegList'
    , 'SVGPathSegMovetoAbs'
    , 'SVGPathSegMovetoRel'
    , 'SVGPatternElement'
    , 'SVGPoint'
    , 'SVGPointList'
    , 'SVGPolygonElement'
    , 'SVGPolylineElement'
    , 'SVGPreserveAspectRatio'
    , 'SVGRadialGradientElement'
    , 'SVGRect'
    , 'SVGRectElement'
    , 'SVGRenderingIntent'
    , 'SVGScriptElement'
    , 'SVGSetElement'
    , 'SVGStopElement'
    , 'SVGStringList'
    , 'SVGStylable'
    , 'SVGStyleElement'
    , 'SVGSVGElement'
    , 'SVGSwitchElement'
    , 'SVGSymbolElement'
    , 'SVGTests'
    , 'SVGTextContentElement'
    , 'SVGTextElement'
    , 'SVGTextPathElement'
    , 'SVGTextPositioningElement'
    , 'SVGTitleElement'
    , 'SVGTransform'
    , 'SVGTransformable'
    , 'SVGTransformList'
    , 'SVGTRefElement'
    , 'SVGTSpanElement'
    , 'SVGUnitTypes'
    , 'SVGURIReference'
    , 'SVGUseElement'
    , 'SVGViewElement'
    , 'SVGViewSpec'
    , 'SVGVKernElement'
    , 'SVGZoomAndPan'
    , 'TimeEvent'
    , 'top'
    , 'URL'
    , 'WebSocket'
    , 'window'
    , 'Worker'
    , 'XMLHttpRequest'
    , 'XMLSerializer'
    , 'XPathEvaluator'
    , 'XPathException'
    , 'XPathExpression'
    , 'XPathNamespace'
    , 'XPathNSResolver'
    , 'XPathResult'

    , 'escape'
    , 'unescape'

    // added on top of JSHint
    , 'Int8Array'
    , 'Int16Array'
    , 'Int32Array'

    , 'Uint8Array'
    , 'Uint16Array'
    , 'Uint32Array'
    , 'Uint8ClampedArray'

    , 'Float32Array'
    , 'Float64Array'

    , 'ArrayBuffer'

    , 'ActiveXObject'
    , 'console'
    , 'define'
    , 'exports'
    , 'module'
    , 'performance'
    , 'requestAnimationFrame'
    , 'require'
    , 'self'
  ];

  var JSHINT = typeof require === 'function' ? require('jshint').JSHINT : window.JSHINT,
      _ = typeof require === 'function' ? require('underscore') : window._;

  JSHINT(content, {
    browser: true,
    es3: true,
    freeze: true,
    funcscope: true,
    maxerr: 10000,
    undef: true
  });

  var result = JSHINT.data();
  var jscriticResult = { };

  (result.globals || []).forEach(function(name) {
    if (name === 'navigator') {
      // pretty weak sauce but what can we do...
      var index = content.indexOf('navigator.userAgent');
      if (index > -1) {
        jscriticResult.hasBrowserSniff = true;
        jscriticResult.browserSniffExcerpt =
          '\n...' +
            content.slice(index - Math.min(500, index), index + 500) +
          '...\n';
      }
    }
  });

  console.log('- Does it browser sniff?\t\t',
    jscriticResult.hasBrowserSniff ? 'Yep' : 'Nope');

  if (jscriticResult.browserSniffExcerpt) {
    console.log(jscriticResult.browserSniffExcerpt);
  }

  jscriticResult.extendedNatives = [ ];
  (result.errors || []).forEach(function(e) {
    if (e.code === 'W121') {
      jscriticResult.doesExtendNative = true;
      jscriticResult.extendedNatives.push(e.a);
    }
  });

  jscriticResult.extendedNatives = _.unique(jscriticResult.extendedNatives);

  console.log('- Does it extend native objects?\t',
    jscriticResult.doesExtendNative
      ? 'Yep (' + jscriticResult.extendedNatives + ')'
      : 'Nope');

  (result.errors || []).forEach(function(e) {
    if (e.code === 'W060') {
      jscriticResult.hasDocumentWrite = true;
    }
  });

  console.log('- Does it use `document.write`?\t',
    jscriticResult.hasDocumentWrite ? 'Yep' : 'Nope');

  (result.errors || []).forEach(function(e) {
    if (e.code === 'W061' || e.code === 'W054') {
      jscriticResult.hasEval = true;
      jscriticResult.evalExcerpt = e.evidence;
    }
  });

  console.log('- Does it use eval (or a form of it)?\t',
    jscriticResult.hasEval ? 'Yep' : 'Nope');

  if (jscriticResult.evalExcerpt) {
    console.log(jscriticResult.evalExcerpt);
  }

  (result.errors || []).forEach(function(e) {
    if (e.code === 'W119') {
      jscriticResult.doesUseES6 = true;
    }
  });

  console.log('- Does it use ES6 features?\t\t',
    jscriticResult.doesUseES6 ? 'Yep' : 'Nope');

  jscriticResult.mozillaOnlyFeatures = [ ];

  (result.errors || []).forEach(function(e) {
    if (e.code === 'W118') {
      jscriticResult.hasMozillaOnlyFeatures = true;
      jscriticResult.mozillaOnlyFeatures.push(e.a);
    }
  });

  jscriticResult.mozillaOnlyFeatures = _.unique(jscriticResult.mozillaOnlyFeatures);

  console.log('- Does it use Mozilla-only features?\t',
    jscriticResult.hasMozillaOnlyFeatures
      ? 'Yep (' + jscriticResult.mozillaOnlyFeatures.join(', ') + ')'
      : 'Nope');

  jscriticResult.ieIncompats = [ ];
  (result.errors || []).forEach(function(e) {
    if (e.code === 'W070' /* last comma */ ||
        e.code === 'E034' /* getters/setters */) {
      jscriticResult.hasIEIncompat = true;
      jscriticResult.ieIncompats.push(e.reason.match(/[^\.]*/)[0]);
    }
  });

  jscriticResult.ieIncompats = _.unique(jscriticResult.ieIncompats);

  console.log('- Does it have IE incompatibilities?\t',
    jscriticResult.hasIEIncompat
      ? 'Yep (' + jscriticResult.ieIncompats.join(', ') + ')'
      : 'Nope');

  var globals = _.difference(_.unique(result.globals || []), globalVarsToIgnore);

  var leakedVars = [ ];
  (result.errors || []).forEach(function(e) {
    if (e.code === 'W117' || e.code === 'W120') {
      jscriticResult.doesLeakVars = true;
      leakedVars.push(e.a);
    }
  });

  jscriticResult.realLeakedVars = _.difference(_.unique(leakedVars), globalVarsToIgnore);

  jscriticResult.realGlobals = globals.concat(jscriticResult.realLeakedVars);

  console.log('- How many global variables?\t\t',
    jscriticResult.realGlobals.length,
    jscriticResult.realGlobals.length
      ? '(' + jscriticResult.realGlobals.join(', ') + ')'
      : '');

  jscriticResult.unused = _.unique((result.unused || []).map(function(o) { return o.name; }));

  console.log('- How many unused variables?\t\t',
    jscriticResult.unused.length,
    jscriticResult.unused.length ? '(' + jscriticResult.unused.join(', ') + ')' : '');

  console.log('Total size:\t\t\t\t',
    (content.length / 1024).toFixed(2) + 'KB');

  jscriticResult.minified = (uglify(content).length / 1024).toFixed(2);

  console.log('Minified size:\t\t\t\t',
    jscriticResult.minified
      ? jscriticResult.minified + 'KB'
      : 'Could not minify');

  return jscriticResult;

}

function uglify(text, options) {
  if (typeof options !== 'object') {
    options = { };
  }
  options.fromString = true;
  options.output = { inline_script: true };

  try {
    // try to get window reference first
    var __UglifyJS = window.UglifyJS;

    if (typeof __UglifyJS === 'undefined' && typeof require === 'function') {
      __UglifyJS = require('uglify-js');
    }

    // noop
    if (!__UglifyJS) {
      return text;
    }

    if (__UglifyJS.minify) {
      return __UglifyJS.minify(text, options).code;
    }
    else if (__UglifyJS.parse) {

      var ast = __UglifyJS.parse(text);
      ast.figure_out_scope();

      var compressor = __UglifyJS.Compressor();
      var compressedAst = ast.transform(compressor);

      compressedAst.figure_out_scope();
      compressedAst.compute_char_frequency();

      if (options.mangle !== false) {
        compressedAst.mangle_names();
      }

      var stream = __UglifyJS.OutputStream(options.output);
      compressedAst.print(stream);

      return stream.toString();
    }
    else {
      return text;
    }
  }
  catch (err) {
    console.log(err);
  }
  return text;
}

if (typeof require === 'function' && typeof process !== 'undefined') {
  jscritic(require('fs').readFileSync(process.argv[2], 'utf-8'));
}
