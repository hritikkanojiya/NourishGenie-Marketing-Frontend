import { httpClient } from "../../../common/axios/axios.config";
import { GENIE_MARKETING_API_VERSION } from "../../../common/globals/common.constants";
import { ErrorResponse } from "../../../common/globals/common.model";
import {
  CreateTemplateResponse,
  DeleteTemplateResponse,
  GetTemplateOptions,
  GetTemplatesResponse,
  SendInBlueTemplate,
  TestTemplatePayload,
  TestTemplateResponse,
  UpdateTemplateResponse,
} from "../models/sendinblue_template.model";

class SendInBlueTemplateService {
  private static baseUrl = `/${GENIE_MARKETING_API_VERSION}/sendinblue/template`;

  static async createTemplates(
    template: SendInBlueTemplate
  ): Promise<CreateTemplateResponse | ErrorResponse> {
    try {
      const request = await httpClient.post(
        `${this.baseUrl}/create-template`,
        template
      );
      const response: CreateTemplateResponse = request.data;
      return response;
    } catch (error: any) {
      return error?.response;
    }
  }

  static async getTemplates(
    options?: GetTemplateOptions
  ): Promise<GetTemplatesResponse | ErrorResponse> {
    try {
      const request = await httpClient.post(
        `${this.baseUrl}/get-templates`,
        options
      );
      const response: GetTemplatesResponse = request.data;
      return response;
    } catch (error: any) {
      return error?.response;
    }
  }

  static async updateTemplates(
    template: SendInBlueTemplate
  ): Promise<UpdateTemplateResponse | ErrorResponse> {
    try {
      const request = await httpClient.put(
        `${this.baseUrl}/update-template`,
        template
      );
      const response: UpdateTemplateResponse = request.data;
      return response;
    } catch (error: any) {
      return error?.response;
    }
  }

  static async deleteTemplates(
    appSendInBlueTemplateIds: string[]
  ): Promise<DeleteTemplateResponse | ErrorResponse> {
    try {
      const request = await httpClient.delete(
        `${this.baseUrl}/delete-templates`,
        { data: { appSendInBlueTemplateIds } }
      );
      const response: DeleteTemplateResponse = request.data;
      return response;
    } catch (error: any) {
      return error?.response;
    }
  }

  static async testTemplates(
    payload: TestTemplatePayload
  ): Promise<TestTemplateResponse | ErrorResponse> {
    try {
      const request = await httpClient.post(
        `${this.baseUrl}/send-test-template`,
        payload
      );
      const response: TestTemplateResponse = request.data;
      return response;
    } catch (error: any) {
      return error?.response;
    }
  }
}

export { SendInBlueTemplateService };
