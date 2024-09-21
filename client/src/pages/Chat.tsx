import { Card } from "@/components/ui/card";
import ApiClient from "@/helpers/ApiClient";
import { ChatI, Message } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/helpers/AuthProvider";

const Chat = () => {
  const location = useLocation();
  const [messages, setMessages] = useState<Message[] | undefined>();
  const [chatName, setChatName] = useState("");
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

  return (
    <div className="grid grid-rows-[max-content_1fr]">
      <div>
        <Card className="flex items-center gap-4 p-2">
          <span>&#8592;</span>
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          {chatName}
        </Card>
      </div>
      <div className="bg-secondary flex flex-col-reverse p-2">
        {messages ? (
          messages.map((message) => (
            <Card
              className={`p-2 ${user?.id === message.user_id ? "self-end" : "self-start"}`}
              key={message.created_at}
            >
              {message.text}
            </Card>
          ))
        ) : (
          <p>No messages yet</p>
        )}
      </div>
    </div>
  );
};

export default Chat;
