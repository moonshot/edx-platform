var markdown = require("Markdown.Converter.js")

describe('Renders Markdown Refenced Link', function () {
    it('renders referenced link', function () {
        var sample_link = "http://example.com/colon:test"
        var sample_link_html = "[enter link description here][1]\n\n\n  [1]: "+ sample_link
        var tree = markdown.renderJsonML( ['html', ['p', {style: undefined }, sample_link_html] ] );
        expect(tree).toBe(sample_link);
    });
});