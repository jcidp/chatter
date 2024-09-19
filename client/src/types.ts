interface User {
  email: string;
  username: string;
}

interface Chat {
  id: string;
  name: string;
  messages?: Message[];
}

interface Message {
  created_at: string;
  author: string;
  text: string;
}

export type { User, Chat };
