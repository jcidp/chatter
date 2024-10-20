interface User {
  id: number;
  email: string;
  username: string;
  avatar?: string;
  bio?: string;
}

interface ChatI {
  id: string;
  name: string;
  image: string;
  profile_id: number;
  messages?: Message[];
  last_message?: Omit<Message, "user_id">;
}

interface Message {
  created_at: string;
  user_id: number;
  text?: string;
  image?: string;
}

interface Group {
  name: string;
  description?: string;
  user_ids: number[];
  photo?: string;
}

export type { User, ChatI, Message, Group };
