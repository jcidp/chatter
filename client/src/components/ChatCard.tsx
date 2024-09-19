import { Chat } from "@/types";
import { Card } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const ChatCard = ({ name }: Pick<Chat, "name">) => {
  return (
    <Card className="flex items-center gap-4 p-2">
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      {name}
    </Card>
  );
};

export default ChatCard;
