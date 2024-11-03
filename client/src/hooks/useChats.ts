import ApiClient from "@/helpers/ApiClient";
import { useEffect, useState } from "react";
import { useChatContext } from "@/helpers/ChatProvider";

const useChats = () => {
  const { chats, loadChats } = useChatContext();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const fetchedChats = await ApiClient.getChats();
        loadChats(fetchedChats);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Failed to load chats.",
        );
      } finally {
        setLoading(false);
      }
    };
    fetchChats();
  }, []);

  return {
    chats,
    loading,
    error,
  };
};

export default useChats;
