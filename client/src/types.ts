interface User {
  id: number;
  username: string;
  avatar?: string;
  bio?: string;
  is_admin?: boolean;
}

interface ChatI {
  id: string;
  name: string;
  image: string;
  profile_id: number;
  messages?: Message[];
  last_message?: Omit<Message, "user_id">;
  type: "profile" | "group";
}

interface Message {
  created_at: string;
  user_id: number;
  text?: string;
  image?: string;
}

interface Group {
  id?: number;
  name: string;
  description?: string;
  user_ids: number[];
  members?: User[];
  photo?: string;
}

export type { User, ChatI, Message, Group };
