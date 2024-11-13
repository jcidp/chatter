import GroupDetails from "@/components/GroupDetails";
import ProfileForm from "@/components/ProfileForm";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ApiClient from "@/helpers/ApiClient";
import { useAuth } from "@/helpers/AuthProvider";
import { HandleProfileSubmit, User } from "@/types";
import { CameraIcon, UserRoundIcon, UsersRoundIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";

const Profile = () => {
  const { user, updateUser } = useAuth();
  const location = useLocation();
  const isGroup = location.pathname.startsWith("/group");
  const { id } = useParams();
  const [activeInput, setActiveInput] = useState("");
  const [profile, setProfile] = useState<User | null>(null);
  const [groupMembers, setGroupMembers] = useState<User[]>([]);

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
        <GroupDetails
          groupId={id}
          isEditable={isEditable}
          groupMembers={groupMembers}
          setGroupMembers={setGroupMembers}
        />
      )}
    </div>
  );
};

export default Profile;
