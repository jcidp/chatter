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
  id: number;
  created_at: string;
  user_id: number;
  chat_id: string;
  text?: string;
  image?: string;
  author: string;
}

interface Group {
  id?: number;
  name: string;
  description?: string;
  user_ids: number[];
  members?: User[];
  photo?: string;
}

interface ChatMessages {
  chatId: string;
  messages: Message[];
}

interface CableData {
  chat_id?: string;
  message?: Message;
  chat?: ChatI;
}

interface LoginParams {
  email: string;
  password: string;
}

interface SignUpParams extends LoginParams {
  username: string;
  confirmPassword: string;
}

type SignUp = (signUpParams: SignUpParams) => Promise<void>;
type Login = (loginParams: LoginParams) => Promise<void>;

interface HandleProfileSubmitParams {
  username?: string;
  bio?: string;
}

type HandleProfileSubmit = (
  handleProfileSubmitParams: HandleProfileSubmitParams,
) => Promise<void>;

export type {
  User,
  ChatI,
  Message,
  Group,
  ChatMessages,
  CableData,
  SignUp,
  Login,
  HandleProfileSubmit,
};
