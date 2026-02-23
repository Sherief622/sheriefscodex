import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import type { CodeBlockData } from '../data/types';

interface Props {
  block: CodeBlockData;
}

export default function CodeBlock({ block }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(block.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = block.code;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="content-block--code">
      <div className="content-block--code__header">
        <span className="content-block--code__lang">{block.language}</span>
        <button
          className="content-block--code__copy"
          onClick={handleCopy}
          title="Copy code"
        >
          {copied ? '✓ Copied' : '⧉ Copy'}
        </button>
      </div>
      <SyntaxHighlighter
        language={block.language}
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          padding: '1rem',
          background: 'transparent',
          fontSize: '0.875rem',
          lineHeight: 1.6,
        }}
        showLineNumbers
      >
        {block.code}
      </SyntaxHighlighter>
      {block.caption && (
        <div className="content-block--code__caption">{block.caption}</div>
      )}
    </div>
  );
}
