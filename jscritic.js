if (typeof require === 'function' && typeof process !== 'undefined') {
  jscritic(require('fs').readFileSync(process.argv[2], 'utf-8'));
}

function jscritic(content) {

  var globalVarsToIgnore = [
    'NaN',
    'Array'             ,
    'Boolean'           ,
    'Date'              ,
    'decodeURI'         ,
    'decodeURIComponent',
    'encodeURI'         ,
    'encodeURIComponent',
    'Error'             ,
    'eval'              ,
    'EvalError'         ,
    'Function'          ,
    'hasOwnProperty'    ,
    'isFinite'          ,
    'isNaN'             ,
    'JSON'              ,
    'Math'              ,
    'Map'               ,
    'Number'            ,
    'Object'            ,
    'parseInt'          ,
    'parseFloat'        ,
    'RangeError'        ,
    'ReferenceError'    ,
    'RegExp'            ,
    'Set'               ,
    'String'            ,
    'SyntaxError'       ,
    'TypeError'         ,
    'URIError'          ,
    'WeakMap'           ,

    'Audio'                ,
    'Blob'                 ,
    'addEventListener'     ,
    'applicationCache'     ,
    'atob'                 ,
    'blur'                 ,
    'btoa'                 ,
    'CanvasGradient'       ,
    'CanvasPattern'        ,
    'CanvasRenderingContext2D',
    'clearInterval'        ,
    'clearTimeout'         ,
    'close'                ,
    'closed'               ,
    'CustomEvent'          ,
    'DOMParser'            ,
    'defaultStatus'        ,
    'document'             ,
    'Element'              ,
    'ElementTimeControl'   ,
    'event'                ,
    'FileReader'           ,
    'FormData'             ,
    'focus'                ,
    'frames'               ,
    'getComputedStyle'     ,
    'HTMLElement'          ,
    'HTMLAnchorElement'    ,
    'HTMLBaseElement'      ,
    'HTMLBlockquoteElement',
    'HTMLBodyElement'      ,
    'HTMLBRElement'        ,
    'HTMLButtonElement'    ,
    'HTMLCanvasElement'    ,
    'HTMLDirectoryElement' ,
    'HTMLDivElement'       ,
    'HTMLDListElement'     ,
    'HTMLFieldSetElement'  ,
    'HTMLFontElement'      ,
    'HTMLFormElement'      ,
    'HTMLFrameElement'     ,
    'HTMLFrameSetElement'  ,
    'HTMLHeadElement'      ,
    'HTMLHeadingElement'   ,
    'HTMLHRElement'        ,
    'HTMLHtmlElement'      ,
    'HTMLIFrameElement'    ,
    'HTMLImageElement'     ,
    'HTMLInputElement'     ,
    'HTMLIsIndexElement'   ,
    'HTMLLabelElement'     ,
    'HTMLLayerElement'     ,
    'HTMLLegendElement'    ,
    'HTMLLIElement'        ,
    'HTMLLinkElement'      ,
    'HTMLMapElement'       ,
    'HTMLMenuElement'      ,
    'HTMLMetaElement'      ,
    'HTMLModElement'       ,
    'HTMLObjectElement'    ,
    'HTMLOListElement'     ,
    'HTMLOptGroupElement'  ,
    'HTMLOptionElement'    ,
    'HTMLParagraphElement' ,
    'HTMLParamElement'     ,
    'HTMLPreElement'       ,
    'HTMLQuoteElement'     ,
    'HTMLScriptElement'    ,
    'HTMLSelectElement'    ,
    'HTMLStyleElement'     ,
    'HTMLTableCaptionElement',
    'HTMLTableCellElement' ,
    'HTMLTableColElement'  ,
    'HTMLTableElement'     ,
    'HTMLTableRowElement'  ,
    'HTMLTableSectionElement',
    'HTMLTextAreaElement'  ,
    'HTMLTitleElement'     ,
    'HTMLUListElement'     ,
    'HTMLVideoElement'     ,
    'history'              ,
    'Image'                ,
    'length'               ,
    'localStorage'         ,
    'location'             ,
    'matchMedia'           ,
    'MessageChannel'       ,
    'MessageEvent'         ,
    'MessagePort'          ,
    'MouseEvent'           ,
    'moveBy'               ,
    'moveTo'               ,
    'MutationObserver'     ,
    'name'                 ,
    'Node'                 ,
    'NodeFilter'           ,
    'navigator'            ,
    'onbeforeunload'       ,
    'onblur'               ,
    'onerror'              ,
    'onfocus'              ,
    'onload'               ,
    'onresize'             ,
    'onunload'             ,
    'open'                 ,
    'openDatabase'         ,
    'opener'               ,
    'Option'               ,
    'parent'               ,
    'print'                ,
    'removeEventListener'  ,
    'resizeBy'             ,
    'resizeTo'             ,
    'screen'               ,
    'scroll'               ,
    'scrollBy'             ,
    'scrollTo'             ,
    'sessionStorage'       ,
    'setInterval'          ,
    'setTimeout'           ,
    'SharedWorker'         ,
    'status'               ,
    'SVGAElement'          ,
    'SVGAltGlyphDefElement',
    'SVGAltGlyphElement'   ,
    'SVGAltGlyphItemElement',
    'SVGAngle'             ,
    'SVGAnimateColorElement',
    'SVGAnimateElement'    ,
    'SVGAnimateMotionElement',
    'SVGAnimateTransformElement',
    'SVGAnimatedAngle'     ,
    'SVGAnimatedBoolean'   ,
    'SVGAnimatedEnumeration',
    'SVGAnimatedInteger'   ,
    'SVGAnimatedLength'    ,
    'SVGAnimatedLengthList',
    'SVGAnimatedNumber'    ,
    'SVGAnimatedNumberList',
    'SVGAnimatedPathData'  ,
    'SVGAnimatedPoints'    ,
    'SVGAnimatedPreserveAspectRatio',
    'SVGAnimatedRect'      ,
    'SVGAnimatedString'    ,
    'SVGAnimatedTransformList',
    'SVGAnimationElement'  ,
    'SVGCSSRule'           ,
    'SVGCircleElement'     ,
    'SVGClipPathElement'   ,
    'SVGColor'             ,
    'SVGColorProfileElement',
    'SVGColorProfileRule'  ,
    'SVGComponentTransferFunctionElement',
    'SVGCursorElement'     ,
    'SVGDefsElement'       ,
    'SVGDescElement'       ,
    'SVGDocument'          ,
    'SVGElement'           ,
    'SVGElementInstance'   ,
    'SVGElementInstanceList',
    'SVGEllipseElement'    ,
    'SVGExternalResourcesRequired',
    'SVGFEBlendElement'    ,
    'SVGFEColorMatrixElement',
    'SVGFEComponentTransferElement',
    'SVGFECompositeElement',
    'SVGFEConvolveMatrixElement',
    'SVGFEDiffuseLightingElement',
    'SVGFEDisplacementMapElement',
    'SVGFEDistantLightElement',
    'SVGFEFloodElement'    ,
    'SVGFEFuncAElement'    ,
    'SVGFEFuncBElement'    ,
    'SVGFEFuncGElement'    ,
    'SVGFEFuncRElement'    ,
    'SVGFEGaussianBlurElement',
    'SVGFEImageElement'    ,
    'SVGFEMergeElement'    ,
    'SVGFEMergeNodeElement',
    'SVGFEMorphologyElement',
    'SVGFEOffsetElement'   ,
    'SVGFEPointLightElement',
    'SVGFESpecularLightingElement',
    'SVGFESpotLightElement',
    'SVGFETileElement'     ,
    'SVGFETurbulenceElement',
    'SVGFilterElement'     ,
    'SVGFilterPrimitiveStandardAttributes',
    'SVGFitToViewBox'      ,
    'SVGFontElement'       ,
    'SVGFontFaceElement'   ,
    'SVGFontFaceFormatElement',
    'SVGFontFaceNameElement',
    'SVGFontFaceSrcElement',
    'SVGFontFaceUriElement',
    'SVGForeignObjectElement',
    'SVGGElement'          ,
    'SVGGlyphElement'      ,
    'SVGGlyphRefElement'   ,
    'SVGGradientElement'   ,
    'SVGHKernElement'      ,
    'SVGICCColor'          ,
    'SVGImageElement'      ,
    'SVGLangSpace'         ,
    'SVGLength'            ,
    'SVGLengthList'        ,
    'SVGLineElement'       ,
    'SVGLinearGradientElement',
    'SVGLocatable'         ,
    'SVGMPathElement'      ,
    'SVGMarkerElement'     ,
    'SVGMaskElement'       ,
    'SVGMatrix'            ,
    'SVGMetadataElement'   ,
    'SVGMissingGlyphElement',
    'SVGNumber'            ,
    'SVGNumberList'        ,
    'SVGPaint'             ,
    'SVGPathElement'       ,
    'SVGPathSeg'           ,
    'SVGPathSegArcAbs'     ,
    'SVGPathSegArcRel'     ,
    'SVGPathSegClosePath'  ,
    'SVGPathSegCurvetoCubicAbs',
    'SVGPathSegCurvetoCubicRel',
    'SVGPathSegCurvetoCubicSmoothAbs',
    'SVGPathSegCurvetoCubicSmoothRel',
    'SVGPathSegCurvetoQuadraticAbs',
    'SVGPathSegCurvetoQuadraticRel',
    'SVGPathSegCurvetoQuadraticSmoothAbs',
    'SVGPathSegCurvetoQuadraticSmoothRel',
    'SVGPathSegLinetoAbs'  ,
    'SVGPathSegLinetoHorizontalAbs',
    'SVGPathSegLinetoHorizontalRel',
    'SVGPathSegLinetoRel'  ,
    'SVGPathSegLinetoVerticalAbs',
    'SVGPathSegLinetoVerticalRel',
    'SVGPathSegList'       ,
    'SVGPathSegMovetoAbs'  ,
    'SVGPathSegMovetoRel'  ,
    'SVGPatternElement'    ,
    'SVGPoint'             ,
    'SVGPointList'         ,
    'SVGPolygonElement'    ,
    'SVGPolylineElement'   ,
    'SVGPreserveAspectRatio',
    'SVGRadialGradientElement',
    'SVGRect'              ,
    'SVGRectElement'       ,
    'SVGRenderingIntent'   ,
    'SVGSVGElement'        ,
    'SVGScriptElement'     ,
    'SVGSetElement'        ,
    'SVGStopElement'       ,
    'SVGStringList'        ,
    'SVGStylable'          ,
    'SVGStyleElement'      ,
    'SVGSwitchElement'     ,
    'SVGSymbolElement'     ,
    'SVGTRefElement'       ,
    'SVGTSpanElement'      ,
    'SVGTests'             ,
    'SVGTextContentElement',
    'SVGTextElement'       ,
    'SVGTextPathElement'   ,
    'SVGTextPositioningElement',
    'SVGTitleElement'      ,
    'SVGTransform'         ,
    'SVGTransformList'     ,
    'SVGTransformable'     ,
    'SVGURIReference'      ,
    'SVGUnitTypes'         ,
    'SVGUseElement'        ,
    'SVGVKernElement'      ,
    'SVGViewElement'       ,
    'SVGViewSpec'          ,
    'SVGZoomAndPan'        ,
    'TimeEvent'            ,
    'top'                  ,
    'URL'                  ,
    'WebSocket'            ,
    'window'               ,
    'Worker'               ,
    'XMLHttpRequest'       ,
    'XMLSerializer'        ,
    'XPathEvaluator'       ,
    'XPathException'       ,
    'XPathExpression'      ,
    'XPathNamespace'       ,
    'XPathNSResolver'      ,
    'XPathResult',

    'escape',
    'unescape',

    // added on top of JSHint
    'Int8Array',
    'Int16Array',
    'Int32Array',

    'Uint8Array',
    'Uint16Array',
    'Uint32Array',
    'Uint8ClampedArray',

    'Float32Array',
    'Float64Array',

    'ArrayBuffer',

    'self',
    'console',
    'ActiveXObject',
    'exports',
    'module',
    'require',
    'define',
    'performance'          ,
    'requestAnimationFrame'
  ];

  var JSHINT = typeof require === 'function' ? require('jshint').JSHINT : window.JSHINT,
      uglify = typeof require === 'function' ? require('uglify-js') : window.uglify,
      _ = typeof require === 'function' ? require('underscore') : window._;

  JSHINT(content, {
    freeze: true,
    undef: true,
    browser: true,
    es3: true,
    maxerr: 10000
  });

  var result = JSHINT.data();
  var jscriticResult = { };

  console.log('\n');

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

  console.log(jscriticResult.browserSniffExcerpt || '');

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
      ? ('Yep (' + jscriticResult.extendedNatives + ')')
      : 'Nope');

  (result.errors || []).forEach(function(e) {
    if (e.code === 'W060') {
      jscriticResult.hasDocumentWrite = true;
    }
  });

  console.log('\n- Does it use `document.write`?\t\t',
    jscriticResult.hasDocumentWrite ? 'Yep'  : 'Nope');

  (result.errors || []).forEach(function(e) {
    if (e.code === 'W061') {
      jscriticResult.hasEval = true;
      jscriticResult.evalExcerpt = e.evidence;
    }
  });

  console.log('\n- Does it use eval?\t\t\t',
    jscriticResult.hasEval ? 'Yep' : 'Nope');

  console.log(jscriticResult.evalExcerpt);

  (result.errors || []).forEach(function(e) {
    if (e.code === 'W119') {
      jscriticResult.doesUseES6 = true;
    }
  });

  console.log('\n- Does it use ES6 features?\t\t',
    jscriticResult.doesUseES6 ? 'Yep' : 'Nope');

  jscriticResult.mozillaOnlyFeatures = [ ];

  (result.errors || []).forEach(function(e) {
    if (e.code === 'W118') {
      jscriticResult.hasMozillaOnlyFeatures = true;
      jscriticResult.mozillaOnlyFeatures.push(e.a);
    }
  });

  jscriticResult.mozillaOnlyFeatures = _.unique(jscriticResult.mozillaOnlyFeatures);

  console.log('\n- Does it use Mozilla-only features?\t',
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

  console.log('\n- Does it have IE incompatibilities?\t',
    jscriticResult.hasIEIncompat
      ? ('Yep (' + jscriticResult.ieIncompats.join(', ') + ')')
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

  console.log('\n- How many global variables?\t\t',
    jscriticResult.realGlobals.length,
    jscriticResult.realGlobals.length
      ? ('(' + jscriticResult.realGlobals.join(', ') + ')')
      : '');

  jscriticResult.unused = _.unique((result.unused || []).map(function(o){ return o.name }));

  console.log('\n- How many unused variables?\t\t',
    jscriticResult.unused.length,
    jscriticResult.unused.length ? ('(' + jscriticResult.unused.join(', ') + ')') : '');

  console.log('\nTotal size:\t\t\t\t',
    (content.length / 1024).toFixed(2) + 'KB');

  try {
    jscriticResult.minified = uglify.minify(content, { fromString: true }).code;
  }
  catch(err) { }

  console.log('Minified size:\t\t\t\t',
    jscriticResult.minified
      ? ((jscriticResult.minified.length / 1024).toFixed(2) + 'KB')
      : 'Could not minify');

  console.log('\n');

  return jscriticResult;

}
