import { Parser, HtmlRenderer } from 'commonmark'
import { highlight, highlightAuto } from 'highlight.js'

export default (contents: string, format: 'html' | 'md') => {
  let html = contents
  if (format === 'md') {
    const reader = new Parser()
    const writter = new HtmlRenderer()
    const tree = reader.parse(html)
    html = writter.render(tree)
  }

  let i = 0
  let codeMatches = /<pre><code(?: class="language-(.+)")?>/.exec(html.substr(i))
  while (codeMatches !== null) {
    const codeStart = i + codeMatches.index + codeMatches[0].length
    const codeEnd = /<\/code><\/pre>/.exec(html.substr(codeStart))!.index
    const code = html.substr(codeStart, codeEnd)
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
    const codeRendered = codeMatches[1]
      ? highlight(codeMatches[1], code).value
      : highlightAuto(code).value
    html = html.substr(0, codeStart) + codeRendered + html.substr(codeStart + codeEnd)
    i = codeStart + codeRendered.length
    codeMatches = /<pre><code(?: class="language-(.+)")?>/.exec(html.substr(i))
  }

  return html
}
