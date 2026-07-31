import { io, Socket } from "socket.io-client";

export class SocketService {
  private static instance: SocketService | null = null;
  private socket: Socket | null = null;
  private readonly url: string;

  private constructor() {
    this.url = process.env["NEXT_PUBLIC_SERVER_URL"]!;
  }

  // Purely internal method to handle the Singleton instance
  private static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  /**
   * Main entry point. Automatically initializes the connection
   * if it does not exist, then returns the active socket.
   */
  public static getSocket(): Socket {
    const service = SocketService.getInstance();

    if (!service.socket) {
      // 1. Fetch the token from localStorage securely on the client side
      const token =
        typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

      service.socket = io(service.url, {
        autoConnect: true,
        reconnection: true,
        // 2. Pass the token directly inside the auth object
        auth: {
          token: token ? `Bearer ${token}` : undefined,
        },
      });
    }

    return service.socket;
  }

  /**
   * Closes the active connection and completely resets the instance.
   */
  public static disconnect(): void {
    const service = SocketService.instance;
    if (service && service.socket) {
      service.socket.disconnect();
      service.socket = null;
    }
  }
}
