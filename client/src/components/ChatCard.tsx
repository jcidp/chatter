import { ChatI } from "@/types";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link } from "react-router-dom";
import { formatTimestamp } from "@/helpers/helpers";
import { UserRoundIcon } from "lucide-react";

const ChatCard = ({ id, name, last_message, image }: ChatI) => {
  return (
    <Link to={`/chats/${id}`}>
      <Card>
        <CardHeader className="flex-row items-center gap-2 px-4 py-2">
          <div>
            <Avatar>
              <AvatarImage src={image} />
              <AvatarFallback>
                <UserRoundIcon />
              </AvatarFallback>
            </Avatar>
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
        <CardContent className="p-4 pt-0 grid">
          {last_message ? (
            <>
              <p className="truncate">{last_message?.text} </p>
            </>
          ) : (
            <p>(No messages yet)</p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
};

export default ChatCard;
