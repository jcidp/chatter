import { useEffect, useState } from "react";
import ApiClient from "@/helpers/ApiClient";
import { ChatI } from "@/types";
import ChatCard from "@/components/ChatCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

function Chats() {
  const [isLoading, setIsLoading] = useState(true);
  const [chats, setChats] = useState<ChatI[] | null>(null);

  useEffect(() => {
    const getChats = async () => {
      const chats = await ApiClient.getChats();
      setChats(chats);
      setIsLoading(false);
    };
    getChats();
  }, []);

  if (isLoading) return <h1>Loading...</h1>;

  return (
    <div>
      <div className="flex justify-between">
        <Link to="/users">
          <Button className="my-4">+ New chat</Button>
        </Link>
        <Link to="/new-group" className="ml-auto">
          <Button variant="secondary" className="my-4">
            + New group
          </Button>
        </Link>
      </div>
      <div className="grid gap-y-2">
        {chats?.map((chat) => <ChatCard {...chat} key={chat.id} />)}
      </div>
    </div>
  );
}

export default Chats;
