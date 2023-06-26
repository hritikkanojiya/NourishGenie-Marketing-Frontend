import { httpClient } from "../../../common/axios/axios.config";
import { GENIE_MARKETING_API_VERSION } from "../../../common/globals/common.constants";
import { ErrorResponse } from "../../../common/globals/common.model";
import {
  AppList,
  CreateAppListResponse,
  DeleteAppListResponse,
  GetAppListOptions,
  GetAppListResponse,
  UpdateAppListResponse,
} from "../models/app_list.model";

class AppListService {
  private static baseUrl = `/${GENIE_MARKETING_API_VERSION}/list`;

  static async createAppList(
    listDetails: AppList
  ): Promise<CreateAppListResponse | ErrorResponse> {
    try {
      const request = await httpClient.post(
        `${this.baseUrl}/create-list`,
        listDetails
      );
      const response: CreateAppListResponse = request.data;
      return response;
    } catch (error: any) {
      return error?.response;
    }
  }

  static async getAppLists(
    options?: GetAppListOptions
  ): Promise<GetAppListResponse | ErrorResponse> {
    try {
      const request = await httpClient.post(
        `${this.baseUrl}/get-lists`,
        options
      );
      const response: GetAppListResponse = request.data;
      return response;
    } catch (error: any) {
      return error?.response;
    }
  }

  static async updateAppLists(
    listDetails: AppList
  ): Promise<UpdateAppListResponse | ErrorResponse> {
    try {
      const request = await httpClient.post(
        `${this.baseUrl}/update-list`,
        listDetails
      );
      const response: UpdateAppListResponse = request.data;
      return response;
    } catch (error: any) {
      return error?.response;
    }
  }

  static async deleteAppLists(
    appListIds: string[]
  ): Promise<DeleteAppListResponse | ErrorResponse> {
    try {
      const request = await httpClient.delete(`${this.baseUrl}/delete-lists`, {
        data: { appListIds },
      });
      const response: DeleteAppListResponse = request.data;
      return response;
    } catch (error: any) {
      return error?.response;
    }
  }
}

export { AppListService };
