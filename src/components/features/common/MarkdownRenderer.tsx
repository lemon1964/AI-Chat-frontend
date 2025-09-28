// ai-chat-next/src/components/features/common/MarkdownRenderer.tsx
"use client";

import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";

interface MarkdownRendererProps {
  content: string;
}

type CodeComponentProps = {
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
};

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const [remarkGfm, setRemarkGfm] = useState<typeof import("remark-gfm")["default"] | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth >= 768) {
      import("remark-gfm").then(mod => {
        setRemarkGfm(() => mod.default);
      });
    }
  }, []);

  return (
    <ReactMarkdown
      {...(remarkGfm && { remarkPlugins: [remarkGfm] })}
      components={{
        ul: props => <ul className="list-disc pl-5" {...props} />,
        ol: props => <ol className="list-decimal pl-5" {...props} />,
        li: props => <li className="my-1" {...props} />,
        code: ({ inline, className, children, ...props }: CodeComponentProps) => {
          if (inline) {
            return (
              <code
                className={`${className} bg-gray-700 px-1 py-0.5 rounded text-xs sm:text-sm break-anywhere`}
                {...props}
              >
                {children}
              </code>
            );
          }

          const match = /language-(\w+)/.exec(className || "");
          if (match) {
            return (
              <div className="w-full overflow-x-auto">
                <SyntaxHighlighter
                  style={atomDark}
                  language={match[1]}
                  PreTag="div"
                  wrapLongLines={true}
                  wrapLines={true}
                  customStyle={{
                    fontSize: "0.85rem",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    margin: 0,
                  }}
                  codeTagProps={{
                    style: {
                      fontSize: "inherit",
                    },
                  }}
                >
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
              </div>
            );
          }

          return (
            <pre
              className="bg-gray-800 p-2 rounded-md text-gray-100 text-xs sm:text-sm md:text-base whitespace-pre-wrap break-anywhere"
              {...props}
            >
              <code>{children}</code>
            </pre>
          );
        },
        p: p => <div {...p}>{p.children}</div>,
      }}
    >
      {content}
    </ReactMarkdown>
  );
};