import { Card } from "@/components/ui/card";
import ApiClient from "@/helpers/ApiClient";
import { Message } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/helpers/AuthProvider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Subscription } from "@rails/actioncable";
import ActionCableManager from "@/helpers/ActionCableManager";

const Chat = () => {
  const location = useLocation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatName, setChatName] = useState("");
  const [text, setText] = useState("");
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const getChat = async () => {
      const id = location.pathname.split("/")[2];
      const response = await ApiClient.getChat(id);
      console.log(response);
      if (!response.messages) return;
      setMessages(response.messages);
      setChatName(response.name);
    };
    getChat();
  }, []);

  useEffect(() => {
    if (!location.pathname || !user) return;
    const onReceived = (data: any) => {
      if (data.type === "new_message") {
        setMessages((prev) => [data.message, ...prev]);
      }
    };
    const subscription = ActionCableManager.subscribeToChannel(
      {
        channel: "ChatChannel",
        id: location.pathname.split("/")[2],
      },
      {
        received: onReceived,
      },
    );
    setSubscription(subscription);
    return () => {
      subscription?.unsubscribe();
    };
  }, [location, user]);

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const chatId = location.pathname.split("/")[2];
    try {
      if (text.trim() && subscription) {
        subscription.perform("receive", {
          text: text.trim(),
          id: chatId,
        });
        setText("");
      }
    } catch (error) {
      console.log("Unable to send message...");
    }
  };

  return (
    <div className="grid grid-rows-[max-content_1fr]">
      <div>
        <Card className="flex items-center gap-4 p-2 rounded-sm">
          <Link to="/">
            <span>&#8592;</span>
          </Link>
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          {chatName}
        </Card>
      </div>
      <div className="bg-secondary flex flex-col-reverse p-2 gap-1">
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
