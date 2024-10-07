import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ApiClient from "@/helpers/ApiClient";
import { useAuth } from "@/helpers/AuthProvider";
import { useState } from "react";

const Profile = () => {
  const { user, updateAvatar } = useAuth();
  const [avatar, setAvatar] = useState<File | null>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const newAvatar = e.target.files[0];
    setAvatar(newAvatar);
  };

  const handleAvatarSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // if (!(e.target instanceof HTMLFormElement)) return;
    // const formData = new FormData(e.target);
    // console.log("FormData", formData.get("avatar"));
    if (!avatar) return;
    const avatarFormData = new FormData();
    avatarFormData.append("avatar", avatar);
    try {
      const response = await ApiClient.uploadAvatar(avatarFormData);
      console.log("Avatar uploaded successfully:", response);
      updateAvatar(response.avatar);
    } catch (error) {
      console.error("Error uploading avatar:", error);
    }
  };

  return (
    <div>
      <div className="relative">
        <Avatar className="w-52 h-52 mx-auto">
          <AvatarImage src={user?.avatar} alt={user?.username} />
          <AvatarFallback>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              version="1.1"
              id="Capa_1"
              x="0px"
              y="0px"
              viewBox="0 0 512 512"
              width="208"
              height="208"
            >
              <g>
                <circle cx="256" cy="128" r="128" />
                <path d="M256,298.667c-105.99,0.118-191.882,86.01-192,192C64,502.449,73.551,512,85.333,512h341.333   c11.782,0,21.333-9.551,21.333-21.333C447.882,384.677,361.99,298.784,256,298.667z" />
              </g>
            </svg>
          </AvatarFallback>
        </Avatar>
        <div className="absolute right-1/2 translate-x-24 bottom-0 bg-blue-400 p-4 rounded-full cursor-pointer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            id="Outline"
            viewBox="0 0 24 24"
            width="24"
            height="24"
          >
            <path d="M19,4h-.508L16.308,1.168A3.023,3.023,0,0,0,13.932,0H10.068A3.023,3.023,0,0,0,7.692,1.168L5.508,4H5A5.006,5.006,0,0,0,0,9V19a5.006,5.006,0,0,0,5,5H19a5.006,5.006,0,0,0,5-5V9A5.006,5.006,0,0,0,19,4ZM9.276,2.39A1.006,1.006,0,0,1,10.068,2h3.864a1.008,1.008,0,0,1,.792.39L15.966,4H8.034ZM22,19a3,3,0,0,1-3,3H5a3,3,0,0,1-3-3V9A3,3,0,0,1,5,6H19a3,3,0,0,1,3,3Z" />
            <path d="M12,8a6,6,0,1,0,6,6A6.006,6.006,0,0,0,12,8Zm0,10a4,4,0,1,1,4-4A4,4,0,0,1,12,18Z" />
          </svg>
        </div>
      </div>
      <form className="mx-auto" onSubmit={handleAvatarSubmit}>
        <Label htmlFor="avatar">New photo</Label>
        <Input
          className="mx-auto"
          type="file"
          id="avatar"
          name="avatar"
          accept="image/*"
          multiple={false}
          onChange={handleAvatarChange}
        />
        <Button disabled={!avatar}>
          {user?.avatar ? "Change photo" : "Upload photo"}
        </Button>
      </form>
      <p className="mt-8">
        <span>Username: {user?.username}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          id="Outline"
          viewBox="0 0 24 24"
          className="inline mx-4 cursor-pointer"
          width="14"
          height="14"
        >
          <path d="M22.853,1.148a3.626,3.626,0,0,0-5.124,0L1.465,17.412A4.968,4.968,0,0,0,0,20.947V23a1,1,0,0,0,1,1H3.053a4.966,4.966,0,0,0,3.535-1.464L22.853,6.271A3.626,3.626,0,0,0,22.853,1.148ZM5.174,21.122A3.022,3.022,0,0,1,3.053,22H2V20.947a2.98,2.98,0,0,1,.879-2.121L15.222,6.483l2.3,2.3ZM21.438,4.857,18.932,7.364l-2.3-2.295,2.507-2.507a1.623,1.623,0,1,1,2.295,2.3Z" />
        </svg>
      </p>
      <p className="my-4">
        Bio: {user?.bio || "(No bio)"}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          id="Outline"
          viewBox="0 0 24 24"
          className="inline mx-4 cursor-pointer"
          width="14"
          height="14"
        >
          <path d="M22.853,1.148a3.626,3.626,0,0,0-5.124,0L1.465,17.412A4.968,4.968,0,0,0,0,20.947V23a1,1,0,0,0,1,1H3.053a4.966,4.966,0,0,0,3.535-1.464L22.853,6.271A3.626,3.626,0,0,0,22.853,1.148ZM5.174,21.122A3.022,3.022,0,0,1,3.053,22H2V20.947a2.98,2.98,0,0,1,.879-2.121L15.222,6.483l2.3,2.3ZM21.438,4.857,18.932,7.364l-2.3-2.295,2.507-2.507a1.623,1.623,0,1,1,2.295,2.3Z" />
        </svg>
      </p>
    </div>
  );
};

export default Profile;
