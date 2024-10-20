import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import ApiClient from "@/helpers/ApiClient";
import { Group, User } from "@/types";
import { CheckedState } from "@radix-ui/react-checkbox";
import { UserRoundIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const NewGroup = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getUsers = async () => {
      try {
        const usersData = await ApiClient.getUsers();
        setUsers(usersData);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    getUsers();
  }, []);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setDescription(e.target.value);
  };

  const handleAvatarClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleCheck = (checked: CheckedState, id: number) => {
    if (checked) setSelectedUserIds((ids) => [...ids, id]);
    else
      setSelectedUserIds((ids) => ids.filter((current_id) => current_id != id));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const group: Group = {
      name,
      description,
      user_ids: selectedUserIds,
    };
    const response = await ApiClient.createGroup(group);
    if (response) navigate(`/chats/${response.id}`);
  };

  if (isLoading) return <h1>Loading...</h1>;

  return (
    <div>
      <h2 className="text-2xl">New group</h2>
      <form onSubmit={handleSubmit}>
        <Label>
          Name:
          <Input id="name" autoFocus onChange={handleNameChange} />
        </Label>
        <Label>
          Description:
          <Textarea id="description" onChange={handleDescriptionChange} />
        </Label>
        <p className="mt-4 mb-2">
          Add users to the group... ({selectedUserIds.length})
        </p>
        <div className="grid gap-y-2">
          {users.map((user) => (
            <div
              className="grid grid-cols-[min-content_1fr] gap-x-2 items-center"
              key={user.id}
            >
              <Checkbox
                id={`checkbox-${user.id}`}
                checked={selectedUserIds.includes(user.id)}
                onCheckedChange={(checked) => handleCheck(checked, user.id)}
              />
              <Label htmlFor={`checkbox-${user.id}`}>
                <Card className="flex items-center cursor-pointer">
                  <CardContent className="flex items-center gap-2 p-1">
                    <Link
                      to={`/profile/${user.id}`}
                      onClick={handleAvatarClick}
                    >
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
              </Label>
            </div>
          ))}
        </div>
        <Button
          className="mt-4 w-full"
          disabled={!name || !selectedUserIds.length}
        >
          Create
        </Button>
      </form>
    </div>
  );
};

export default NewGroup;
