import React, { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';

interface MarkdownTextProps {
  content: string;
  className?: string;
}

const markdownComponents = {
  p: ({ children }: any) => <p className="mb-0 leading-relaxed whitespace-pre-wrap">{children}</p>,
  strong: ({ children }: any) => <strong className="font-bold">{children}</strong>,
  em: ({ children }: any) => <em className="italic">{children}</em>,
  ul: ({ children }: any) => <ul className="list-disc list-inside my-2 space-y-1">{children}</ul>,
  ol: ({ children }: any) => <ol className="list-decimal list-inside my-2 space-y-1">{children}</ol>,
  li: ({ children }: any) => <li className="ml-2">{children}</li>,
  code: ({ children }: any) => (
    <code className="bg-muted/50 px-1.5 py-0.5 rounded text-sm font-mono">{children}</code>
  ),
  pre: ({ children }: any) => (
    <pre className="bg-muted/50 p-3 rounded overflow-x-auto my-2 text-sm">{children}</pre>
  ),
};

export const MarkdownText = React.memo<MarkdownTextProps>(({ content, className = "" }) => {
  return (
    <div className={className}>
      <ReactMarkdown components={markdownComponents}>
        {content}
      </ReactMarkdown>
    </div>
  );
});

MarkdownText.displayName = "MarkdownText";
