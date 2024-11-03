import ChatCard from "@/components/ChatCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import useChats from "@/hooks/useChats";

function Chats() {
  const { chats, loading, error } = useChats();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

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
        {chats.length ? (
          chats.map((chat) => <ChatCard {...chat} key={chat.id} />)
        ) : (
          <h2>Create a chat or a group to start chatting!</h2>
        )}
      </div>
    </div>
  );
}

export default Chats;
