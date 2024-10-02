import { createConsumer, Subscription } from "@rails/actioncable";

const TOKEN_KEY = "auth_token";

class ActionCableManager {
  private static instance: ActionCableManager;
  private consumer: any;

  private constructor() {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      this.connect(token);
    }
  }

  public static getInstance(): ActionCableManager {
    if (!ActionCableManager.instance) {
      ActionCableManager.instance = new ActionCableManager();
    }
    return ActionCableManager.instance;
  }

  public setToken(token: string) {
    this.disconnect();
    this.connect(token);
  }

  public clearToken() {
    this.disconnect();
  }

  private connect(token: string) {
    if (token) {
      console.log("Connecting...");
      this.consumer = createConsumer(
        `ws://localhost:3001/cable?token=${token}`,
      );
    }
  }

  private disconnect() {
    if (this.consumer) {
      console.log("Disconnecting...");
      this.consumer.disconnect();
    }
  }

  public subscribeToChannel(
    identifier: { id: string; channel: string },
    params: object = {},
  ): Subscription {
    if (!this.consumer) {
      throw new Error(
        "ActionCable not connected. Make sure to set a token first.",
      );
    }
    console.log("Subscribing...");
    return this.consumer.subscriptions.create(identifier, params);
  }
}

export default ActionCableManager.getInstance();
