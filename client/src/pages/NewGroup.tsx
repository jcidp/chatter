import SelectUsers from "@/components/SelectUsers";
import NewGroupSkeleton from "@/components/skeletons/NewGroupSkeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import ApiClient from "@/helpers/ApiClient";
import { Group, User } from "@/types";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const NewGroup = () => {
  const [loading, setLoading] = useState(true);
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
        setLoading(false);
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

  if (loading) return <NewGroupSkeleton />;

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
        <SelectUsers
          users={users}
          selectedUserIds={selectedUserIds}
          setSelectedUserIds={setSelectedUserIds}
        />
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
