import { renderToStaticMarkup } from 'react-dom/server'
import { importEsm } from 'tsimportlib'

// thanks typescript 👍
const ReactMarkdownPromise = importEsm('react-markdown', module)
  .then((mod: typeof import('react-markdown')) => mod.default)
const remarkGfmPromise = importEsm('remark-gfm', module)
  .then((mod: typeof import('remark-gfm')) => mod.default)
const remarkMathPromise = importEsm('remark-math', module)
  .then((mod: typeof import('remark-math')) => mod.default)
const rehypeHighlightPromise = importEsm('rehype-highlight', module)
  .then((mod: typeof import('rehype-highlight')) => mod.default)
const rehypeKaTeXPromise = importEsm('rehype-katex', module)
  .then((mod: typeof import('rehype-katex')) => mod.default)
const rehypeRawPromise = importEsm('rehype-raw', module)
  .then((mod: typeof import('rehype-raw')) => mod.default)

// NOTE: https://github.com/sergioramos/remark-oembed/blob/master/index.js
//       This process links in paragraphs (with nothing else) and converts them into something
//       Could be interesting to process some links like YT manually (the above requires async)

const languages = Object.fromEntries(
  ['cmake', 'dockerfile', 'glsl']
    // eslint-disable-next-line import/no-dynamic-require,global-require
    .map((lang) => [lang, require(`highlight.js/lib/languages/${lang}`)]),
)

export default async (contents: string, format: 'html' | 'md') => {
  if (format === 'md') {
    const ReactMarkdown = await ReactMarkdownPromise
    return renderToStaticMarkup((
      <ReactMarkdown
        remarkPlugins={await Promise.all([remarkGfmPromise, remarkMathPromise])}
        rehypePlugins={[
          [await rehypeHighlightPromise, { subset: false, ignoreMissing: true, languages }],
          await rehypeKaTeXPromise,
          await rehypeRawPromise,
        ]}
        components={{
          img({ node, className, ...props }) {
            const classes = new Set((className || '').split(' '))
            classes.add('img-fluid').add('mb-4')

            return <img className={Array.from(classes.values()).join(' ')} {...props} />
          },
          video({ node, className, ...props }) {
            const classes = new Set((className || '').split(' '))
            classes.add('img-fluid')

            return <video className={Array.from(classes.values()).join(' ')} {...props} />
          },
        }}
      >
        {contents}
      </ReactMarkdown>
    ))
  }

  return contents
}
