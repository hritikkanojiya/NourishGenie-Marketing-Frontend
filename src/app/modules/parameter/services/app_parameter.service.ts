import { httpClient } from "../../../common/axios/axios.config";
import { GENIE_MARKETING_API_VERSION } from "../../../common/globals/common.constants";
import { ErrorResponse } from "../../../common/globals/common.model";
import {
  AppParameter,
  CreateAppParameterResponse,
  DeleteAppParameterResponse,
  GetAppParameterOptions,
  GetAppParametersResponse,
  SearchParameterPayload,
  SearchParamsResponse,
  UpdateAppParameterResponse,
} from "../models/app_parameter.model";

class AppParameterService {
  private static baseUrl = `/${GENIE_MARKETING_API_VERSION}/parameter`;

  static async createAppParameter(
    appParameter: AppParameter
  ): Promise<CreateAppParameterResponse | ErrorResponse> {
    try {
      const request = await httpClient.post(
        `${this.baseUrl}/create-parameter`,
        appParameter
      );
      const response: CreateAppParameterResponse = request.data;
      return response;
    } catch (error: any) {
      return error?.response;
    }
  }

  static async getAppParameters(
    options?: GetAppParameterOptions
  ): Promise<GetAppParametersResponse | ErrorResponse> {
    try {
      const request = await httpClient.post(
        `${this.baseUrl}/get-parameter`,
        options
      );
      const response: GetAppParametersResponse = request.data;
      return response;
    } catch (error: any) {
      return error?.response;
    }
  }

  static async updateAppParameters(
    appParameter: AppParameter
  ): Promise<UpdateAppParameterResponse | ErrorResponse> {
    try {
      const request = await httpClient.put(
        `${this.baseUrl}/update-parameter`,
        appParameter
      );
      const response: UpdateAppParameterResponse = request.data;
      return response;
    } catch (error: any) {
      return error?.response;
    }
  }

  static async deleteAppParameters(
    appParameterIds: string[]
  ): Promise<DeleteAppParameterResponse | ErrorResponse> {
    try {
      const request = await httpClient.delete(
        `${this.baseUrl}/delete-parameter`,
        { data: { appParameterIds } }
      );
      const response: DeleteAppParameterResponse = request.data;
      return response;
    } catch (error: any) {
      return error?.response;
    }
  }

  static async searchParameters(payload: SearchParameterPayload): Promise<SearchParamsResponse | ErrorResponse> {
    try {
      const request = await httpClient.post(`${this.baseUrl}/search-parameter`, payload);
      const response: SearchParamsResponse = request.data;
      return response;
    } catch (error: any) {
      return error?.response;
    }
  }
}

export { AppParameterService };
