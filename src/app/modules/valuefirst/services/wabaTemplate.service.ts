import { httpClient } from "../../../common/axios/axios.config";
import { GENIE_MARKETING_API_VERSION } from "../../../common/globals/common.constants";
import { ErrorResponse } from "../../../common/globals/common.model";
import {
  CreateTemplateResponse,
  DeleteWabaTemplatesResponse,
  GetWabaTemplatesOptions,
  GetWabaTemplatesResponse,
  SyncWabaTemplatesResponse,
  UpdateWABATemplateComponentPayload,
  UpdateWABATemplateComponentResponse,
  WABATemplatePayload,
} from "../models/wabaTemplate.model";

class WabaTemplateService {
  private static baseUrl = `/${GENIE_MARKETING_API_VERSION}/valuefirst/template`;

  static async createTemplate(
    payload: WABATemplatePayload
  ): Promise<CreateTemplateResponse | ErrorResponse> {
    try {
      const request = await httpClient.post(
        `${this.baseUrl}/create-template`,
        payload
      );
      const response = request.data;
      return response;
    } catch (error: any) {
      return error?.response;
    }
  }

  static async getTemplates(
    options?: GetWabaTemplatesOptions
  ): Promise<GetWabaTemplatesResponse | ErrorResponse> {
    try {
      const request = await httpClient.post(
        `${this.baseUrl}/get-templates`,
        options
      );
      const response: GetWabaTemplatesResponse = request.data;
      return response;
    } catch (error: any) {
      return error?.response;
    }
  }

  static async deleteWabaTemplates(
    appWABAValueFirstTemplateIds: string[]
  ): Promise<DeleteWabaTemplatesResponse | ErrorResponse> {
    try {
      const request = await httpClient.delete(
        `${this.baseUrl}/delete-template`,
        { data: { appWABAValueFirstTemplateIds } }
      );
      const response: DeleteWabaTemplatesResponse = request.data;
      return response;
    } catch (error: any) {
      return error?.response;
    }
  }

  static async synchronizeWabaTemplates(): Promise<
    SyncWabaTemplatesResponse | ErrorResponse
  > {
    try {
      const request = await httpClient.get(`${this.baseUrl}/sync-templates`);
      const response: SyncWabaTemplatesResponse = request.data;
      return response;
    } catch (error: any) {
      return error?.response;
    }
  }

  static async updateWABATemplateComponents(
    payload: UpdateWABATemplateComponentPayload
  ): Promise<UpdateWABATemplateComponentResponse | ErrorResponse> {
    try {
      const request = await httpClient.post(
        `${this.baseUrl}/update-template-components`,
        payload
      );
      const response: UpdateWABATemplateComponentResponse = request.data;
      return response;
    } catch (error: any) {
      return error?.response;
    }
  }
}

export { WabaTemplateService };
