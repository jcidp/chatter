import { Link, useNavigate } from "react-router-dom";
import SelectUsers from "./SelectUsers";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { UserRoundIcon } from "lucide-react";
import { Badge } from "./ui/badge";
import ConfirmationModal from "./ConfirmationModal";
import { useState } from "react";
import ApiClient from "@/helpers/ApiClient";
import { User } from "@/types";
import { useAuth } from "@/helpers/AuthProvider";

interface GroupDetailsProps {
  groupId?: string;
  isEditable: boolean;
  groupMembers: User[];
  setGroupMembers: React.Dispatch<React.SetStateAction<User[]>>;
}

const GroupDetails = ({
  groupId,
  isEditable,
  groupMembers,
  setGroupMembers,
}: GroupDetailsProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleMakeAdmin = async (user_id: number) => {
    if (!groupId) return;
    const updatedGroup = await ApiClient.makeUserGroupAdmin(groupId, user_id);
    if (updatedGroup.members) setGroupMembers(updatedGroup.members);
  };

  const handleRemoveMember = async (user_id: number) => {
    if (!groupId) return;
    const updatedGroup = await ApiClient.removeGroupMember(groupId, user_id);
    if (updatedGroup.members) setGroupMembers(updatedGroup.members);
  };

  const handleLeaveGroup = async () => {
    if (!groupId) return;
    await ApiClient.leaveGroup(groupId);
    navigate("/");
  };

  const handleFetchUsers = async () => {
    if (!groupId) return;
    const availableUsers = await ApiClient.getUsers(groupId);
    setUsers(availableUsers);
  };

  const handleAddUserSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!groupId) return;
    const updatedGroup = await ApiClient.addUsersToGroup(
      groupId,
      selectedUserIds,
    );
    if (updatedGroup.members) setGroupMembers(updatedGroup.members);
  };

  return (
    <div>
      {isEditable && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button className="mb-4 w-full md:w-fit" onClick={handleFetchUsers}>
              + Add members
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <form onSubmit={handleAddUserSubmit}>
              <AlertDialogHeader>
                <AlertDialogTitle>Select users to add</AlertDialogTitle>
                <AlertDialogDescription>
                  Users selected ({selectedUserIds.length})
                </AlertDialogDescription>
              </AlertDialogHeader>
              <SelectUsers
                className="my-4 max-h-64"
                users={users}
                selectedUserIds={selectedUserIds}
                setSelectedUserIds={setSelectedUserIds}
              />
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  type="submit"
                  disabled={!selectedUserIds.length}
                >
                  Add users
                </AlertDialogAction>
              </AlertDialogFooter>
            </form>
          </AlertDialogContent>
        </AlertDialog>
      )}
      <div className="grid gap-y-2 max-h-[50dvh] overflow-y-auto">
        {groupMembers.map((member) => (
          <Card key={member.id} className="w-full">
            <CardContent className="flex flex-wrap md:grid md:grid-cols-[1fr_max-content] items-center p-2 px-4 md:p-1">
              <div className="flex items-center gap-2">
                <Link to={`/profile/${member.id}`}>
                  <Avatar>
                    <AvatarImage src={member.avatar} alt={member.username} />
                    <AvatarFallback>
                      <UserRoundIcon />
                    </AvatarFallback>
                  </Avatar>
                </Link>
                <span>
                  {member.id === user?.id ? "(You)" : member.username}
                </span>
              </div>
              <div
                className={`ml-auto ${member.is_admin ? "" : "ml-0 grid grid-cols-2 w-full"}`}
              >
                {member.is_admin && (
                  <Badge
                    variant="secondary"
                    className="my-2 col-span-2 md:mx-4"
                  >
                    Admin
                  </Badge>
                )}
                {isEditable && !member.is_admin && (
                  <>
                    <ConfirmationModal
                      triggerText="Make admin"
                      variant="ghost"
                      onConfirm={() => handleMakeAdmin(member.id)}
                    />

                    <ConfirmationModal
                      triggerText="Remove"
                      variant="ghost"
                      className="hover:bg-destructive/90 hover:text-background"
                      onConfirm={() => handleRemoveMember(member.id)}
                    />
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <ConfirmationModal
        triggerText="Leave group"
        variant="destructive"
        className="my-4 w-full md:w-fit"
        onConfirm={handleLeaveGroup}
      />
    </div>
  );
};

export default GroupDetails;
