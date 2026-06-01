import katex from 'katex'
import 'katex/dist/katex.min.css'

/** Renders inline/block KaTeX inside an otherwise plain text string. */
export function renderMath(text: string): string {
  if (!text) return ''
  let res = escapeHtml(text)
  res = res.replace(/\$\$(.*?)\$\$/gs, (_, m: string) => safe(m, true))
  res = res.replace(/\\\[(.*?)\\\]/gs, (_, m: string) => safe(m, true))
  res = res.replace(/\$(.*?)\$/g, (_, m: string) => safe(m, false))
  res = res.replace(/\\\((.*?)\\\)/g, (_, m: string) => safe(m, false))
  return res
}

export function MathText({ text, className }: { text: string; className?: string }) {
  return <span className={className} dangerouslySetInnerHTML={{ __html: renderMath(text) }} />
}

function safe(tex: string, display: boolean): string {
  try {
    return katex.renderToString(unescapeHtml(tex), { displayMode: display, throwOnError: false })
  } catch {
    return tex
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function unescapeHtml(s: string): string {
  return s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
}
