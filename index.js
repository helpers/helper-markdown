/*!
 * helper-markdown <https://github.com/jonschlinkert/helper-markdown>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT license.
 */

'use strict';

var lazy = require('lazy-cache')(require);
lazy('highlight.js', 'hljs');
lazy('remarkable', 'Remarkable');
lazy('extend-shallow', 'extend');

module.exports = function markdown(str, opts) {
  if (typeof str === 'object') {
    opts = str;
    str = null;
  }

  opts = lazy.extend({}, opts);
  lazy.extend(opts, opts.hash);

  if (this && this.app && this.options) {
    lazy.extend(opts, this.options.remarkable);
  }

  var md = new lazy.Remarkable(lazy.extend({
    breaks: false,
    html: true,
    langPrefix: 'lang-',
    linkify: true,
    typographer: false,
    xhtmlOut: false,
    highlight: function highlight(code, lang) {
      try {
        try {
          return lazy.hljs.highlight(lang, code).value;
        } catch (err) {
          if (!/Unknown language/i.test(err.message)) {
            throw err;
          }
          return lazy.hljs.highlightAuto(code).value;
        }
      } catch (err) {
        return code;
      }
    }
  }, opts));

  str = str || opts.fn(this);
  return md.render(str);
};
