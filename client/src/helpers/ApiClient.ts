import axios, { AxiosInstance, AxiosResponse } from "axios";
import { ChatI, Message, User } from "../types";
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

  public async getUsers() {
    const response: AxiosResponse = await this.axiosInstance.get("/users");
    return response.data;
  }

  public async getUser(id: string): Promise<User> {
    const response: AxiosResponse = await this.axiosInstance.get(
      `/users/${id}`,
    );
    return response.data;
  }

  public async createChat(userId: number) {
    const response: AxiosResponse = await this.axiosInstance.post("/chats", {
      user_id: userId,
    });
    return response.data;
  }

  public async uploadAvatar(avatarFormData: FormData) {
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

  public async updateCurrentUser(payload: { username?: string; bio?: string }) {
    const response: AxiosResponse = await this.axiosInstance.put(
      "/current_user",
      payload,
    );
    return response.data;
  }
}

export default ApiClient.getInstance();
