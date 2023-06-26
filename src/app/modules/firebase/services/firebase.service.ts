import { httpClient } from "../../../common/axios/axios.config";
import { GENIE_MARKETING_API_VERSION } from "../../../common/globals/common.constants";
import { ErrorResponse } from "../../../common/globals/common.model";
import {
  CreateTemplateResponse,
  DeleteTemplateResponse,
  FirebaseTemplate,
  GetTemplateOptions,
  GetTemplatesResponse,
  UpdateTemplateResponse,
} from "../models/firebase_template.model";

class FirebaseTemplateService {
  private static baseUrl = `/${GENIE_MARKETING_API_VERSION}/firebase/template`;

  static async createFirebaseTemplate(
    firebaseTemplate: FirebaseTemplate
  ): Promise<CreateTemplateResponse | ErrorResponse> {
    try {
      const request = await httpClient.post(
        `${this.baseUrl}/create-template`,
        firebaseTemplate
      );
      const response: CreateTemplateResponse = request.data;
      return response;
    } catch (error: any) {
      return error?.response;
    }
  }

  static async getFirebaseTemplates(
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

  static async updateFirebaseTemplate(
    firebaseTemplate: FirebaseTemplate
  ): Promise<UpdateTemplateResponse | ErrorResponse> {
    try {
      const request = await httpClient.put(
        `${this.baseUrl}/update-template`,
        firebaseTemplate
      );
      const response: UpdateTemplateResponse = request.data;
      return response;
    } catch (error: any) {
      return error?.response;
    }
  }

  static async deleteFirebaseTemplate(
    appFirebaseTemplateIds: string[]
  ): Promise<DeleteTemplateResponse | ErrorResponse> {
    try {
      const request = await httpClient.delete(
        `${this.baseUrl}/delete-template`,
        { data: { appFirebaseTemplateIds } }
      );
      const response: DeleteTemplateResponse = request.data;
      return response;
    } catch (error: any) {
      return error?.response;
    }
  }
}

export { FirebaseTemplateService };
