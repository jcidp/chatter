import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import ApiClient from "@/helpers/ApiClient";
import { User } from "@/types";
import { useEffect, useState } from "react";

const Users = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const usersData = await ApiClient.getUsers();
        console.log(usersData);
        setUsers(usersData);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    getUsers();
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    console.log(e.target);
  };

  if (isLoading) return <h1>Loading...</h1>;

  return (
    <div>
      <p className="mb-2">Select a user to chat with...</p>
      <div className="grid gap-y-2">
        {users.map((user) => (
          <Card
            key={user.id}
            className="flex items-center"
            onClick={handleClick}
          >
            <CardContent className="flex items-center gap-2 p-1">
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <span>{user.username}</span>
              <span>{user.email}</span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Users;
