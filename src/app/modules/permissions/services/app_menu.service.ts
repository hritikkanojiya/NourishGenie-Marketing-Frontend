import { httpClient } from "../../../common/axios/axios.config";
import { GENIE_MARKETING_API_VERSION } from "../../../common/globals/common.constants";
import { ErrorResponse } from "../../../common/globals/common.model";
import {
  AppMenuModel,
  CreateMenuResponse,
  DeleteMenuResponse,
  GetMenuOptions,
  GetMenuResponse,
  UpdateMenuResponse,
} from "../models/app_menu.model";

class AppMenuService {
  private static baseUrl = `/${GENIE_MARKETING_API_VERSION}/permission/menu`;

  static async createAppMenu(
    appMenuDetails: AppMenuModel
  ): Promise<CreateMenuResponse | ErrorResponse> {
    try {
      const request = await httpClient.post(
        `${this.baseUrl}/create-menu`,
        appMenuDetails
      );
      const response: CreateMenuResponse = request.data;
      return response;
    } catch (error: any) {
      return error?.response;
    }
  }

  static async getAppMenus(
    options?: GetMenuOptions
  ): Promise<GetMenuResponse | ErrorResponse> {
    try {
      const request = await httpClient.post(
        `${this.baseUrl}/get-menu`,
        options
      );
      const response: GetMenuResponse = request.data;
      return response;
    } catch (error: any) {
      return error?.response;
    }
  }

  static async updateAppMenu(
    menuDetails: AppMenuModel
  ): Promise<UpdateMenuResponse | ErrorResponse> {
    try {
      const request = await httpClient.put(
        `${this.baseUrl}/update-menu`,
        menuDetails
      );
      const response: UpdateMenuResponse = request.data;
      return response;
    } catch (error: any) {
      return error?.response;
    }
  }

  static async deleteAppMenu(
    appMenuIds: string[]
  ): Promise<DeleteMenuResponse | ErrorResponse> {
    try {
      const request = await httpClient.delete(`${this.baseUrl}/delete-menu`, {
        data: { appMenuIds },
      });
      const response: DeleteMenuResponse = request.data;
      return response;
    } catch (error: any) {
      return error?.response;
    }
  }
}

export { AppMenuService };
