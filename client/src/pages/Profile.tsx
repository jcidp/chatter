import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import ApiClient from "@/helpers/ApiClient";
import { useAuth } from "@/helpers/AuthProvider";
import { User } from "@/types";
import {
  CameraIcon,
  CheckIcon,
  PencilIcon,
  UserRoundIcon,
  UsersRoundIcon,
  XIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";

const Profile = () => {
  const { user, updateUser } = useAuth();
  const location = useLocation();
  const isGroup = location.pathname.startsWith("/group");
  const { id } = useParams();
  const [activeInput, setActiveInput] = useState("");
  const [username, setUsername] = useState(user?.username);
  const [bio, setBio] = useState(user?.bio);
  const [profile, setProfile] = useState<User | null>(null);
  const [groupMembers, setGroupMembers] = useState<User[]>([]);

  useEffect(() => {
    if (!user) return;
    if (!id || (!isGroup && user.id === +id)) {
      setProfile(user);
      setUsername(user.username);
      setBio(user.bio);
    } else if (!isGroup) {
      const getUser = async () => {
        const user = await ApiClient.getUser(id);
        setProfile(user);
        setUsername(user.username);
        setBio(user.bio);
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
        setUsername(group.name);
        setBio(group.description);
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

  const handleUpdate = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const type = e.target.id;
    if (type === "username") setUsername(e.target.value);
    else if (type === "bio") setBio(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!(e.target instanceof HTMLFormElement)) return;
    if (e.target.dataset.type === "username") {
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
    } else if (e.target.dataset.type === "bio") {
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
    const response = await ApiClient.makeUserGroupAdmin(id, user_id);
    if (response.members) setGroupMembers(response.members);
  };

  const handleRemoveMember = async (user_id: number) => {
    if (!id) return;
    const response = await ApiClient.removeGroupMember(id, user_id);
    console.log(response);
    if (response.members) setGroupMembers(response.members);
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
      <form className="mt-8" data-type="username" onSubmit={handleSubmit}>
        <span>
          <strong>{isGroup ? "Name" : "Username"}:</strong>
        </span>
        {activeInput === "username" ? (
          <>
            <button type="submit">
              <CheckIcon className="inline cursor-pointer mx-2 stroke-green-700" />
            </button>
            <XIcon
              className="inline cursor-pointer stroke-red-700"
              onClick={() => handleActivateInput("username")}
            />
            <Input
              className="mt-2"
              type="text"
              id="username"
              autoFocus
              value={username}
              onChange={handleUpdate}
            />
          </>
        ) : (
          <>
            {isEditable && (
              <PencilIcon
                className="inline w-5 mx-2 cursor-pointer"
                onClick={() => handleActivateInput("username")}
              />
            )}
            <p className="mt-2 mb-8">{profile?.username}</p>
          </>
        )}
      </form>
      <form className="my-4" data-type="bio" onSubmit={handleSubmit}>
        <span>
          <strong>{isGroup ? "Description" : "Bio"}:</strong>
        </span>
        {activeInput === "bio" ? (
          <>
            <button type="submit">
              <CheckIcon className="inline cursor-pointer mx-1 stroke-green-700" />
            </button>
            <XIcon
              className="inline cursor-pointer stroke-red-700"
              onClick={() => handleActivateInput("bio")}
            />
            <Textarea
              className="mt-2"
              id="bio"
              autoFocus
              value={bio}
              onChange={handleUpdate}
            />
          </>
        ) : (
          <>
            {isEditable && (
              <PencilIcon
                className="inline w-5 mx-2 cursor-pointer"
                onClick={() => handleActivateInput("bio")}
              />
            )}
            <p className="mt-2 mb-8">{profile?.bio || "(Empty)"}</p>
          </>
        )}
      </form>
      {isGroup && (
        <div>
          {isEditable && <Button className="mb-4">+ Add members</Button>}
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
                        <Button
                          variant="ghost"
                          onClick={() => handleMakeAdmin(member.id)}
                        >
                          Make admin
                        </Button>
                        <Button
                          variant="ghost"
                          className="hover:bg-destructive/90 hover:text-background"
                          onClick={() => handleRemoveMember(member.id)}
                        >
                          Remove
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <Button variant="destructive" className="my-4">
            Leave group
          </Button>
        </div>
      )}
    </div>
  );
};

export default Profile;
