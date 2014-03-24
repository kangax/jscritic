document.getElementById('code').oninput = function() {

  if (!this.value) {

    var els = document.getElementsByClassName('result');
    _.each(els, function(el) {
      el.innerHTML = '';
    });

    var els = document.getElementsByClassName('num');
    _.each(els, function(el) {
      el.innerHTML = '';
    });

    var els = document.getElementsByClassName('info');
    _.each(els, function(el) {
      el.style.display = 'none';
    });

    return;
  }

  var result = window.__result = jscritic(this.value);

  function test(id, testName, infoPropertyName) {
    var el = document.getElementById(id);
    el.innerHTML = (result ? (result[testName] ? 'Yes' : 'No') : '');

    if (result && result[testName]) {
      el.className = el.className.replace(/no/g, '');
      el.className += ' yes';
    }
    else {
      if (!result) {
        el.className = el.className.replace(/(yes|no)/, '');
      }
      else {
        el.className = el.className.replace(/yes/g, '');
        el.className += ' no';
      }
    }
    var infoEl = document.getElementById(id + '-info');
    if (!infoEl) return;

    infoEl.style.display = 'none';
    infoEl.innerHTML = '';

    if (infoPropertyName) {

      infoEl.innerHTML = String(result[infoPropertyName] || '')
        .replace(/&/g,'&amp;')
        .replace(/</g,'&lt;')
        .replace(/>/g,'&gt;');

      infoEl.style.display = (result[infoPropertyName] && String(result[infoPropertyName]))
        ? ''
        : 'none';
    }
  }

  test('browser-sniff', 'hasBrowserSniff', 'browserSniffExcerpt');
  test('extends-native', 'doesExtendNative', 'extendedNatives');
  test('document-write', 'hasDocumentWrite');
  test('has-eval', 'hasEval', 'evalExcerpt');
  test('es6-features', 'doesUseES6');
  test('mozilla-features', 'hasMozillaOnlyFeatures', 'mozillaOnlyFeatures');
  test('ie-incompat', 'hasIEIncompat', 'ieIncompats');

  var el = document.getElementById('global-vars');
  if (result.realGlobals) {
    el.innerHTML = result.realGlobals.length;

    var infoEl = document.getElementById('global-vars-info');
    infoEl.innerHTML = result.realGlobals.join(', ');
    infoEl.style.display = (result.realGlobals && String(result.realGlobals)) ? '' : 'none';
  }

  var el = document.getElementById('unused-vars');
  var infoEl = document.getElementById('unused-vars-info');
  infoEl.innerHTML = '';

  if (result.unused && String(result.unused)) {
    el.innerHTML = result.unused.length;

    infoEl.innerHTML = result.unused.join(', ');
    infoEl.style.display = '';
  }

  var el = document.getElementById('total-size');
  el.innerHTML = (this.value.length / 1024).toFixed(2);

  function uglify(text) {
    var ast = UglifyJS.parse(text);
    ast.figure_out_scope();

    var compressor = UglifyJS.Compressor();
    var compressedAst = ast.transform(compressor);

    compressedAst.figure_out_scope();
    compressedAst.compute_char_frequency();
    compressedAst.mangle_names();

    var stream = UglifyJS.OutputStream();
    compressedAst.print(stream);

    return stream.toString();
  }


  var el = document.getElementById('min-size');
  el.innerHTML = '';
  try {
    el.innerHTML = (uglify(this.value).length / 1024).toFixed(2);
  }
  catch(err) { }
};
