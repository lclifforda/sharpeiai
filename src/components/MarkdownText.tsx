import ReactMarkdown from 'react-markdown';

interface MarkdownTextProps {
  content: string;
  className?: string;
}

export const MarkdownText: React.FC<MarkdownTextProps> = ({ content, className = "" }) => {
  return (
    <div className={className}>
      <ReactMarkdown
        components={{
          p: ({ children }) => <p className="mb-0 leading-relaxed whitespace-pre-wrap">{children}</p>,
          strong: ({ children }) => <strong className="font-bold">{children}</strong>,
          em: ({ children }) => <em className="italic">{children}</em>,
          ul: ({ children }) => <ul className="list-disc list-inside my-2 space-y-1">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal list-inside my-2 space-y-1">{children}</ol>,
          li: ({ children }) => <li className="ml-2">{children}</li>,
          code: ({ children }) => (
            <code className="bg-muted/50 px-1.5 py-0.5 rounded text-sm font-mono">{children}</code>
          ),
          pre: ({ children }) => (
            <pre className="bg-muted/50 p-3 rounded overflow-x-auto my-2 text-sm">{children}</pre>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

