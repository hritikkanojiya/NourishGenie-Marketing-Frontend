import { httpClient } from "../../../common/axios/axios.config";
import { GENIE_MARKETING_API_VERSION } from "../../../common/globals/common.constants"
import { ErrorResponse } from "../../../common/globals/common.model";
import { AppAgent, GetAgentDetailsResponse, GetAgentOptions, GetAgentsResponse, GetAppActivityOptions, GetAppActivityResponse, GetAppEventLogsOptions, GetAppEventLogsResponse, RegisterAgentResponse } from "../models/app_agent.model";

class AppAgentService {
  private static baseUrl = `/${GENIE_MARKETING_API_VERSION}/agent/auth`;

  static async registerAgent(agentDetails: AppAgent): Promise<RegisterAgentResponse | ErrorResponse> {
    try {
      const request = await httpClient.post(`${this.baseUrl}/register`, agentDetails);
      const response: RegisterAgentResponse = request.data;
      return response;
    } catch (error: any) {
      return error?.response;
    }
  }

  static async getAgents(options?: GetAgentOptions): Promise<GetAgentsResponse | ErrorResponse> {
    try {
      const request = await httpClient.post(`${this.baseUrl}/get-agents`, options);
      const response: GetAgentsResponse = request.data;
      return response;
    } catch (error: any) {
      return error?.response;
    }
  }

  static async getAgentDetails(appAgentId: string): Promise<GetAgentDetailsResponse | ErrorResponse> {
    try {
      const request = await httpClient.post(`${this.baseUrl}/get-details`, { appAgentId });
      const response: GetAgentDetailsResponse = request.data;
      return response;
    } catch (error: any) {
      return error?.response;
    }
  }

  static async getAppActivities(options?: GetAppActivityOptions): Promise<GetAppActivityResponse | ErrorResponse> {
    try {
      const request = await httpClient.post(`${this.baseUrl}/get-app-activities`, options);
      const response: GetAppActivityResponse = request.data;
      return response;
    } catch (error: any) {
      return error?.response;
    }
  }

  static async getAppEventLogs(options?: GetAppEventLogsOptions): Promise<GetAppEventLogsResponse | ErrorResponse> {
    try {
      const request = await httpClient.post(`${GENIE_MARKETING_API_VERSION}/logs/get-event-logs`, options);
      const response: GetAppEventLogsResponse = request.data;
      return response;
    } catch (error: any) {
      return error?.response;
    }
  }

}

export { AppAgentService }