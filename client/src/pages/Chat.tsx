import { Card } from "@/components/ui/card";
import ApiClient from "@/helpers/ApiClient";
import { ChatI, Message } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "@/helpers/AuthProvider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Subscription } from "@rails/actioncable";
import ActionCableManager from "@/helpers/ActionCableManager";
import { UserRoundIcon } from "lucide-react";

const Chat = () => {
  const { id: chatId } = useParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatData, setChatData] = useState<ChatI>();
  const [text, setText] = useState("");
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!chatId) return;
    const getChat = async () => {
      const { id, name, image, profile_id, messages } =
        await ApiClient.getChat(chatId);
      if (!messages) return;
      setMessages(messages);
      setChatData({ id, name, image, profile_id });
    };
    getChat();
  }, [chatId]);

  useEffect(() => {
    if (!chatId) return;
    const onReceived = (data: any) => {
      if (data.type === "new_message") {
        setMessages((prev) => [data.message, ...prev]);
      }
    };
    const subscription = ActionCableManager.subscribeToChannel(
      {
        channel: "ChatChannel",
        id: chatId,
      },
      {
        received: onReceived,
      },
    );
    setSubscription(subscription);
    return () => {
      console.log("Unsubscribing...");
      subscription?.unsubscribe();
    };
  }, [chatId]);

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (text.trim() && chatId && subscription) {
        await ApiClient.postMessage(chatId, text.trim());
        setText("");
      }
    } catch (error) {
      console.log("Unable to send message...");
    }
  };

  return (
    <div className="flex-grow flex flex-col overflow-hidden p-1">
      <Link to={`/profile/${chatData?.profile_id}`}>
        <Card className="flex items-center gap-4 p-2 rounded-sm">
          <Avatar>
            <AvatarImage src={chatData?.image} alt={chatData?.name} />
            <AvatarFallback>
              <UserRoundIcon />
            </AvatarFallback>
          </Avatar>
          {chatData?.name}
        </Card>
      </Link>
      <div className="flex-grow bg-secondary overflow-y-auto flex flex-col-reverse p-2 gap-1">
        {messages && messages.length > 0 ? (
          messages.map((message) => (
            <Card
              className={`p-2 ${user?.id === message.user_id ? "self-end" : "self-start"}`}
              key={message.created_at}
            >
              {message.text}
            </Card>
          ))
        ) : (
          <p className="self-center mb-4">
            Type below to send the first message
          </p>
        )}
      </div>
      <form
        className="grid grid-cols-[1fr_max-content] gap-x-2 mt-2 rounded"
        onSubmit={handleSendMessage}
      >
        <Input
          placeholder="Type your message..."
          autoFocus
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <Button type="submit" disabled={!text}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-send h-4 w-4"
          >
            <path d="m22 2-7 20-4-9-9-4Z"></path>
            <path d="M22 2 11 13"></path>
          </svg>
        </Button>
      </form>
    </div>
  );
};

export default Chat;
