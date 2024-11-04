import { cableData, ChatI, ChatMessages, Message } from "@/types";
import { createContext, useContext, useEffect, useState } from "react";
import ApiClient from "./ApiClient";
import ActionCableManager from "./ActionCableManager";
import { Subscription } from "@rails/actioncable";

interface ChatContextType {
  chats: ChatI[];
  messages: Message[];
  sendMessage: (chatId: string, text?: string, image?: File) => Promise<void>;
  loadChats: (newChats: ChatI[]) => void;
  loadMessages: (chatId: string, newMessages: Message[]) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

const ChatProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [chats, setChats] = useState<ChatI[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessages>({
    chatId: "",
    messages: [],
  });
  const [subscription, setSubscription] = useState<Subscription | null>(null);

  useEffect(() => {
    const onNewMessage = (chatId: string, message: Message) => {
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat.id === chatId
            ? {
                ...chat,
                last_message: message,
              }
            : chat,
        ),
      );
      setChatMessages((prevChatMessages) =>
        prevChatMessages.chatId === chatId
          ? {
              ...prevChatMessages,
              messages: [message, ...prevChatMessages.messages],
            }
          : prevChatMessages,
      );
    };

    const onNewChat = (chat: ChatI) => {
      setChats((prevChats) => [chat, ...prevChats]);
    };

    const subscription = ActionCableManager.subscribeToChannel(
      {
        channel: "GlobalChatChannel",
      },
      {
        received: (data: cableData) => {
          if (data.message && data.chat_id) {
            onNewMessage(data.chat_id, data.message);
          } else if (data.chat) {
            onNewChat(data.chat);
          }
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

  const loadMessages = (chatId: string, newMessages: Message[]) => {
    setChatMessages({ chatId, messages: newMessages });
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
      value={{
        chats,
        messages: chatMessages.messages,
        sendMessage,
        loadChats,
        loadMessages,
      }}
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
