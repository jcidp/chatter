import { Card } from "@/components/ui/card";
import ApiClient from "@/helpers/ApiClient";
import { Message } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/helpers/AuthProvider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Chat = () => {
  const location = useLocation();
  const [messages, setMessages] = useState<Message[] | undefined>();
  const [chatName, setChatName] = useState("");
  const [text, setText] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    const getChat = async () => {
      const id = location.pathname.split("/")[2];
      const response = await ApiClient.getChat(id);
      console.log(response);
      setMessages(response.messages);
      setChatName(response.name);
    };
    getChat();
  }, []);

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(`Sending: "${text}"`);
    setText("");
  };

  return (
    <div className="grid grid-rows-[max-content_1fr]">
      <div>
        <Card className="flex items-center gap-4 p-2">
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
      <div className="bg-secondary flex flex-col-reverse p-2">
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
        className="grid grid-cols-[1fr_max-content] gap-x-2"
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
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
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
