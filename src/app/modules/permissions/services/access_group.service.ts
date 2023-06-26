import { httpClient } from "../../../common/axios/axios.config";
import { GENIE_MARKETING_API_VERSION } from "../../../common/globals/common.constants";
import { ErrorResponse } from "../../../common/globals/common.model";
import {
  GetGroupsResponse,
  GetGroupOptions,
  AccessGroupModel,
  CreateGroupResponse,
  UpdateGroupResponse,
  DeleteGroupResponse,
} from "../models/access_group.model";

export class AccessGroupService {
  private static baseUrl: string = `/${GENIE_MARKETING_API_VERSION}/permission/access-group`;

  static async getAccessGroup(
    options?: GetGroupOptions
  ): Promise<GetGroupsResponse | ErrorResponse> {
    try {
      const request = await httpClient.post(
        `${this.baseUrl}/get-group`,
        options
      );
      const response: GetGroupsResponse = request.data;
      return response;
    } catch (error: any) {
      return error?.response;
    }
  }

  static async createAccessGroup(
    accessGroupDetails: AccessGroupModel
  ): Promise<CreateGroupResponse | ErrorResponse> {
    try {
      const request = await httpClient.post(
        `${this.baseUrl}/create-group`,
        accessGroupDetails
      );
      const response: CreateGroupResponse = request.data;
      return response;
    } catch (error: any) {
      return error?.response;
    }
  }

  static async updateAccessGroup(
    accessGroupDetails: AccessGroupModel
  ): Promise<UpdateGroupResponse | ErrorResponse> {
    try {
      const request = await httpClient.put(
        `${this.baseUrl}/update-group`,
        accessGroupDetails
      );
      const response: UpdateGroupResponse = request.data;
      return response;
    } catch (error: any) {
      return error?.response;
    }
  }

  static async deleteAccessGroup(
    appAccessGroupIds: string[]
  ): Promise<DeleteGroupResponse | ErrorResponse> {
    try {
      const request = await httpClient.delete(`${this.baseUrl}/delete-group`, {
        data: { appAccessGroupIds },
      });
      const response: DeleteGroupResponse = request.data;
      return response;
    } catch (error: any) {
      return error?.response;
    }
  }
}
