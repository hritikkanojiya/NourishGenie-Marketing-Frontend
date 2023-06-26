import { SuccessResponse } from "../../../common/globals/common.model";

export interface AgentDetails {
  readonly appAgentId: string;
  email: string;
  username: string;
  appAccessGroup: {
    readonly appAccessGroupId: string;
    name: string;
    description: string;
    isAdministrator: boolean;
  };
}

export interface JWTTokenPayload {
  payloadData: {
    requestIP: string;
    appAgentId: string;
    appAccessGroupId: string;
  };
  iat: number;
  exp: number;
  iss: string;
}

export interface AuthModel {
  error: boolean;
  data: {
    appAgentAccDetails: AgentDetails;
    jwtToken: string;
  };
  message: string;
}

export interface ResetPasswordResponse extends SuccessResponse {
  data: {
    message: string;
    mailInfo: {
      messageId: string;
      serviceName: string;
    };
  };
}

export interface VerifyTokenResponse extends SuccessResponse {
  data: {
    appAgentAccDetails: AgentDetails;
    message: string;
  };
}

export interface UpdatedPasswordResponse extends SuccessResponse {
  data: {
    appAgentAccDetails: {
      readonly appAgentId: string;
    };
    message: string;
  };
}

export interface LogoutResponse extends SuccessResponse {
  data: {
    message: string;
  };
}

export interface ForceLogoutResponse extends SuccessResponse {}
