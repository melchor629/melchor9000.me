import { Parser, HtmlRenderer, Node } from 'commonmark'
import * as highlight from 'highlight.js'

function* walk(tree: Node) {
  const walker = tree.walker()
  let event = walker.next()
  while (event) {
    yield [event.node, event.entering] as const
    event = walker.next()
  }
}

export default (contents: string, format: 'html' | 'md') => {
  let html = contents
  if (format === 'md') {
    const reader = new Parser()
    const writter = new HtmlRenderer()
    const tree = reader.parse(contents)

    const elementsToRemove: Node[] = []
    for (const [node] of walk(tree)) {
      if (node.type === 'code_block') {
        const { language, value: code } = node.info
          // @ts-ignore
          ? highlight.highlight(node.literal, { language: node.info })
          // @ts-ignore
          : highlight.highlightAuto(node.literal)
        const newNode = new Node('html_block', node.sourcepos)
        newNode.literal = `<pre><code class="language-${language || 'unknown'}">${code}</code></pre>`
        node.insertBefore(newNode)
        elementsToRemove.push(node)
      }
    }

    for (const node of elementsToRemove) {
      node.unlink()
    }

    html = writter.render(tree)
  }

  return html
}
