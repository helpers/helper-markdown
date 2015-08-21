/*!
 * helper-markdown <https://github.com/jonschlinkert/helper-markdown>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT License
 */

'use strict';

/* deps: mocha */
var should = require('should');
var handlebars = require('handlebars');
var _ = require('lodash');
var markdown = require('..');


describe('sync', function () {
  describe('markdown helper', function () {
    it('should render markdown:', function () {
      markdown('# heading').should.equal('<h1>heading</h1>\n');
    });

    it('should highlight code blocks', function () {
      var html = markdown('```js\nvar foo = "bar";\n```\n');
      html.should.equal('<pre><code class="lang-js"><span class="hljs-keyword">var</span> foo = <span class="hljs-string">"bar"</span>;\n</code></pre>\n');
    });

    it('should pass options to remarkable', function () {
      var a = markdown('abc https://github.com/jonschlinkert/remarkable xyz', {linkify: true});
      a.should.equal('<p>abc <a href="https://github.com/jonschlinkert/remarkable">https://github.com/jonschlinkert/remarkable</a> xyz</p>\n');

      var b = markdown('abc https://github.com/jonschlinkert/remarkable xyz', {linkify: false});
      b.should.equal('<p>abc https://github.com/jonschlinkert/remarkable xyz</p>\n');
    });

    it('should pass options to highlight.js:', function () {
      var html = markdown('```js\nvar foo = "bar";\n```\n', {langPrefix: 'language-'});
      html.should.equal('<pre><code class="language-js"><span class="hljs-keyword">var</span> foo = <span class="hljs-string">"bar"</span>;\n</code></pre>\n');
    });
  });

  describe('handlebars:', function () {
    it('should work as a handlebars helper:', function () {
      handlebars.registerHelper('markdown', markdown);
      handlebars.compile('{{#markdown}}# heading{{/markdown}}')().should.equal('<h1>heading</h1>\n');
    });

    it('should pass hash options to remarkable:', function () {
      handlebars.registerHelper('markdown', markdown);

      // `linkify: true`
      var a = handlebars.compile('{{#markdown}}abc https://github.com/jonschlinkert/remarkable xyz{{/markdown}}')();
      a.should.equal('<p>abc <a href="https://github.com/jonschlinkert/remarkable">https://github.com/jonschlinkert/remarkable</a> xyz</p>\n');

      // `linkify: false`
      var b = handlebars.compile('{{#markdown linkify=false}}abc https://github.com/jonschlinkert/remarkable xyz{{/markdown}}')();
      b.should.equal('<p>abc https://github.com/jonschlinkert/remarkable xyz</p>\n');
    });

    it('should pass hash options to highlight.js:', function () {
      handlebars.registerHelper('markdown', markdown);

      // `langPrefix = lang-`
      var a = handlebars.compile('{{#markdown}}```js\nvar foo = "bar";\n```\n{{/markdown}}')();
      a.should.equal('<pre><code class="lang-js"><span class="hljs-keyword">var</span> foo = <span class="hljs-string">"bar"</span>;\n</code></pre>\n');

      // `langPrefix = language-`
      var b = handlebars.compile('{{#markdown langPrefix="language-"}}```js\nvar foo = "bar";\n```\n{{/markdown}}')();
      b.should.equal('<pre><code class="language-js"><span class="hljs-keyword">var</span> foo = <span class="hljs-string">"bar"</span>;\n</code></pre>\n');
    });
  });

  describe('lodash:', function () {
    it('should work as a lodash mixin:', function () {
      _.mixin({markdown: markdown});
      _.template('<%= _.markdown("# heading") %>')({}).should.equal('<h1>heading</h1>\n');
    });

    it('should pass options to remarkable:', function () {
      _.mixin({markdown: markdown});
      var a = _.template('<%= _.markdown("foo\\n```js\\nvar foo = {};\\n```\\nbar") %>')({});
      a.should.equal('<p>foo</p>\n<pre><code class="lang-js"><span class="hljs-keyword">var</span> foo = {};\n</code></pre>\n<p>bar</p>\n');

      var b = _.template('<%= _.markdown("foo\\n```js\\nvar foo = {};\\n```\\nbar", {langPrefix: \'language-\'}) %>')({});
      b.should.equal('<p>foo</p>\n<pre><code class="language-js"><span class="hljs-keyword">var</span> foo = {};\n</code></pre>\n<p>bar</p>\n');
    });

    it('should work when passed to lodash as a string:', function () {
      _.template('<%= markdown("# heading") %>')({markdown: markdown}).should.equal('<h1>heading</h1>\n');
    });

    it('should work as a lodash import:', function () {
      var settings = {imports: {markdown: markdown}};
      _.template('<%= markdown("# heading") %>', settings)({}).should.equal('<h1>heading</h1>\n');
    });
  });
});
