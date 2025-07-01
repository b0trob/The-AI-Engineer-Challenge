'use client'

import React, { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Copy, Check } from 'lucide-react'
import remarkGfm from 'remark-gfm'

interface FormattedMessageProps {
  content: string
  role: 'user' | 'assistant'
}

export default function FormattedMessage({ content, role }: FormattedMessageProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const copyToClipboard = async (code: string, language: string) => {
    try {
      await navigator.clipboard.writeText(code)
      setCopiedCode(`${language}-${code.slice(0, 10)}`)
      setTimeout(() => setCopiedCode(null), 2000)
    } catch (err) {
      console.error('Failed to copy code:', err)
    }
  }

  // For user messages, just return plain text
  if (role === 'user') {
    return <p className="whitespace-pre-wrap text-sm sm:text-base">{content}</p>
  }

  return (
    <div className="prose prose-sm sm:prose-base max-w-none dark:prose-invert">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Code blocks with syntax highlighting and copy button
          code({ className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '')
            const language = match ? match[1] : 'text'
            const code = String(children).replace(/\n$/, '')
            const codeId = `${language}-${code.slice(0, 10)}`
            const isInline = !match

            if (isInline) {
              return (
                <code className="bg-muted px-1 py-0.5 rounded text-sm font-mono" {...props}>
                  {children}
                </code>
              )
            }

            return (
              <div className="relative group">
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
                  <button
                    onClick={() => copyToClipboard(code, language)}
                    className="p-2 bg-background/90 backdrop-blur rounded-lg border border-border hover:bg-background hover:scale-110 active:scale-95 transition-all duration-200 hover:shadow-lg"
                    title="Copy code"
                  >
                    {copiedCode === codeId ? (
                      <Check className="w-4 h-4 text-green-500 animate-pulse" />
                    ) : (
                      <Copy className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors" />
                    )}
                  </button>
                </div>
                <SyntaxHighlighter
                  style={oneDark}
                  language={language}
                  PreTag="div"
                  className="rounded-lg !mt-0 !mb-0"
                  {...props}
                >
                  {code}
                </SyntaxHighlighter>
              </div>
            )
          },
          // Headers
          h1: ({ children }) => <h1 className="text-xl font-bold mt-4 mb-2">{children}</h1>,
          h2: ({ children }) => <h2 className="text-lg font-bold mt-3 mb-2">{children}</h2>,
          h3: ({ children }) => <h3 className="text-base font-bold mt-2 mb-1">{children}</h3>,
          // Lists
          ul: ({ children }) => <ul className="list-disc list-inside space-y-1 my-2">{children}</ul>,
          ol: ({ children }) => <ul className="list-decimal list-inside space-y-1 my-2">{children}</ul>,
          // Links
          a: ({ href, children }) => (
            <a href={href} className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
              {children}
            </a>
          ),
          // Blockquotes
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-primary/30 pl-4 italic my-2 text-muted-foreground">
              {children}
            </blockquote>
          ),
          // Tables
          table: ({ children }) => (
            <div className="overflow-x-auto my-2">
              <table className="min-w-full border-collapse border border-border">
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border border-border px-3 py-2 bg-muted font-semibold text-left">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-border px-3 py-2">
              {children}
            </td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
} 