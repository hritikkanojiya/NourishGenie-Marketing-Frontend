import { httpClient } from "../../../common/axios/axios.config";
import { GENIE_MARKETING_API_VERSION } from "../../../common/globals/common.constants";
import { ErrorResponse } from "../../../common/globals/common.model";
import {
  AppSubMenuModel,
  CreateSubMenuPayload,
  CreateSubMenuResponse,
  DeleteSubMenuResponse,
  GetSubMenuOptions,
  GetSubMenusResponse,
  UpdateSubMenuResponse,
} from "../models/app_sub_menu.model";

class AppSubMenuService {
  private static baseUrl = `/${GENIE_MARKETING_API_VERSION}/permission/menu`;

  static async createSubMenu(
    subMenuDetails: CreateSubMenuPayload
  ): Promise<CreateSubMenuResponse | ErrorResponse> {
    try {
      const request = await httpClient.post(
        `${this.baseUrl}/create-sub-menu`,
        subMenuDetails
      );
      const response: CreateSubMenuResponse = request.data;
      return response;
    } catch (error: any) {
      return error?.response;
    }
  }

  static async getSubMenu(
    subMenuOptions?: GetSubMenuOptions
  ): Promise<GetSubMenusResponse | ErrorResponse> {
    try {
      const request = await httpClient.post(
        `${this.baseUrl}/get-sub-menu`,
        subMenuOptions
      );
      const response: GetSubMenusResponse = request.data;
      return response;
    } catch (error: any) {
      return error?.response;
    }
  }

  static async updateSubMenu(
    subMenuDetails: AppSubMenuModel
  ): Promise<UpdateSubMenuResponse | ErrorResponse> {
    try {
      const request = await httpClient.put(
        `${this.baseUrl}/update-sub-menu`,
        subMenuDetails
      );
      const response: UpdateSubMenuResponse = request.data;
      return response;
    } catch (error: any) {
      return error?.response;
    }
  }

  static async deleteSubMenu(
    appSubMenuIds: string[]
  ): Promise<DeleteSubMenuResponse | ErrorResponse> {
    try {
      const request = await httpClient.delete(
        `${this.baseUrl}/delete-sub-menu`,
        { data: { appSubMenuIds } }
      );
      const response: DeleteSubMenuResponse = request.data;
      return response;
    } catch (error: any) {
      return error?.response;
    }
  }
}

export { AppSubMenuService };
