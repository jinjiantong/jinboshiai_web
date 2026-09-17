'use client'

import ReactMarkdown, { type Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'

const components: Components = {
  h1: ({ node, children, ...props }) => (
    <h1
      {...props}
      className="scroll-mt-24 mt-14 mb-5 pl-4 border-l-4 border-astro-orange text-2xl lg:text-[28px] font-bold text-astro-ink leading-snug"
    >
      {children}
    </h1>
  ),
  h2: ({ node, children, ...props }) => (
    <h2 {...props} className="scroll-mt-24 mt-10 mb-4 text-xl font-bold text-astro-ink leading-snug">
      {children}
    </h2>
  ),
  h3: ({ node, children, ...props }) => (
    <h3 {...props} className="scroll-mt-24 mt-8 mb-3 text-lg font-semibold text-astro-ink leading-snug">
      {children}
    </h3>
  ),
  p: ({ children }) => <p className="my-4 text-[15px] leading-7 text-astro-inkSoft">{children}</p>,
  ul: ({ children }) => (
    <ul className="my-4 pl-6 list-disc space-y-2 marker:text-astro-orange">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="my-4 pl-6 list-decimal space-y-2 marker:text-astro-orange marker:font-semibold">{children}</ol>
  ),
  li: ({ children }) => (
    <li className="text-[15px] leading-7 text-astro-inkSoft [&>p]:my-0 [&>p]:inline">{children}</li>
  ),
  blockquote: ({ children }) => (
    <blockquote className="my-5 rounded-r-xl border-l-4 border-astro-orange bg-astro-orange/[0.05] px-5 py-3 [&>p]:my-1.5">
      {children}
    </blockquote>
  ),
  table: ({ children }) => (
    <div className="my-6 overflow-x-auto rounded-xl border border-astro-line">
      <table className="w-full text-sm border-collapse">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-astro-bgAlt">{children}</thead>,
  th: ({ children }) => (
    <th className="px-4 py-2.5 text-left font-bold text-astro-ink whitespace-nowrap">{children}</th>
  ),
  tr: ({ children }) => (
    <tr className="border-b border-astro-line last:border-b-0 hover:bg-astro-orange/[0.02] transition-colors">
      {children}
    </tr>
  ),
  td: ({ children }) => (
    <td className="px-4 py-2.5 text-astro-inkSoft align-top leading-relaxed">{children}</td>
  ),
  hr: () => <hr className="my-10 border-astro-line" />,
  a: ({ href, children }) => (
    <a href={href} className="text-astro-orange font-medium hover:underline underline-offset-2">
      {children}
    </a>
  ),
  strong: ({ children }) => <strong className="font-semibold text-astro-ink">{children}</strong>,
  pre: ({ children }) => (
    <pre className="my-5 overflow-x-auto rounded-xl bg-astro-ink p-4 text-[13px] leading-relaxed text-white [&>code]:bg-transparent [&>code]:p-0 [&>code]:text-white">
      {children}
    </pre>
  ),
  code: ({ children }) => (
    <code className="rounded bg-astro-bgAlt px-1.5 py-0.5 text-[13px] font-mono text-astro-orangeDark">
      {children}
    </code>
  ),
}

export default function GuideContent({ markdown }: { markdown: string }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSlug]} components={components}>
      {markdown}
    </ReactMarkdown>
  )
}
