'use strict';

require('mocha');
const _ = require('lodash');
const assert = require('assert');
const handlebars = require('handlebars');
const markdown = require('..');

describe('helper-markdown', () => {
  describe('main export', () => {
    it('should render markdown:', () => {
      assert.strictEqual(markdown('# heading'), '<h1>heading</h1>\n');
    });

    it('should highlight code blocks', () => {
      const html = markdown('```js\nvar foo = "bar";\n```\n', {});
      assert.strictEqual(html, '<pre><code class="language-js"><span class="hljs-keyword">var</span> foo = <span class="hljs-string">&quot;bar&quot;</span>;\n</code></pre>\n');
    });

    it('should pass options to remarkable', () => {
      const a = markdown('abc https://github.com/jonschlinkert/remarkable xyz', {linkify: true});
      assert.strictEqual(a, '<p>abc <a href="https://github.com/jonschlinkert/remarkable">https://github.com/jonschlinkert/remarkable</a> xyz</p>\n');

      const b = markdown('abc https://github.com/jonschlinkert/remarkable xyz', {linkify: false});
      assert.strictEqual(b, '<p>abc https://github.com/jonschlinkert/remarkable xyz</p>\n');
    });

    it('should pass options to highlight.js:', () => {
      const html = markdown('```js\nvar foo = "bar";\n```\n', {langPrefix: 'language-'});
      assert.strictEqual(html, '<pre><code class="language-js"><span class="hljs-keyword">var</span> foo = <span class="hljs-string">&quot;bar&quot;</span>;\n</code></pre>\n');
    });
  });

  describe('handlebars:', () => {
    it('should work as a handlebars helper:', () => {
      handlebars.registerHelper('markdown', markdown({}));
      assert.strictEqual(handlebars.compile('{{#markdown}}# heading{{/markdown}}')(), '<h1>heading</h1>\n');
    });

    it('should pass hash options to remarkable:', () => {
      handlebars.registerHelper('markdown', markdown({}));

      // `linkify: true`
      const a = handlebars.compile('{{#markdown linkify=true}}abc https://github.com/jonschlinkert/remarkable xyz{{/markdown}}')();
      assert.strictEqual(a, '<p>abc <a href="https://github.com/jonschlinkert/remarkable">https://github.com/jonschlinkert/remarkable</a> xyz</p>\n');

      // `linkify: false`
      const b = handlebars.compile('{{#markdown linkify=false}}abc https://github.com/jonschlinkert/remarkable xyz{{/markdown}}')();
      assert.strictEqual(b, '<p>abc https://github.com/jonschlinkert/remarkable xyz</p>\n');
    });

    it('should pass hash options to highlight.js:', () => {
      handlebars.registerHelper('markdown', markdown({}));

      // `langPrefix = language-`
      const a = handlebars.compile('{{#markdown}}```js\nvar foo = "bar";\n```\n{{/markdown}}')();
      assert.strictEqual(a, '<pre><code class="language-js"><span class="hljs-keyword">var</span> foo = <span class="hljs-string">&quot;bar&quot;</span>;\n</code></pre>\n');

      // `langPrefix = language-`
      const b = handlebars.compile('{{#markdown langPrefix="language-"}}```js\nvar foo = "bar";\n```\n{{/markdown}}')();
      assert.strictEqual(b, '<pre><code class="language-js"><span class="hljs-keyword">var</span> foo = <span class="hljs-string">&quot;bar&quot;</span>;\n</code></pre>\n');
    });
  });

  describe('lodash:', () => {
    it('should work as a lodash mixin:', () => {
      _.mixin({markdown: markdown});
      assert.strictEqual(_.template('<%= _.markdown("# heading") %>')({}), '<h1>heading</h1>\n');
    });

    it('should pass options to remarkable:', () => {
      _.mixin({markdown: markdown({})});
      const a = _.template('<%= _.markdown("foo\\n```js\\nvar foo = {};\\n```\\nbar") %>')({});
      assert.strictEqual(a, '<p>foo</p>\n<pre><code class="language-js"><span class="hljs-keyword">var</span> foo = {};\n</code></pre>\n<p>bar</p>\n');

      const b = _.template('<%= _.markdown("foo\\n```js\\nvar foo = {};\\n```\\nbar", {langPrefix: \'language-\'}) %>')({});
      assert.strictEqual(b, '<p>foo</p>\n<pre><code class="language-js"><span class="hljs-keyword">var</span> foo = {};\n</code></pre>\n<p>bar</p>\n');
    });

    it('should work when passed to lodash as a string:', () => {
      assert.strictEqual(_.template('<%= markdown("# heading") %>')({markdown: markdown}), '<h1>heading</h1>\n');
    });

    it('should work as a lodash import:', () => {
      const settings = {imports: {markdown: markdown}};
      assert.strictEqual(_.template('<%= markdown("# heading") %>', settings)({}), '<h1>heading</h1>\n');
    });
  });
});