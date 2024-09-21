import axios, { AxiosInstance, AxiosResponse } from "axios";
import { ChatI, User } from "../types";

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

    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          this.clearToken();
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

  public setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
    this.setAuthHeader(token);
  }

  public clearToken(): void {
    localStorage.removeItem(TOKEN_KEY);
    delete this.axiosInstance.defaults.headers.common["Authorization"];
  }

  public async signUp(
    email: string,
    password: string,
    passwordConfirmation: string,
  ): Promise<User> {
    try {
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
    } catch (error) {
      throw error;
    }
  }

  public async login(email: string, password: string): Promise<User> {
    try {
      const response: AxiosResponse = await this.axiosInstance.post("/login", {
        email,
        password,
      });
      const user = response.data;
      if (!response.headers) throw Error("No headers");
      const token = response.headers.get("X-Session-Token");
      this.setToken(token);
      return user;
    } catch (error) {
      throw error;
    }
  }

  public async logout(): Promise<void> {
    try {
      await this.axiosInstance.delete("/logout");
      this.clearToken();
    } catch (error) {
      throw error;
    }
  }

  public async getCurrentUser(): Promise<User> {
    try {
      const response: AxiosResponse =
        await this.axiosInstance.get("/current_user");
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async getChats(): Promise<ChatI[]> {
    try {
      const response: AxiosResponse = await this.axiosInstance.get("/chats");
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async getChat(id: string): Promise<ChatI> {
    try {
      const response: AxiosResponse = await this.axiosInstance.get(
        `/chats/${id}`,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default ApiClient.getInstance();
