import { httpClient } from "../../../common/axios/axios.config";
import { GENIE_MARKETING_API_VERSION } from "../../../common/globals/common.constants";
import { ErrorResponse } from "../../../common/globals/common.model";
import {
  AppConstant,
  CreateConstantResponse,
  DeleteConstantResponse,
  GetConstantOptions,
  GetConstantResponse,
  UpdateConstantResponse,
} from "../models/app_constants.model";

class AppConstantService {
  private static baseUrl = `/${GENIE_MARKETING_API_VERSION}/constant`;

  static async createAppConstant(
    appConstant: AppConstant
  ): Promise<CreateConstantResponse | ErrorResponse> {
    try {
      const request = await httpClient.post(
        `${this.baseUrl}/create-constant`,
        appConstant
      );
      const response: CreateConstantResponse = request.data;
      return response;
    } catch (error: any) {
      return error?.response;
    }
  }

  static async getAppConstants(
    options?: GetConstantOptions
  ): Promise<GetConstantResponse | ErrorResponse> {
    try {
      const request = await httpClient.post(
        `${this.baseUrl}/get-constant`,
        options
      );
      const response: GetConstantResponse = request.data;
      return response;
    } catch (error: any) {
      return error?.response;
    }
  }

  static async updateAppConstants(
    appConstant: AppConstant
  ): Promise<UpdateConstantResponse | ErrorResponse> {
    try {
      const request = await httpClient.put(
        `${this.baseUrl}/update-constant`,
        appConstant
      );
      const response: UpdateConstantResponse = request.data;
      return response;
    } catch (error: any) {
      return error?.response;
    }
  }

  static async deleteAppConstants(
    appConstantIds: string[]
  ): Promise<DeleteConstantResponse | ErrorResponse> {
    try {
      const request = await httpClient.delete(
        `${this.baseUrl}/delete-constant`,
        { data: { appConstantIds } }
      );
      const response: DeleteConstantResponse = request.data;
      return response;
    } catch (error: any) {
      return error?.response;
    }
  }
}

export { AppConstantService };
