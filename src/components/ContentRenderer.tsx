import ReactMarkdown from 'react-markdown';
import CodeBlock from './CodeBlock';
import type { ContentBlock } from '../data/types';

interface Props {
  blocks: ContentBlock[];
}

export default function ContentRenderer({ blocks }: Props) {
  return (
    <div className="content-blocks">
      {blocks.map((block) => {
        switch (block.type) {
          case 'heading':
            return (
              <div key={block.id} className="content-block--heading">
                {block.level === 2 ? (
                  <h2>{block.text}</h2>
                ) : (
                  <h3>{block.text}</h3>
                )}
              </div>
            );

          case 'text':
            return (
              <div key={block.id} className="content-block--text">
                <ReactMarkdown>{block.body}</ReactMarkdown>
              </div>
            );

          case 'code':
            return <CodeBlock key={block.id} block={block} />;

          case 'image':
            return (
              <figure key={block.id} className="content-block--image">
                <img src={block.src} alt={block.alt || ''} />
                {block.caption && (
                  <figcaption className="content-block--image__caption">
                    {block.caption}
                  </figcaption>
                )}
              </figure>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}
