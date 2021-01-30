'use strict';

const hljs = require('highlight.js');
const utils = require('handlebars-utils');
const Remarkable = require('remarkable');
const defaults = { html: true, breaks: true, highlight: highlight };

module.exports = function(config) {
  if (typeof config === 'string' || utils.isOptions(config)) {
    return markdown.apply(defaults, arguments);
  }

  function markdown(str, locals, options) {
    if (typeof str !== 'string') {
      options = locals;
      locals = str;
      str = true;
    }

    if (utils.isOptions(locals)) {
      options = locals;
      locals = {};
    }

    const ctx = utils.context(this, locals, options);
    let opts = utils.options(this, locals, options);
    opts = Object.assign({}, defaults, config, opts);

    if (opts.hasOwnProperty('lang')) {
      opts.langPrefix = opts.lang;
    }

    const md = new Remarkable(opts);
    const val = utils.value(str, ctx, options);
    return md.render(val);
  }
  return markdown;
};

function highlight(code, lang) {
  try {
    try {
      return hljs.highlight(lang, code).value;
    } catch (err) {
      if (!/Unknown language/i.test(err.message)) {
        throw err;
      }
      return hljs.highlightAuto(code).value;
    }
  } catch (err) {
    return code;
  }
}
