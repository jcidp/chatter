import { ChatI } from "@/types";
import { useEffect, useState } from "react";
import ApiClient from "@/helpers/ApiClient";
import { useChatContext } from "@/helpers/ChatProvider";

const useChat = (chatId: string) => {
  const { messages, loadMessages, sendMessage } = useChatContext();
  const [chatData, setChatData] = useState<ChatI>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!chatId) return;
    const fetchChat = async () => {
      try {
        const { id, name, image, profile_id, messages, type } =
          await ApiClient.getChat(chatId);
        if (!messages) return;
        loadMessages(chatId, messages);
        setChatData({ id, name, image, profile_id, type });
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Failed to load chat",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchChat();
  }, [chatId]);

  return {
    messages,
    chatData,
    loading,
    error,
    sendMessage,
  };
};

export default useChat;
