import { ChatI } from "@/types";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link, useNavigate } from "react-router-dom";
import { formatTimestamp } from "@/helpers/helpers";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  UserRoundIcon,
  UsersRoundIcon,
} from "lucide-react";
import { useAuth } from "@/helpers/AuthProvider";

const ChatCard = ({
  id,
  name,
  last_message,
  image,
  profile_id,
  type,
}: ChatI) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleCardClick = () => {
    navigate(`/chats/${id}`);
  };

  const handleAvatarClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <Card className="cursor-pointer" onClick={handleCardClick}>
      <CardHeader className="flex-row items-center gap-2 px-4 py-2">
        <div>
          <Link
            to={
              type === "profile"
                ? `/profile/${profile_id}`
                : `/group/${profile_id}`
            }
            className="z-10"
            onClick={handleAvatarClick}
          >
            <Avatar>
              <AvatarImage src={image} />
              <AvatarFallback>
                {type === "group" ? <UsersRoundIcon /> : <UserRoundIcon />}
              </AvatarFallback>
            </Avatar>
          </Link>
        </div>
        <div className="w-full tracking-tight grid grid-cols-[1fr_max-content]">
          <span className="font-semibold truncate">{name}</span>
          {last_message && (
            <span className="text-xs font-normal pt-1">
              {formatTimestamp(last_message.created_at)}
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0 grid grid-cols-[max-content_min-content_1fr] items-center">
        {last_message ? (
          <>
            {type !== "group" ? (
              last_message.user_id === user?.id ? (
                <ArrowUpIcon className="inline stroke-muted-foreground" />
              ) : (
                <ArrowDownIcon className="inline stroke-muted-foreground" />
              )
            ) : (
              <span></span>
            )}
            <span className="mx-1 text-muted-foreground max-w-16 truncate">
              {type === "group"
                ? last_message.user_id === user?.id
                  ? "You:"
                  : `${last_message.author}:`
                : ""}
            </span>
            <span className="truncate">{last_message?.text}</span>
          </>
        ) : (
          <p>(No messages yet)</p>
        )}
      </CardContent>
    </Card>
  );
};

export default ChatCard;
