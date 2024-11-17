import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Fragment, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "@/helpers/AuthProvider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  ImageIcon,
  ImageMinusIcon,
  ImagePlusIcon,
  SendIcon,
  UserRoundIcon,
  UsersRoundIcon,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import useChat from "@/hooks/useChat";
import ChatSkeleton from "@/components/skeletons/ChatSkeleton";
import { formatTimestamp, isDateEqual } from "@/helpers/helpers";

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
    } else if (image) {
      e.target.value = "";
      setImage(undefined);
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
        <Card className="flex items-center gap-4 p-2 border-none rounded-sm">
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
      <div className="flex-grow overflow-y-auto flex flex-col-reverse p-2 gap-1 border-t-2 ">
        {messages && messages.length > 0 ? (
          messages.map((message, i, arr) => (
            <Fragment key={message.id}>
              <Card
                className={`p-2 flex flex-wrap max-w-[90%] ${user?.id === message.user_id ? "self-end bg-primary text-primary-foreground" : "self-start bg-secondary"}`}
              >
                <CardHeader className="p-0 w-full">
                  {chatData?.type === "group" &&
                    user?.id !== message.user_id && (
                      <CardTitle className="text-base text-muted-foreground">
                        {message.author}
                      </CardTitle>
                    )}
                </CardHeader>
                <CardContent className="p-0">
                  {message.image && (
                    <img src={message.image} alt={message.text} />
                  )}
                  <span>{message.text}</span>
                </CardContent>
                <CardFooter className="p-0 flex-grow justify-end items-end">
                  <span
                    className={`ml-4 text-xs ${user?.id === message.user_id ? "text-muted" : "text-muted-foreground"}`}
                  >
                    {formatTimestamp(message.created_at, { timeOnly: true })}
                  </span>
                </CardFooter>
              </Card>
              {((i + 1 < arr.length &&
                !isDateEqual(message.created_at, arr[i + 1].created_at)) ||
                i + 1 === arr.length) && (
                <Card className="w-fit my-2 mx-auto bg-background border-primary-foreground text-muted-foreground">
                  <CardContent className="p-2">
                    {formatTimestamp(message.created_at, { dateOnly: true })}
                  </CardContent>
                </Card>
              )}
            </Fragment>
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
          {image ? (
            <ImageMinusIcon className="size-10" />
          ) : (
            <ImagePlusIcon className="size-10" />
          )}
        </Label>
        <Button type="submit" disabled={!text && !image}>
          <SendIcon className="w-4" />
        </Button>
      </form>
    </div>
  );
};

export default Chat;
