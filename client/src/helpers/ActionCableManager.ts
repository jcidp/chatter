import { createConsumer, Subscription } from "@rails/actioncable";

const TOKEN_KEY = "auth_token";

class ActionCableManager {
  private static instance: ActionCableManager;
  private consumer: any;
  private token: string | null = null;

  private constructor() {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      this.setToken(token);
    }
  }

  public static getInstance(): ActionCableManager {
    if (!ActionCableManager.instance) {
      ActionCableManager.instance = new ActionCableManager();
    }
    return ActionCableManager.instance;
  }

  public setToken(token: string) {
    this.token = token;
    this.disconnect();
    this.connect();
  }

  public clearToken() {
    this.token = null;
    this.disconnect();
  }

  private connect() {
    if (this.token) {
      this.consumer = createConsumer(
        `ws://localhost:3001/cable?token=${this.token}`,
      );
    }
  }

  private disconnect() {
    if (this.consumer) {
      this.consumer.disconnect();
    }
  }

  public subscribeToChannel(
    channel: object = {},
    params: object = {},
  ): Subscription {
    if (!this.consumer) {
      throw new Error(
        "ActionCable not connected. Make sure to set a token first.",
      );
    }
    return this.consumer.subscriptions.create(channel, params);
  }
}

export default ActionCableManager.getInstance();
