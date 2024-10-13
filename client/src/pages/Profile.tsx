import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import ApiClient from "@/helpers/ApiClient";
import { useAuth } from "@/helpers/AuthProvider";
import { User } from "@/types";
import { CameraIcon, CheckIcon, PencilIcon, XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Profile = () => {
  const { user, updateUser } = useAuth();
  const { id } = useParams();
  const [activeInput, setActiveInput] = useState("");
  const [username, setUsername] = useState(user?.username);
  const [bio, setBio] = useState(user?.bio);
  const [profile, setProfile] = useState<User | null>(null);

  useEffect(() => {
    if (!user) return;
    if (!id || user.id === +id) {
      setProfile(user);
      setUsername(user.username);
      setBio(user.bio);
    } else {
      const getUser = async () => {
        const user = await ApiClient.getUser(id);
        setProfile(user);
        setUsername(user.username);
        setBio(user.bio);
      };
      getUser();
    }
  }, [id]);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length < 1) return;
    const avatar = e.target.files[0];
    const avatarFormData = new FormData();
    avatarFormData.append("avatar", avatar);
    try {
      const newUser = await ApiClient.uploadAvatar(avatarFormData);
      console.log("Avatar uploaded successfully");
      updateUser(newUser);
      setProfile(newUser);
      setActiveInput("");
    } catch (error) {
      console.error("Error uploading avatar:", error);
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
      const newUser = await ApiClient.updateCurrentUser({ username });
      updateUser(newUser);
    } else if (e.target.dataset.type === "bio") {
      const newUser = await ApiClient.updateCurrentUser({ bio });
      updateUser(newUser);
    }
    setActiveInput("");
  };

  return (
    <div className="flex-grow">
      <div className="relative h-1/2 grid place-content-center">
        <Avatar className="w-56 h-56 mx-auto md:w-96 md:h-96">
          <AvatarImage src={profile?.avatar} alt={profile?.username} />
          <AvatarFallback>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              version="1.1"
              id="Capa_1"
              x="0px"
              y="0px"
              viewBox="0 0 512 512"
            >
              <g>
                <circle cx="256" cy="128" r="128" />
                <path d="M256,298.667c-105.99,0.118-191.882,86.01-192,192C64,502.449,73.551,512,85.333,512h341.333   c11.782,0,21.333-9.551,21.333-21.333C447.882,384.677,361.99,298.784,256,298.667z" />
              </g>
            </svg>
          </AvatarFallback>
        </Avatar>
        {(!id || user?.id === +id) && (
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
          <strong>Username:</strong>
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
            {(!id || user?.id === +id) && (
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
          <strong>Bio:</strong>
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
            {(!id || user?.id === +id) && (
              <PencilIcon
                className="inline w-5 mx-2 cursor-pointer"
                onClick={() => handleActivateInput("bio")}
              />
            )}
            <p className="mt-2 mb-8">{profile?.bio || "(No bio)"}</p>
          </>
        )}
      </form>
    </div>
  );
};

export default Profile;
