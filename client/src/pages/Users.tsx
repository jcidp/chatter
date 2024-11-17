import ListSkeleton from "@/components/skeletons/ListSkeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import ApiClient from "@/helpers/ApiClient";
import { User } from "@/types";
import { UserRoundIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Users = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getUsers = async () => {
      try {
        const usersData = await ApiClient.getUsers();
        setUsers(usersData);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getUsers();
  }, []);

  const handleClick = async (userId: number) => {
    const response = await ApiClient.createChat(userId);
    navigate(`/chats/${response.id}`);
  };

  const handleAvatarClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  if (loading) return <ListSkeleton />;

  return (
    <div>
      <p className="mb-2">Select a user to chat with...</p>
      <div className="grid gap-y-2">
        {users.map((user) => (
          <Card
            key={user.id}
            className="flex items-center cursor-pointer"
            onClick={() => handleClick(user.id)}
          >
            <CardContent className="flex items-center gap-2 p-1">
              <Link to={`/profile/${user.id}`} onClick={handleAvatarClick}>
                <Avatar>
                  <AvatarImage src={user.avatar} alt={user.username} />
                  <AvatarFallback>
                    <UserRoundIcon />
                  </AvatarFallback>
                </Avatar>
              </Link>
              <span>{user.username}</span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Users;
