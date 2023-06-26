import { httpClient } from "../../../common/axios/axios.config";
import { GENIE_MARKETING_API_VERSION } from "../../../common/globals/common.constants";
import { ErrorResponse } from "../../../common/globals/common.model";
import {
  CreateAppCampaignPayload,
  CreateCampaignResponse,
  GetCampaignsOptions,
  GetCampaignsResponse,
  ScheduleCampaignPayload,
  ScheduleCampaignResponse,
  TestCampaignPayload,
  TestCampaignResponse,
} from "../models/campaign.model";

class AppCampaignService {
  private static baseUrl = `/${GENIE_MARKETING_API_VERSION}/campaign`;

  static async createAppCampaign(
    appCampaign: CreateAppCampaignPayload
  ): Promise<CreateCampaignResponse | ErrorResponse> {
    try {
      const request = await httpClient.post(
        `${this.baseUrl}/create-campaign`,
        appCampaign
      );
      const response: CreateCampaignResponse = request.data;
      return response;
    } catch (error: any) {
      return error?.response;
    }
  }

  static async getAppCampaigns(
    options?: GetCampaignsOptions
  ): Promise<GetCampaignsResponse | ErrorResponse> {
    try {
      const request = await httpClient.post(
        `${this.baseUrl}/get-campaigns`,
        options
      );
      const response: GetCampaignsResponse = request.data;
      return response;
    } catch (error: any) {
      return error?.response;
    }
  }

  static async testAppCampaign(
    payload: TestCampaignPayload
  ): Promise<TestCampaignResponse | ErrorResponse> {
    try {
      const request = await httpClient.post(
        `${this.baseUrl}/send-test-campaign`,
        payload
      );
      const response: TestCampaignResponse = request.data;
      return response;
    } catch (error: any) {
      return error?.response;
    }
  }

  static async scheduleCampaign(
    payload: ScheduleCampaignPayload
  ): Promise<ScheduleCampaignResponse | ErrorResponse> {
    try {
      const request = await httpClient.put(
        `${this.baseUrl}/schedule-campaign`,
        payload
      );
      const response: ScheduleCampaignResponse = request.data;
      return response;
    } catch (error: any) {
      return error?.response;
    }
  }
}

export { AppCampaignService };
