import { httpClient } from "../../../../common/axios/axios.config";
import { GENIE_MARKETING_API_VERSION } from "../../../../common/globals/common.constants";
import { ErrorResponse } from "../../../../common/globals/common.model";
import {
  CreateFlowResponse,
  GetFlowOptions,
  GetFlowResponse,
  MSG91Flow,
} from "../../models/flow/flow.model";

class FlowService {
  private static baseUrl = `/${GENIE_MARKETING_API_VERSION}/msg91/flow`;

  static async createFlow(
    flowDetails: MSG91Flow
  ): Promise<CreateFlowResponse | ErrorResponse> {
    try {
      const request = await httpClient.post(
        `${this.baseUrl}/create-flow`,
        flowDetails
      );
      const response: CreateFlowResponse = request.data;
      return response;
    } catch (error: any) {
      return error?.response;
    }
  }

  static async getFlow(
    options?: GetFlowOptions
  ): Promise<GetFlowResponse | ErrorResponse> {
    try {
      const request = await httpClient.post(
        `${this.baseUrl}/get-flow`,
        options
      );
      const response: GetFlowResponse = request.data;
      return response;
    } catch (error: any) {
      return error?.response;
    }
  }
}

export { FlowService };
