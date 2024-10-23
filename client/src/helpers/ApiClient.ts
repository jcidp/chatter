import axios, { AxiosInstance, AxiosResponse } from "axios";
import { ChatI, Group, Message, User } from "../types";
import ActionCableManager from "./ActionCableManager";

const TOKEN_KEY = "auth_token";

class ApiClient {
  private static instance: ApiClient;
  private axiosInstance: AxiosInstance;

  private constructor() {
    this.axiosInstance = axios.create({
      baseURL: "/api",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      this.setAuthHeader(token);
    }
  }

  public setInterceptors(handleUnauthorized: () => void) {
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          this.clearToken();
          handleUnauthorized();
        }
        return Promise.reject(error);
      },
    );
  }

  public static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  private setAuthHeader(token: string): void {
    this.axiosInstance.defaults.headers.common["Authorization"] =
      `Bearer ${token}`;
  }

  private setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
    this.setAuthHeader(token);
    ActionCableManager.setToken(token);
  }

  private clearToken(): void {
    localStorage.removeItem(TOKEN_KEY);
    delete this.axiosInstance.defaults.headers.common["Authorization"];
    ActionCableManager.clearToken();
  }

  public async signUp(
    email: string,
    password: string,
    passwordConfirmation: string,
  ): Promise<User> {
    const response: AxiosResponse = await this.axiosInstance.post("sign_up", {
      email,
      password,
      passwordConfirmation,
    });
    const user = response.data;
    if (!response.headers) throw Error("No headers");
    const token = response.headers.get("X-Session-Token");
    this.setToken(token);
    return user;
  }

  public async login(email: string, password: string): Promise<User> {
    const response: AxiosResponse = await this.axiosInstance.post("/login", {
      email,
      password,
    });
    const user = response.data;
    if (!response.headers) throw Error("No headers");
    const token = response.headers.get("X-Session-Token");
    this.setToken(token);
    return user;
  }

  public async logout(): Promise<void> {
    await this.axiosInstance.delete("/logout");
    this.clearToken();
  }

  public async getCurrentUser(): Promise<User> {
    const response: AxiosResponse =
      await this.axiosInstance.get("/current_user");
    return response.data;
  }

  public async getChats(): Promise<ChatI[]> {
    const response: AxiosResponse = await this.axiosInstance.get("/chats");
    return response.data;
  }

  public async getChat(id: string): Promise<ChatI> {
    const response: AxiosResponse = await this.axiosInstance.get(
      `/chats/${id}`,
    );
    return response.data;
  }

  public async postMessage(formData: FormData) {
    const response: AxiosResponse = await this.axiosInstance.post(
      "/messages",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  }

  public async getUsers(group_id: string | undefined = ""): Promise<User[]> {
    const optionalPath = group_id ? `/group/${group_id}` : "";
    const response: AxiosResponse = await this.axiosInstance.get(
      `/users${optionalPath}`,
    );
    return response.data;
  }

  public async getUser(id: string): Promise<User> {
    const response: AxiosResponse = await this.axiosInstance.get(
      `/users/${id}`,
    );
    return response.data;
  }

  public async createChat(userId: number): Promise<ChatI> {
    const response: AxiosResponse = await this.axiosInstance.post("/chats", {
      user_id: userId,
    });
    return response.data;
  }

  public async uploadAvatar(avatarFormData: FormData): Promise<User> {
    const response: AxiosResponse = await this.axiosInstance.put(
      "/avatar",
      avatarFormData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  }

  public async updateCurrentUser(payload: {
    username?: string;
    bio?: string;
  }): Promise<User> {
    const response: AxiosResponse = await this.axiosInstance.put(
      "/current_user",
      payload,
    );
    return response.data;
  }

  public async createGroup(group: Group): Promise<ChatI> {
    const response: AxiosResponse = await this.axiosInstance.post(
      "/groups",
      group,
    );
    return response.data;
  }

  public async getGroup(id: string): Promise<Group> {
    const response: AxiosResponse = await this.axiosInstance.get(
      `/groups/${id}`,
    );
    return response.data;
  }

  public async updateGroup(
    id: string,
    payload: {
      name?: string;
      description?: string;
    },
  ): Promise<Group> {
    const response: AxiosResponse = await this.axiosInstance.put(
      `/groups/${id}`,
      payload,
    );
    return response.data;
  }

  public async uploadGroupPhoto(
    id: string,
    photoFormData: FormData,
  ): Promise<Group> {
    const response: AxiosResponse = await this.axiosInstance.put(
      `/groups/${id}/photo`,
      photoFormData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  }

  public async makeUserGroupAdmin(id: string, user_id: number): Promise<Group> {
    const response: AxiosResponse = await this.axiosInstance.post(
      `/groups/${id}/admins/${user_id}`,
    );
    return response.data;
  }

  public async removeGroupMember(id: string, user_id: number): Promise<Group> {
    const response: AxiosResponse = await this.axiosInstance.delete(
      `/groups/${id}/members/${user_id}`,
    );
    return response.data;
  }

  public async leaveGroup(id: string) {
    const response: AxiosResponse = await this.axiosInstance.delete(
      `/groups/${id}/members`,
    );
    return response.data;
  }

  public async addUsersToGroup(id: string, user_ids: number[]): Promise<Group> {
    const response: AxiosResponse = await this.axiosInstance.post(
      `/groups/${id}/members`,
      { user_ids },
    );
    return response.data;
  }
}

export default ApiClient.getInstance();
