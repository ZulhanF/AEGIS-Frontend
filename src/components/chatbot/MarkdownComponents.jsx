import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  oneDark,
  oneLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";

/**
 * Get markdown components configuration for ReactMarkdown
 * @param {boolean} isDark - Whether dark mode is enabled
 * @returns {Object} Markdown components configuration
 */
export function getMarkdownComponents(isDark) {
  return {
    // Code blocks with syntax highlighting
    code({ inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || "");
      const language = match ? match[1] : "";

      if (!inline && language) {
        return (
          <SyntaxHighlighter
            style={isDark ? oneDark : oneLight}
            language={language}
            PreTag="div"
            className="rounded-lg"
            customStyle={{
              margin: "0",
              borderRadius: "0.5rem",
              fontSize: "1rem",
              padding: "1.25rem",
            }}
            {...props}
          >
            {String(children).replace(/\n$/, "")}
          </SyntaxHighlighter>
        );
      }

      if (!inline) {
        return (
          <SyntaxHighlighter
            style={isDark ? oneDark : oneLight}
            language="text"
            PreTag="div"
            className="rounded-lg"
            customStyle={{
              margin: "0",
              borderRadius: "0.5rem",
              fontSize: "1rem",
              padding: "0.25rem 0.375rem",
              border:"none",
            }}
            {...props}
          >
            {String(children).replace(/\n$/, "")}
          </SyntaxHighlighter>
        );
      }

      return (
        <code
          className="bg-background/50 px-1.5 py-0.5 rounded text-xs font-mono border"
          {...props}
        >
          {children}
        </code>
      );
    },

    // Paragraphs
    p({ children }) {
      return <p className="mb-2 last:mb-0">{children}</p>;
    },

    // Bold
    strong({ children }) {
      return <strong className="font-semibold">{children}</strong>;
    },

    // Italic
    em({ children }) {
      return <em className="italic">{children}</em>;
    },

    // Lists
    ul({ children }) {
      return <ul className="list-disc ml-4 mb-2 space-y-1">{children}</ul>;
    },

    ol({ children }) {
      return <ol className="list-decimal ml-4 mb-2 space-y-1">{children}</ol>;
    },

    li({ children }) {
      return <li className="leading-relaxed">{children}</li>;
    },

    // Headers
    h1({ children }) {
      return (
        <h1 className="text-base font-bold mb-2 mt-3 first:mt-0">{children}</h1>
      );
    },

    h2({ children }) {
      return (
        <h2 className="text-base font-semibold mb-2 mt-3 first:mt-0">
          {children}
        </h2>
      );
    },

    h3({ children }) {
      return (
        <h3 className="text-sm font-semibold mb-1 mt-2 first:mt-0">
          {children}
        </h3>
      );
    },

    // Links
    a({ href, children }) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline hover:no-underline"
        >
          {children}
        </a>
      );
    },

    // Blockquote
    blockquote({ children }) {
      return (
        <blockquote className="border-l-2 border-primary/50 pl-3 my-2 italic text-muted-foreground">
          {children}
        </blockquote>
      );
    },

    // Tables
    table({ children }) {
      return (
        <div className="overflow-x-auto my-2">
          <table className="min-w-full border-collapse border border-border text-xs">
            {children}
          </table>
        </div>
      );
    },

    thead({ children }) {
      return <thead className="bg-muted/50">{children}</thead>;
    },

    tbody({ children }) {
      return <tbody>{children}</tbody>;
    },

    tr({ children }) {
      return <tr className="border-b border-border">{children}</tr>;
    },

    th({ children }) {
      return (
        <th className="border border-border bg-muted/50 px-2 py-1 text-left font-semibold">
          {children}
        </th>
      );
    },

    td({ children }) {
      return <td className="border border-border px-2 py-1">{children}</td>;
    },

    // Horizontal rule
    hr() {
      return <hr className="my-3 border-border" />;
    },

    // Strikethrough
    del({ children }) {
      return <del className="line-through">{children}</del>;
    },

    // Images
    img({ src, alt }) {
      return (
        <img
          src={src}
          alt={alt}
          className="max-w-full h-auto rounded-lg my-2"
        />
      );
    },

    // Preformatted text
    pre({ children }) {
      return <pre className="overflow-x-auto">{children}</pre>;
    },
  };
}
