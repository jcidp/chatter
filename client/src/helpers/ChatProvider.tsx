import { ChatI, Message } from "@/types";
import { createContext, useContext, useEffect, useState } from "react";
import ApiClient from "./ApiClient";
import ActionCableManager from "./ActionCableManager";
import { Subscription } from "@rails/actioncable";

interface ChatContextType {
  chats: ChatI[];
  messages: Message[];
  sendMessage: (chatId: string, text?: string, image?: File) => Promise<void>;
  loadChats: (newChats: ChatI[]) => void;
  loadMessages: (newMessages: Message[]) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

const ChatProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [chats, setChats] = useState<ChatI[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);

  useEffect(() => {
    const onNewMessage = (chatId: string, message: Message) => {
      setChats((prevChats) =>
        // Todo: Handle getting message from new chat
        prevChats.map((chat) =>
          chat.id === chatId
            ? {
                ...chat,
                last_message: message,
              }
            : chat,
        ),
      );
      setMessages((prevMessages) =>
        prevMessages[0]?.chat_id === chatId
          ? [message, ...prevMessages]
          : prevMessages,
      );
    };

    const subscription = ActionCableManager.subscribeToChannel(
      {
        channel: "GlobalChatChannel",
      },
      {
        received: (data) => {
          console.log("Receiving data:", data);
          onNewMessage(data.chat_id, data.message);
        },
      },
    );
    setSubscription(subscription);
    return () => {
      console.log("Unsubscribing...");
      subscription?.unsubscribe();
    };
  }, []);

  const loadChats = (newChats: ChatI[]) => {
    setChats(newChats);
  };

  const loadMessages = (newMessages: Message[]) => {
    setMessages(newMessages);
  };

  const sendMessage = async (chatId: string, text?: string, image?: File) => {
    const trimmedText = text?.trim();
    if (!chatId || (!trimmedText && !image) || !subscription) return;
    const formData = new FormData();
    formData.append("chat_id", chatId);
    if (trimmedText) {
      formData.append("text", trimmedText);
    }
    if (image) {
      formData.append("image", image);
    }
    await ApiClient.postMessage(formData);
  };

  return (
    <ChatContext.Provider
      value={{ chats, messages, sendMessage, loadChats, loadMessages }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export default ChatProvider;

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
