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
import { ImageIcon, SendIcon, UserRoundIcon } from "lucide-react";
import { Label } from "@/components/ui/label";

const Chat = () => {
  const { id: chatId } = useParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatData, setChatData] = useState<ChatI>();
  const [text, setText] = useState("");
  const [image, setImage] = useState<File | null>(null);
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
    const trimmedText = text.trim();
    if (!chatId || (!trimmedText && !image) || !subscription) return;
    const formData = new FormData();
    formData.append("chat_id", chatId);
    if (trimmedText) {
      formData.append("text", trimmedText);
    }
    if (image) {
      formData.append("image", image);
    }
    try {
      await ApiClient.postMessage(formData);
      setText("");
      setImage(null);
    } catch (error) {
      console.log("Unable to send message...");
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
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
              className={`p-2 max-w-[90%] ${user?.id === message.user_id ? "self-end" : "self-start"}`}
              key={message.created_at}
            >
              {message.image && <img src={message.image} alt={message.text} />}
              <span>{message.text}</span>
            </Card>
          ))
        ) : (
          <p className="self-center mb-4">
            Type below to send the first message
          </p>
        )}
      </div>
      <form
        className="grid grid-cols-[1fr_max-content_max-content] gap-x-2 mt-2 rounded"
        onSubmit={handleSendMessage}
      >
        <Input
          placeholder="Type your message..."
          autoFocus
          value={text}
          onChange={handleTextChange}
        />
        <Label>
          <Input
            className="hidden"
            type="file"
            id="image"
            name="image"
            accept="image/*"
            multiple={false}
            onChange={handleImageChange}
          />
          <ImageIcon className={`w-10 h-10 ${image && "stroke-green-700"}`} />
        </Label>
        <Button type="submit" disabled={!text && !image}>
          <SendIcon className="w-4" />
        </Button>
      </form>
    </div>
  );
};

export default Chat;
