import { useState, useEffect, useCallback } from "react";
import { 
  getChatMessages, 
  createChatMessage, 
  deleteAllChatMessages, 
  deleteChatMessageById 
} from "@/utils/api";

export function useChat() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState(null);

  const fetchMessages = useCallback(async () => {
    setIsFetching(true);
    setError(null);

    try {
      const result = await getChatMessages();
      
      if (result.error) {
        setError(result.message || "Failed to fetch messages");
        return;
      }

      if (Array.isArray(result.data)) {
        const formattedMessages = result.data.map((msg) => ({
          id: msg.id,
          text: msg.content,
          isUser: msg.role === "USER",
          createdAt: msg.createdAt,
          user: msg.user,
        }));
        setMessages(formattedMessages);
      }
    } catch (err) {
      console.error("Error fetching messages:", err);
      setError(err.message || "Failed to fetch messages");
    } finally {
      setIsFetching(false);
    }
  }, []);

  // Kirim pesan baru
  const sendMessage = useCallback(async (content) => {
    if (!content.trim()) return false;

    // Simpan pesan user ke state lokal dulu
    const userMessage = {
      id: `user_${Date.now()}`,
      text: content,
      isUser: true,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);

    setIsLoading(true);
    setError(null);

    try {
      const result = await createChatMessage(content);
      
      // Tambahkan response AI ke messages
      if (result.data) {
        const aiMessage = {
          id: result.data.id || `ai_${Date.now()}`,
          text: result.data.content,
          isUser: result.data.role === "USER",
          createdAt: result.data.createdAt || new Date().toISOString(),
        };
        setMessages((prev) => [...prev, aiMessage]);
      }

      return true;
    } catch (err) {
      console.error("Error sending message:", err);
      setError(err.message || "Failed to send message");
      setMessages((prev) => prev.filter((msg) => msg.id !== userMessage.id));
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearAllMessages = useCallback(async () => {
    try {
      const result = await deleteAllChatMessages();
      if (!result.error) {
        setMessages([]);
      }
      return result;
    } catch (err) {
      return { error: true, message: err.message };
    }
  }, []);

  const deleteMessage = useCallback(async (messageId) => {
    try {
      const result = await deleteChatMessageById(messageId);
      if (!result.error) {
        setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
      }
      return result;
    } catch (err) {
      return { error: true, message: err.message };
    }
  }, []);

  const clearLocalMessages = useCallback(() => {
    setMessages([]);
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  return {
    messages,
    isLoading,
    isFetching,
    error,
    sendMessage,
    clearAllMessages,
    deleteMessage,
    clearLocalMessages,
    refetch: fetchMessages,
  };
}

export default useChat;
