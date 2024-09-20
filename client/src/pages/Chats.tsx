import { useEffect, useState } from "react";
import ApiClient from "@/helpers/ApiClient";
import { Chat } from "@/types";
import ChatCard from "@/components/ChatCard";
import { Button } from "@/components/ui/button";

function Chats() {
  const [isLoading, setIsLoading] = useState(true);
  const [chats, setChats] = useState<Chat[] | null>(null);

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
    <main>
      <Button className="my-4 block">+ New chat</Button>
      <div className="grid gap-y-2">
        {chats?.map((chat) => <ChatCard name={chat.name} key={chat.id} />)}
      </div>
    </main>
  );
}

export default Chats;
