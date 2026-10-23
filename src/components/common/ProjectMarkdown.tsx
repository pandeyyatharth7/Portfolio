import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ProjectMarkdownProps {
  content: string;
}

/** Renders portfolio.md body without enabling raw HTML from repository content. */
export default function ProjectMarkdown({ content }: ProjectMarkdownProps) {
  if (!content.trim()) return null;

  return (
    <section className="terminal-card mb-12">
      <div className="terminal-card-titlebar">
        <span className="font-mono text-sm text-accent-violet">project.readme</span>
      </div>
      <div className="terminal-card-body">
        <div className="space-y-4 leading-relaxed text-text-primary [&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:font-semibold [&_h2]:text-xl [&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:font-semibold [&_h3]:text-lg [&_a]:text-accent-violet [&_a]:underline [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:my-1 [&_blockquote]:border-l-2 [&_blockquote]:border-accent-violet [&_blockquote]:pl-4 [&_blockquote]:text-text-muted [&_pre]:overflow-x-auto [&_pre]:rounded [&_pre]:border [&_pre]:border-border-subtle [&_pre]:bg-bg-base [&_pre]:p-4 [&_code]:font-mono [&_code]:text-sm [&_table]:w-full [&_table]:border-collapse [&_th]:border [&_th]:border-border-subtle [&_th]:p-2 [&_td]:border [&_td]:border-border-subtle [&_td]:p-2">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              a: ({ href, children }) => {
                const safeExternal = typeof href === 'string' && /^https:\/\//i.test(href);
                return safeExternal ? (
                  <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>
                ) : <span>{children}</span>;
              },
              img: ({ alt }) => <span className="text-text-muted">[Image omitted: {alt || 'no alt text'}]</span>,
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </div>
    </section>
  );
}
