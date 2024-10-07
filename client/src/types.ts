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
  messages?: Message[];
}

interface Message {
  created_at: string;
  user_id: number;
  text: string;
}

export type { User, ChatI, Message };
