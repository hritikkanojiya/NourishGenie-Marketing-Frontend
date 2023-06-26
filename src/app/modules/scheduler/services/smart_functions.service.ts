import { httpClient } from "../../../common/axios/axios.config";
import { GENIE_MARKETING_API_VERSION } from "../../../common/globals/common.constants";
import { ErrorResponse } from "../../../common/globals/common.model";
import {
  CreateFunctionResponse,
  DeleteFunctionResponse,
  GetFunctionsOptions,
  GetFunctionsResponse,
  SmartFunction,
  UpdateFunctionResponse,
} from "../models/smart_functions.model";

class SmartFunctionService {
  private static baseUrl = `${GENIE_MARKETING_API_VERSION}/scheduler/smart-function`;

  static async createSmartFunction(
    functionDetails: SmartFunction
  ): Promise<CreateFunctionResponse | ErrorResponse> {
    try {
      const request = await httpClient.post(
        `${this.baseUrl}/create-smart-function`,
        functionDetails
      );
      const response: CreateFunctionResponse = request.data;
      return response;
    } catch (error: any) {
      return error?.response;
    }
  }

  static async getSmartFunctions(
    options?: GetFunctionsOptions
  ): Promise<GetFunctionsResponse | ErrorResponse> {
    try {
      const request = await httpClient.post(
        `${this.baseUrl}/get-smart-function`,
        options
      );
      const response: GetFunctionsResponse = request.data;
      return response;
    } catch (error: any) {
      return error?.response;
    }
  }

  static async updateSmartFunction(
    functionDetails: SmartFunction
  ): Promise<UpdateFunctionResponse | ErrorResponse> {
    try {
      const request = await httpClient.put(
        `${this.baseUrl}/update-smart-function`,
        functionDetails
      );
      const response: UpdateFunctionResponse = request.data;
      return response;
    } catch (error: any) {
      return error?.response;
    }
  }

  static async deleteSmartFunction(
    appSmartFunctionIds: string[]
  ): Promise<DeleteFunctionResponse | ErrorResponse> {
    try {
      const request = await httpClient.delete(
        `${this.baseUrl}/delete-smart-function`,
        { data: { appSmartFunctionIds } }
      );
      const response: DeleteFunctionResponse = request.data;
      return response;
    } catch (error: any) {
      return error?.response;
    }
  }
}

export { SmartFunctionService };
