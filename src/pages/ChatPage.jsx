import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import ChatCard from "@/components/chatbot/ChatCard";
import ChatDesc from "@/components/chatbot/ChatDesc";
import ChatBubble from "@/components/chatbot/ChatBubble";
import { useChat } from "@/hooks/useChat";
import { Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

function ChatPage({ user }) {
  const {
    messages,
    isLoading,
    error,
    sendMessage,
    clearAllMessages,
  } = useChat();

  const [currentInput, setCurrentInput] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleChange = (e) => {
    setCurrentInput(e.target.value);
  };

  const handleSubmit = async () => {
    if (currentInput.trim() === "") return;
    
    const message = currentInput;
    setCurrentInput("");
    
    const success = await sendMessage(message);
    if (!success) {
      toast.error("Failed to send message. Please try again.");
    }
  };

  const handleClearChat = async () => {
    const result = await clearAllMessages();
    if (result.error) {
      toast.error(result.message || "Failed to clear chat history");
    } else {
      toast.success("Chat history cleared");
    }
  };

  return (
    <motion.div
      className="flex flex-col h-[calc(100vh-4rem)]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {error && (
        <div className="mx-4 mt-2 p-3 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm">
          {error}
        </div>
      )}

      {messages.length === 0 ? (
        <div className="flex flex-col items-center gap-8 justify-between flex-1 p-6">
          <ChatDesc user={user} />
          <div className="w-full max-w-6xl">
            <ChatCard
              handleChange={handleChange}
              handleSubmit={handleSubmit}
              chat={currentInput}
              disabled={isLoading}
            />
          </div>
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto px-4 py-6 custom-scrollbar">
            <div className="max-w-6xl mx-auto space-y-4">
              {messages.map((message) => (
                <ChatBubble
                  key={message.id}
                  message={message.text}
                  isUser={message.isUser}
                />
              ))}
              {isLoading && (
                <div className="flex justify-start w-full">
                  <div className="bg-muted text-muted-foreground rounded-xl rounded-bl-sm px-4 py-3 shadow-sm">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm">AI is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          <div className="border-t bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 px-4">
            <div className="max-w-6xl mx-auto py-4">
              <AlertDialog>
                <ChatCard
                  handleChange={handleChange}
                  handleSubmit={handleSubmit}
                  chat={currentInput}
                  disabled={isLoading}
                  showClearButton={messages.length > 0}
                  onClearChat={() => document.getElementById('clear-chat-trigger')?.click()}
                />
                <AlertDialogTrigger asChild>
                  <button id="clear-chat-trigger" className="hidden" />
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Clear Chat History</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete all chat messages? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleClearChat}>
                      Delete All
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
}

export default ChatPage;
