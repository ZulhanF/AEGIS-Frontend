import React from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useTheme } from "@/context/ThemeContext";
import { getMarkdownComponents } from "./MarkdownComponents";

function ChatBubble({ message, isUser }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const markdownComponents = getMarkdownComponents(isDark);

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} w-full`}>
      <motion.div
        initial={{
          opacity: 0,
          x: isUser ? 20 : -20,
          scale: 0.95,
        }}
        animate={{
          opacity: 1,
          x: 0,
          scale: 1,
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 25,
          duration: 0.3,
        }}
        className={`max-w-[75%] px-4 py-3 rounded-xl shadow-sm ${
          isUser
            ? "bg-primary text-primary-foreground rounded-br-sm"
            : "bg-muted rounded-bl-sm"
        }`}
      >
        {isUser ? (
          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
            {message}
          </p>
        ) : (
          <div className="text-sm leading-relaxed prose prose-sm dark:prose-invert max-w-none prose-p:my-1 prose-headings:my-2 prose-ul:my-1 prose-ol:my-1 prose-li:my-0.5">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={markdownComponents}
            >
              {message}
            </ReactMarkdown>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default ChatBubble;