import { ChatI } from "@/types";
import { Card } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link } from "react-router-dom";

const ChatCard = ({ id, name }: ChatI) => {
  return (
    <Link to={`/chats/${id}`}>
      <Card className="flex items-center gap-4 p-2">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>
            {name
              .split("")
              .reduce(
                (initials, char, i) =>
                  i > 1 ? initials : initials + char.toUpperCase(),
                "",
              )}
          </AvatarFallback>
        </Avatar>
        {name}
      </Card>
    </Link>
  );
};

export default ChatCard;
