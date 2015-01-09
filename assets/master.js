/* global jscritic, uglify, _ */

document.getElementById('code').oninput = function() {
  'use strict';

  if (!this.value) {

    var elements = document.getElementsByClassName('result');
    _.each(elements, function(el) {
      el.innerHTML = '';
    });

    elements = document.getElementsByClassName('num');
    _.each(elements, function(el) {
      el.innerHTML = '';
    });

    elements = document.getElementsByClassName('info');
    _.each(elements, function(el) {
      el.style.display = 'none';
    });

    return;
  }

  var result = window.__result = jscritic(this.value);

  function test(id, testName, infoPropertyName) {
    var element = document.getElementById(id);
    element.innerHTML = result ? (result[testName] ? 'Yes' : 'No') : '';

    if (result && result[testName]) {
      element.className = element.className.replace(/no/g, '');
      element.className += ' yes';
    } else if (!result) {
      element.className = element.className.replace(/(yes|no)/, '');
    } else {
      element.className = element.className.replace(/yes/g, '');
      element.className += ' no';
    }
    var infoEl = document.getElementById(id + '-info');
    if (!infoEl) {
      return;
    }

    infoEl.style.display = 'none';
    infoEl.innerHTML = '';

    if (infoPropertyName) {

      if (result[infoPropertyName] instanceof Array) {
        infoEl.innerHTML = result[infoPropertyName].join(', ');
      } else {
        infoEl.innerHTML = String(result[infoPropertyName] || '')
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;');
      }

      infoEl.style.display = result[infoPropertyName] && String(result[infoPropertyName])
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
  var infoElement = '';
  if (result.realGlobals) {
    el.innerHTML = result.realGlobals.length;

    infoElement = document.getElementById('global-vars-info');
    infoElement.innerHTML = result.realGlobals.join(', ');
    infoElement.style.display = result.realGlobals && String(result.realGlobals) ? '' : 'none';
  }

  el = document.getElementById('unused-vars');
  infoElement = document.getElementById('unused-vars-info');

  el.innerHTML = '';
  infoElement.innerHTML = '';
  infoElement.style.display = 'none';

  if (result.unused && String(result.unused)) {
    el.innerHTML = result.unused.length;

    infoElement.innerHTML = result.unused.join(', ');
    infoElement.style.display = '';
  }

  el = document.getElementById('total-size');
  el.innerHTML = (this.value.length / 1024).toFixed(2);

  el = document.getElementById('min-size');
  el.innerHTML = '';
  try {
    el.innerHTML = (uglify(this.value).length / 1024).toFixed(2);
  }
  catch(err) { }
};
