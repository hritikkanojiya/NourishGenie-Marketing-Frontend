import * as io from "socket.io-client";
import { Socket } from "socket.io-client";
import { AuthTokenService } from "../../modules/auth/services/authToken.service";
import { showToast } from "../toastify/toastify.config";
import {
  GENIE_MARKETING_SOCKET,
  SOCKET_TOKEN_HEADER,
} from "../globals/common.constants";
import { AgentDetails } from "../../modules/auth/models/auth.model";
import { AppActivity } from "../../modules/agents/models/app_agent.model";
import { AuthService } from "../../modules/auth/services/auth.service";

class SocketService {
  public static socket: Socket;

  public static connectedAgents: AgentDetails[] = [];

  public static activityLogs: AppActivity[] = [];

  static setupSocketConnection() {
    const agentDetails = AuthTokenService.getAgentDetailsFromLocalStorage();
    const accessToken = AuthTokenService.getTokenFromLocalStorage();
    if (!agentDetails || !accessToken) {
      showToast("Socket connection failed!!!", "error");
      return;
    }
    this.socket = io.connect(GENIE_MARKETING_SOCKET, {
      extraHeaders: {
        [SOCKET_TOKEN_HEADER]: `Bearer ${accessToken}`,
      },
    });

    this.socket.on("connect", () => {
      showToast("Socket Connected", "success");
    });

    this.socket.on("disconnect", () => {
      showToast("Socket Disconnected", "error");
    });

    this.socket.on("forceLogout", () => {
      AuthService.logout();
    });
  }

  static closeSocketConnection() {
    if (this.socket) {
      if (this.socket?.active) this.socket.disconnect();
    }
  }

  static reSetupSocketConnection() {
    if (this.socket) {
      this.closeSocketConnection();
      this.setupSocketConnection();
    }
  }
}

export { SocketService };
