import React from "react";
import { motion } from "framer-motion";

function ChatDesc({ user }) {
  const userName = user.name;

  return (
    <motion.div 
      className="p-4 w-[50%] mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <motion.h2 
        className="text-4xl font-bold mb-2 bg-linear-to-r from-zinc-900 to-zinc-400 via-zinc-500 dark:from-zinc-50 dark:to-zinc-500 dark:via-zinc-400 bg-clip-text text-transparent pb-1"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        Hi there, {userName} <br />
        What can I do for you today?
      </motion.h2>
      <motion.p 
        className="text-gray-600 dark:text-gray-400"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        This is a simple chat interface where you can ask questions, search for
        information, or have a conversation with the AI. Type your message in
        the input box below and hit send to get started!
      </motion.p>
    </motion.div>
  );
}

export default ChatDesc;
