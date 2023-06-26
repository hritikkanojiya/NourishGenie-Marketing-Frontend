import { httpClient } from "../../../common/axios/axios.config";
import { GENIE_MARKETING_API_VERSION } from "../../../common/globals/common.constants";
import { ErrorResponse } from "../../../common/globals/common.model";
import { SocketService } from "../../../common/services/socket.service";
import { AppAgentService } from "../../agents/services/app_agent.service";
import {
  AuthModel,
  ForceLogoutResponse,
  LogoutResponse,
  ResetPasswordResponse,
  UpdatedPasswordResponse,
  VerifyTokenResponse,
} from "../models/auth.model";
import { AuthTokenService } from "./authToken.service";

class AuthService {
  private static baseUrl = `/${GENIE_MARKETING_API_VERSION}/agent/auth`;

  static async login(
    email: string,
    password: string
  ): Promise<AuthModel | ErrorResponse> {
    try {
      const request = await httpClient.post(`${this.baseUrl}/login`, {
        email,
        password,
      });
      const auth: AuthModel = request.data;
      AuthTokenService.setTokenInLocalStorage(auth);
      SocketService.setupSocketConnection();
      return auth;
    } catch (error: any) {
      return error?.response;
    }
  }

  static async logout(): Promise<LogoutResponse | ErrorResponse> {
    try {
      const request = await httpClient.delete(`${this.baseUrl}/logout`);
      const response = await request.data;
      AuthTokenService.clearTokenFromLocalStorage();
      window.location.href = "/agent/auth"
      return response;
    } catch (error: any) {
      AuthTokenService.clearTokenFromLocalStorage();
      return error?.response;
    }
  }

  static async forceLogout(appAgentIds: string[]): Promise<ForceLogoutResponse | ErrorResponse> {
    try {
      const request = await httpClient.delete(`${this.baseUrl}/force-logout`, { data: { appAgentIds } });
      const response = await request.data;
      return response;
    } catch (error: any) {
      return error?.response;
    }
  }

  static async currentUserIsAdmin(): Promise<boolean> {
    try {
      const agent = AuthTokenService.getAgentDetailsFromLocalStorage();
      if (!agent)
        return false;
      const request = await AppAgentService.getAgentDetails(agent.appAgentId);
      if ("data" in request) {
        const isAdmin = request.data.appAgentAccDetails.appAccessGroup?.isAdministrator;
        return isAdmin ? isAdmin : false;
      }
      return false;
    } catch (error) {
      return false;
    }
  }

  static async forgotPassword(
    email: string
  ): Promise<ResetPasswordResponse | ErrorResponse> {
    try {
      const request = await httpClient.post(`${this.baseUrl}/reset-password`, {
        email,
      });
      const response: ResetPasswordResponse = await request.data;
      return response;
    } catch (error: any) {
      return error?.response;
    }
  }

  static async refreshAccessToken(): Promise<boolean> {
    try {
      const accessToken = AuthTokenService.getTokenFromLocalStorage();
      if (!accessToken) {
        return false;
      }
      const request = await httpClient.post(`${this.baseUrl}/refresh`);
      const auth = await request.data;
      return AuthTokenService.setTokenInLocalStorage(auth);
    } catch (error) {
      return false;
    }
  }

  static async verifyPasswordToken(
    token: string,
    secret: string
  ): Promise<VerifyTokenResponse | ErrorResponse> {
    try {
      const request = await httpClient.post(`${this.baseUrl}/verify-token`, {
        token,
        secret,
      });
      const response = await request.data;
      return response;
    } catch (error: any) {
      return error?.response;
    }
  }

  static async updatePassword(
    token: string,
    secret: string,
    password: string,
    cfmPassword: string
  ): Promise<UpdatedPasswordResponse | ErrorResponse> {
    try {
      const request = await httpClient.post(
        `${this.baseUrl}/update-password/`,
        { token, secret, password, cfmPassword }
      );
      const response: UpdatedPasswordResponse = await request.data;
      return response;
    } catch (error: any) {
      return error?.response;
    }
  }
}

export { AuthService };
