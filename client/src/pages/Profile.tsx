import ConfirmationModal from "@/components/ConfirmationModal";
import ProfileForm from "@/components/ProfileForm";
import SelectUsers from "@/components/SelectUsers";
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
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ApiClient from "@/helpers/ApiClient";
import { useAuth } from "@/helpers/AuthProvider";
import { HandleProfileSubmit, User } from "@/types";
import { CameraIcon, UserRoundIcon, UsersRoundIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";

const Profile = () => {
  const { user, updateUser } = useAuth();
  const location = useLocation();
  const isGroup = location.pathname.startsWith("/group");
  const { id } = useParams();
  const [activeInput, setActiveInput] = useState("");
  const [profile, setProfile] = useState<User | null>(null);
  const [groupMembers, setGroupMembers] = useState<User[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    if (!id || (!isGroup && user.id === +id)) {
      setProfile(user);
    } else if (!isGroup) {
      const getUser = async () => {
        const user = await ApiClient.getUser(id);
        setProfile(user);
      };
      getUser();
    } else {
      const getGroup = async () => {
        const group = await ApiClient.getGroup(id);
        setProfile({
          id: group.id || 0,
          username: group.name,
          bio: group.description,
          avatar: group.photo,
        });
        if (group.members) setGroupMembers(group.members);
      };
      getGroup();
    }
  }, [id, isGroup]);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length < 1) return;
    const photo = e.target.files[0];
    const photoFormData = new FormData();
    try {
      if (isGroup) {
        if (!id) return;
        photoFormData.append("photo", photo);
        const newGroup = await ApiClient.uploadGroupPhoto(id, photoFormData);
        setProfile({
          id: newGroup.id || 0,
          username: newGroup.name,
          bio: newGroup.description,
          avatar: newGroup.photo,
        });
        setActiveInput("");
      } else {
        photoFormData.append("avatar", photo);
        const newUser = await ApiClient.uploadAvatar(photoFormData);
        console.log("Avatar uploaded successfully");
        updateUser(newUser);
        setProfile(newUser);
        setActiveInput("");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleActivateInput = (type: string) => {
    setActiveInput(type === activeInput ? "" : type);
  };

  const handleSubmit: HandleProfileSubmit = async ({ username, bio }) => {
    if (username) {
      if (isGroup) {
        if (!id) return;
        const newGroup = await ApiClient.updateGroup(id, { name: username });
        setProfile((oldProfile) =>
          oldProfile ? { ...oldProfile, username: newGroup.name } : null,
        );
      } else {
        const newUser = await ApiClient.updateCurrentUser({ username });
        updateUser(newUser);
        setProfile(newUser);
      }
    } else if (bio !== undefined) {
      if (isGroup) {
        if (!id) return;
        const newGroup = await ApiClient.updateGroup(id, { description: bio });
        setProfile((oldProfile) =>
          oldProfile ? { ...oldProfile, bio: newGroup.description } : null,
        );
      } else {
        const newUser = await ApiClient.updateCurrentUser({ bio });
        updateUser(newUser);
        setProfile(newUser);
      }
    }
    setActiveInput("");
  };

  const handleMakeAdmin = async (user_id: number) => {
    if (!id) return;
    const updatedGroup = await ApiClient.makeUserGroupAdmin(id, user_id);
    if (updatedGroup.members) setGroupMembers(updatedGroup.members);
  };

  const handleRemoveMember = async (user_id: number) => {
    if (!id) return;
    const updatedGroup = await ApiClient.removeGroupMember(id, user_id);
    if (updatedGroup.members) setGroupMembers(updatedGroup.members);
  };

  const handleLeaveGroup = async () => {
    if (!id) return;
    await ApiClient.leaveGroup(id);
    navigate("/");
  };

  const handleFetchUsers = async () => {
    if (!id) return;
    const availableUsers = await ApiClient.getUsers(id);
    setUsers(availableUsers);
  };

  const handleAddUserSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!id) return;
    const updatedGroup = await ApiClient.addUsersToGroup(id, selectedUserIds);
    if (updatedGroup.members) setGroupMembers(updatedGroup.members);
  };

  const isEditable =
    (isGroup &&
      user?.id &&
      groupMembers
        .reduce(
          (admins: number[], member) =>
            member?.is_admin ? [...admins, member.id] : admins,
          [],
        )
        .includes(user?.id)) ||
    (!isGroup && (!id || user?.id === +id));

  return (
    <div className="flex-grow">
      <div className="relative h-1/2 grid place-content-center">
        <Avatar className="w-56 h-56 mx-auto md:w-96 md:h-96">
          <AvatarImage src={profile?.avatar} alt={profile?.username} />
          <AvatarFallback>
            {isGroup ? (
              <UsersRoundIcon className="w-4/6 h-5/6 scale-110 stroke-1" />
            ) : (
              <UserRoundIcon className="w-5/6 h-5/6 scale-110 stroke-1" />
            )}
          </AvatarFallback>
        </Avatar>
        {isEditable && (
          <Label className="absolute left-1/2 translate-x-10 top-1/2 translate-y-14 md:translate-x-16 md:translate-y-28 bg-blue-400 p-4 rounded-full cursor-pointer">
            <CameraIcon className="w-7 h-7 md:w-12 md:h-12" />
            <Input
              className="hidden"
              type="file"
              id="avatar"
              name="avatar"
              accept="image/*"
              multiple={false}
              onChange={handleAvatarChange}
            />
          </Label>
        )}
      </div>
      <ProfileForm
        type={isGroup ? "group" : "user"}
        fieldType="username"
        defaultValue={{ username: profile?.username ?? "" }}
        activeInput={activeInput}
        handleActivateInput={handleActivateInput}
        isEditable={isEditable}
        handleSubmit={handleSubmit}
      />
      <ProfileForm
        type={isGroup ? "group" : "user"}
        fieldType="bio"
        defaultValue={{ bio: profile?.bio ?? "" }}
        activeInput={activeInput}
        handleActivateInput={handleActivateInput}
        isEditable={isEditable}
        handleSubmit={handleSubmit}
      />
      {isGroup && (
        <div>
          {isEditable && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="mb-4" onClick={handleFetchUsers}>
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
                    className="my-4"
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
          <div className="grid gap-y-2">
            {groupMembers.map((member) => (
              <Card key={member.id} className="w-full">
                <CardContent className="flex flex-wrap md:grid md:grid-cols-2 items-center gap-x-2 p-2 px-4 md:p-1">
                  <div className="flex items-center gap-2">
                    <Link to={`/profile/${member.id}`}>
                      <Avatar>
                        <AvatarImage
                          src={member.avatar}
                          alt={member.username}
                        />
                        <AvatarFallback>
                          <UserRoundIcon />
                        </AvatarFallback>
                      </Avatar>
                    </Link>
                    <span>{member.username}</span>
                  </div>
                  <div
                    className={`${member.is_admin ? "" : "w-full"} grid grid-cols-2 place-items-center`}
                  >
                    {member.is_admin && (
                      <Badge className="my-2 col-span-2">Admin</Badge>
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
            className="my-4"
            onConfirm={handleLeaveGroup}
          />
        </div>
      )}
    </div>
  );
};

export default Profile;
