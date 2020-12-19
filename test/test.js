'use strict';

require('mocha');
var _ = require('lodash');
var assert = require('assert');
var handlebars = require('handlebars');
var markdown = require('..');

describe('helper-markdown', function() {
  describe('main export', function() {
    it('should render markdown:', function() {
      assert.equal(markdown('# heading'), '<h1>heading</h1>\n');
    });

    it('should highlight code blocks', function() {
      var html = markdown('```js\nvar foo = "bar";\n```\n', {});
      assert.equal(html, '<pre><code class="language-js"><span class="hljs-keyword">var</span> foo = <span class="hljs-string">&quot;bar&quot;</span>;\n</code></pre>\n');
    });

    it('should pass options to remarkable', function() {
      var a = markdown('abc https://github.com/jonschlinkert/remarkable xyz', {linkify: true});
      assert.equal(a, '<p>abc <a href="https://github.com/jonschlinkert/remarkable">https://github.com/jonschlinkert/remarkable</a> xyz</p>\n');

      var b = markdown('abc https://github.com/jonschlinkert/remarkable xyz', {linkify: false});
      assert.equal(b, '<p>abc https://github.com/jonschlinkert/remarkable xyz</p>\n');
    });

    it('should pass options to highlight.js:', function() {
      var html = markdown('```js\nvar foo = "bar";\n```\n', {langPrefix: 'language-'});
      assert.equal(html, '<pre><code class="language-js"><span class="hljs-keyword">var</span> foo = <span class="hljs-string">&quot;bar&quot;</span>;\n</code></pre>\n');
    });
  });

  describe('handlebars:', function() {
    it('should work as a handlebars helper:', function() {
      handlebars.registerHelper('markdown', markdown({}));
      assert.equal(handlebars.compile('{{#markdown}}# heading{{/markdown}}')(), '<h1>heading</h1>\n');
    });

    it('should pass hash options to remarkable:', function() {
      handlebars.registerHelper('markdown', markdown({}));

      // `linkify: true`
      var a = handlebars.compile('{{#markdown linkify=true}}abc https://github.com/jonschlinkert/remarkable xyz{{/markdown}}')();
      assert.equal(a, '<p>abc <a href="https://github.com/jonschlinkert/remarkable">https://github.com/jonschlinkert/remarkable</a> xyz</p>\n');

      // `linkify: false`
      var b = handlebars.compile('{{#markdown linkify=false}}abc https://github.com/jonschlinkert/remarkable xyz{{/markdown}}')();
      assert.equal(b, '<p>abc https://github.com/jonschlinkert/remarkable xyz</p>\n');
    });

    it('should pass hash options to highlight.js:', function() {
      handlebars.registerHelper('markdown', markdown({}));

      // `langPrefix = language-`
      var a = handlebars.compile('{{#markdown}}```js\nvar foo = "bar";\n```\n{{/markdown}}')();
      assert.equal(a, '<pre><code class="language-js"><span class="hljs-keyword">var</span> foo = <span class="hljs-string">&quot;bar&quot;</span>;\n</code></pre>\n');

      // `langPrefix = language-`
      var b = handlebars.compile('{{#markdown langPrefix="language-"}}```js\nvar foo = "bar";\n```\n{{/markdown}}')();
      assert.equal(b, '<pre><code class="language-js"><span class="hljs-keyword">var</span> foo = <span class="hljs-string">&quot;bar&quot;</span>;\n</code></pre>\n');
    });
  });

  describe('lodash:', function() {
    it('should work as a lodash mixin:', function() {
      _.mixin({markdown: markdown});
      assert.equal(_.template('<%= _.markdown("# heading") %>')({}), '<h1>heading</h1>\n');
    });

    it('should pass options to remarkable:', function() {
      _.mixin({markdown: markdown({})});
      var a = _.template('<%= _.markdown("foo\\n```js\\nvar foo = {};\\n```\\nbar") %>')({});
      assert.equal(a, '<p>foo</p>\n<pre><code class="language-js"><span class="hljs-keyword">var</span> foo = {};\n</code></pre>\n<p>bar</p>\n');

      var b = _.template('<%= _.markdown("foo\\n```js\\nvar foo = {};\\n```\\nbar", {langPrefix: \'language-\'}) %>')({});
      assert.equal(b, '<p>foo</p>\n<pre><code class="language-js"><span class="hljs-keyword">var</span> foo = {};\n</code></pre>\n<p>bar</p>\n');
    });

    it('should work when passed to lodash as a string:', function() {
      assert.equal(_.template('<%= markdown("# heading") %>')({markdown: markdown}), '<h1>heading</h1>\n');
    });

    it('should work as a lodash import:', function() {
      var settings = {imports: {markdown: markdown}};
      assert.equal(_.template('<%= markdown("# heading") %>', settings)({}), '<h1>heading</h1>\n');
    });
  });
});
