import { httpClient } from "../../../common/axios/axios.config";
import { GENIE_MARKETING_API_VERSION } from "../../../common/globals/common.constants";
import { ErrorResponse } from "../../../common/globals/common.model";
import {
  CreateAppContactResponse,
  CreateContactPayload,
  DeleteAppContactResponse,
  GetAppContactsOptions,
  GetAppContactsResponse,
  ImportContactsPayload,
  ImportContactsResponse,
  ToggleListPayload,
  ToggleListResponse,
  UpdateAppContactResponse,
} from "../models/app_contacts.model";

class AppContactService {
  private static baseUrl = `/${GENIE_MARKETING_API_VERSION}/contact`;

  static async createAppContact(
    appContact: CreateContactPayload
  ): Promise<CreateAppContactResponse | ErrorResponse> {
    try {
      const request = await httpClient.post(
        `${this.baseUrl}/create-contact`,
        appContact
      );
      const response: CreateAppContactResponse = request.data;
      return response;
    } catch (error: any) {
      return error?.response;
    }
  }

  static async getAppContacts(
    options?: GetAppContactsOptions
  ): Promise<GetAppContactsResponse | ErrorResponse> {
    try {
      const request = await httpClient.post(
        `${this.baseUrl}/get-contacts`,
        options
      );
      const response: GetAppContactsResponse = request.data;
      return response;
    } catch (error: any) {
      return error?.response;
    }
  }

  static async updateAppContact(
    appContact: CreateContactPayload
  ): Promise<UpdateAppContactResponse | ErrorResponse> {
    try {
      const request = await httpClient.put(
        `${this.baseUrl}/update-contact`,
        appContact
      );
      const response: UpdateAppContactResponse = request.data;
      return response;
    } catch (error: any) {
      return error?.response;
    }
  }

  static async deleteAppContacts(
    appContactIds: string[]
  ): Promise<DeleteAppContactResponse | ErrorResponse> {
    try {
      const request = await httpClient.delete(
        `${this.baseUrl}/delete-contacts`,
        { data: { appContactIds } }
      );
      const response: DeleteAppContactResponse = request.data;
      return response;
    } catch (error: any) {
      return error?.response;
    }
  }

  static async toggleList(
    payload: ToggleListPayload
  ): Promise<ToggleListResponse | ErrorResponse> {
    try {
      const request = await httpClient.patch(
        `${this.baseUrl}/toggle-lists`,
        payload
      );
      const response: DeleteAppContactResponse = request.data;
      return response;
    } catch (error: any) {
      return error?.response;
    }
  }

  static async importContact(
    payload: ImportContactsPayload
  ): Promise<ImportContactsResponse | ErrorResponse> {
    try {
      const request = await httpClient.post(
        `${this.baseUrl}/import-contact/data-source`,
        payload
      );
      const response: ImportContactsResponse = request.data;
      return response;
    } catch (error: any) {
      return error?.response;
    }
  }
}

export { AppContactService };
