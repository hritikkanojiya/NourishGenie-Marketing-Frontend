import {
  MetaData,
  SuccessResponse,
} from "../../../common/globals/common.model";

export interface AgentActivityDetails {
  activityDetails: {
    processingTime: number;
    request: {
      remoteAddress: string;
      remoteFamily: string;
      httpVersion: string;
      method: string;
      originalUrl: string;
      url: string;
      path: string;
      body: any;
    };
    response: {
      statusCode: number;
      statusMessage: string;
    };
    errorMessage: any | null;
  };
  createdAt: Date;
  updatedAt: Date;
  appActivityId: string;
}

export interface AppAgent {
  readonly appAgentId?: string;
  username: string;
  email: string;
  password: string;
  appAccessGroupId: string;
  appAccessGroup?: {
    appAccessGroupId: string;
    name: string;
    description: string;
    isAdministrator: boolean;
  };
  lastLoggedIn?: string;
  createdAt?: Date;
  updatedAt?: Date;
  isNonDeleteAble?: boolean;
  socketDetails?: any;
  recentActivities?: AgentActivityDetails[];
}

export interface RegisterAgentResponse extends SuccessResponse {
  data: {
    appAgentAccDetails: AppAgent;
    message: string;
  };
}

export interface GetAgentsResponse extends SuccessResponse {
  data: {
    appAgents: AppAgent[];
    metaData: MetaData;
    message: string;
  };
}

export interface GetAgentOptions {
  appAccessGroupId?: string | null;
  search?: string | null;
  metaData?: MetaData;
  page?: any;
}

export interface GetAgentDetailsResponse {
  error: boolean;
  data: {
    appAgentAccDetails: AppAgent;
  };
}

export interface AppActivity extends AgentActivityDetails {
  readonly appAgentId: string;
}

export interface GetAppActivityResponse extends SuccessResponse {
  data: {
    appActivities: AppActivity[];
    metaData: MetaData;
    message: string;
  };
}

export interface GetAppActivityOptions {
  appActivityId?: string | null;
  appAgentId?: string | null;
  search?: string | null;
  metaData?: MetaData;
  page?: number;
}

type eventStatus = "started" | "running" | "suspended" | "completed";

export interface AppEventLog {
  appEventId: number;
  name: string;
  status: eventStatus;
  message: string;
  triggeredAt: string;
  createdAt: Date;
  updatedAt: Date;
  appEventLogId: string;
}

export interface GetAppEventLogsResponse extends SuccessResponse {
  data: {
    appEventLogs: AppEventLog[];
    metaData: MetaData;
    message: string;
  };
}

export interface GetAppEventLogsOptions {
  appEventLogId?: string | null;
  appEventId?: string | null;
  eventStatus?: eventStatus | null;
  search?: string | null;
  metaData?: MetaData;
}
