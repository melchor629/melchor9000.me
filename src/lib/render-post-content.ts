const { Parser, HtmlRenderer } = require('commonmark')
const highlight = require('highlight.js')

export default (content: string, format: 'html' | 'md') => new Promise<string>((accept, reject) => {
    let html = content
    if(format === 'md') {
        try {
            const reader = new Parser()
            const writter = new HtmlRenderer()
            const tree = reader.parse(content)
            html = writter.render(tree)
        } catch(e) {
            reject(e)
        }
    }

    let codeMatches
    let i = 0
    while((codeMatches = /<pre><code(?: class="language-(.+)")?>/.exec(html.substr(i))) !== null) {
        const codeStart = i + codeMatches.index + codeMatches[0].length
        const codeEnd = /<\/code><\/pre>/.exec(html.substr(codeStart))!.index
        const code = html.substr(codeStart, codeEnd)
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&amp;/g, '&')
            .replace(/&quot;/g, '"')
        const codeRendered = codeMatches[1] ?
            highlight.highlight(codeMatches[1], code).value :
            highlight.highlightAuto(code).value
        html = html.substr(0, codeStart) + codeRendered + html.substr(codeStart + codeEnd)
        i = codeStart + codeRendered.length
    }

    accept(html)
})
