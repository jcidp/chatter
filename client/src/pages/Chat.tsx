import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "@/helpers/AuthProvider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  ImageIcon,
  SendIcon,
  UserRoundIcon,
  UsersRoundIcon,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import useChat from "@/hooks/useChat";
import ChatSkeleton from "@/components/skeletons/ChatSkeleton";

const Chat = () => {
  const { id: chatId } = useParams();
  const { messages, chatData, loading, error, sendMessage } = useChat(
    chatId ?? "",
  );
  const [text, setText] = useState("");
  const [image, setImage] = useState<File | undefined>(undefined);
  const { user } = useAuth();

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await sendMessage(chatId ?? "", text, image);
      setText("");
      setImage(undefined);
    } catch (error) {
      console.log("Failed to send message");
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

  if (loading) return <ChatSkeleton />;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="flex-grow flex flex-col overflow-hidden p-1">
      <Link
        to={
          chatData?.type === "group"
            ? `/group/${chatData?.profile_id}`
            : `/profile/${chatData?.profile_id}`
        }
      >
        <Card className="flex items-center gap-4 p-2 rounded-sm">
          <Avatar>
            <AvatarImage src={chatData?.image} alt={chatData?.name} />
            <AvatarFallback>
              {chatData?.type === "group" ? (
                <UsersRoundIcon />
              ) : (
                <UserRoundIcon />
              )}
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
