import jwtDecode from "jwt-decode";
import {
  ACCESS_TOKEN_NAME,
  AGENT,
} from "../../../common/globals/common.constants";
import { AgentDetails, AuthModel, JWTTokenPayload } from "../models/auth.model";

class AuthTokenService {
  static setTokenInLocalStorage(auth: AuthModel): boolean {
    if (auth && auth.data.jwtToken) {
      localStorage.setItem(ACCESS_TOKEN_NAME, auth.data.jwtToken);
      localStorage.setItem(AGENT, JSON.stringify(auth.data.appAgentAccDetails));
      return true;
    }
    return false;
  }

  static clearTokenFromLocalStorage(): boolean {
    localStorage.removeItem(ACCESS_TOKEN_NAME);
    localStorage.removeItem(AGENT);
    return true;
  }

  static getTokenFromLocalStorage(): string | undefined {
    try {
      const token = localStorage.getItem(ACCESS_TOKEN_NAME);
      if (!token) {
        return undefined;
      }
      return token;
    } catch (error) {
      return undefined;
    }
  }

  static decodeToken(): JWTTokenPayload | null {
    try {
      const token = this.getTokenFromLocalStorage();
      if (token) {
        const decodedToken: JWTTokenPayload = jwtDecode(token);
        return decodedToken;
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  static getAgentDetailsFromLocalStorage(): AgentDetails | undefined {
    try {
      const agentDetails = localStorage.getItem(AGENT);
      if (!agentDetails) {
        return undefined;
      }
      return JSON.parse(agentDetails);
    } catch (error) {
      return undefined;
    }
  }

  static verifyAuthToken(): string | null {
    try {
      const token = this.getTokenFromLocalStorage();
      if (token) {
        const decodedJWT: any = jwtDecode(token);
        return decodedJWT;
      }
      return null;
    } catch (error) {
      return null;
    }
  }
}

export { AuthTokenService };
