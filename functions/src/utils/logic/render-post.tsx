import { renderToStaticMarkup } from 'react-dom/server'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeHighlight from 'rehype-highlight'
import rehypeKaTeX from 'rehype-katex'
import rehypeRaw from 'rehype-raw'

// NOTE: https://github.com/sergioramos/remark-oembed/blob/master/index.js
//       This process links in paragraphs (with nothing else) and converts them into something
//       Could be interesting to process some links like YT manually (the above requires async)

const languages = Object.fromEntries(
  await Promise.all(
    ['cmake', 'dockerfile', 'glsl']
      .map((lang) => [lang, import(`highlight.js/lib/languages/${lang}`)]),
  ),
)

export default async (contents: string, format: 'html' | 'md') => {
  if (format === 'md') {
    return renderToStaticMarkup((
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[
          [rehypeHighlight, { subset: false, ignoreMissing: true, languages }],
          rehypeKaTeX,
          rehypeRaw,
        ]}
        components={{
          img({ node, className, ...props }: any) {
            const classes = new Set((className || '').split(' '))
            classes.add('img-fluid').add('mb-4')

            return <img className={Array.from(classes.values()).join(' ')} {...props} />
          },
          video({ node, className, ...props }: any) {
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
