/*!
 * helper-markdown <https://github.com/jonschlinkert/helper-markdown>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT license.
 */

'use strict';

var hljs = require('highlight.js');
var Remarkable = require('remarkable');
var extend = require('extend-shallow');

module.exports = function markdown(str, opts) {
  if (typeof str === 'object') {
    opts = str;
    str = null;
  }

  opts = extend({}, opts);
  extend(opts, opts.hash);

  if (this && this.app && this.options) {
    extend(opts, this.options.remarkable);
  }

  var md = new Remarkable(extend({
    breaks: false,
    html: true,
    langPrefix: 'lang-',
    linkify: true,
    typographer: false,
    xhtmlOut: false,
    highlight: function highlight(code, lang) {
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
  }, opts));

  str = str || opts.fn(this);
  return md.render(str);
};
