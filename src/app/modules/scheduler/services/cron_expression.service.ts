import { httpClient } from "../../../common/axios/axios.config";
import { GENIE_MARKETING_API_VERSION } from "../../../common/globals/common.constants";
import { ErrorResponse } from "../../../common/globals/common.model";
import {
  CreateExpressionResponse,
  CronExpression,
  DeleteExpressionResponse,
  GetExpressionOptions,
  GetExpressionsResponse,
  UpdateExpressionResponse,
} from "../models/cron_expression.model";

class CronExpressionService {
  private static baseUrl = `/${GENIE_MARKETING_API_VERSION}/scheduler/cron-expression`;

  static async createCronExpression(
    expressionDetails: CronExpression
  ): Promise<CreateExpressionResponse | ErrorResponse> {
    try {
      const request = await httpClient.post(
        `${this.baseUrl}/create-expression`,
        expressionDetails
      );
      const response: CreateExpressionResponse = request.data;
      return response;
    } catch (error: any) {
      return error?.response;
    }
  }

  static async getCronExpressions(
    options?: GetExpressionOptions
  ): Promise<GetExpressionsResponse | ErrorResponse> {
    try {
      const request = await httpClient.post(
        `${this.baseUrl}/get-expression`,
        options
      );
      const response: GetExpressionsResponse = request.data;
      return response;
    } catch (error: any) {
      return error?.response;
    }
  }

  static async updateCronExpression(
    expressionDetails: CronExpression
  ): Promise<UpdateExpressionResponse | ErrorResponse> {
    try {
      const request = await httpClient.put(
        `${this.baseUrl}/update-expression`,
        expressionDetails
      );
      const response: UpdateExpressionResponse = request.data;
      return response;
    } catch (error: any) {
      return error?.response;
    }
  }

  static async deleteCronExpression(
    appCronExpressionIds: string[]
  ): Promise<DeleteExpressionResponse | ErrorResponse> {
    try {
      const request = await httpClient.delete(
        `${this.baseUrl}/delete-expression`,
        { data: { appCronExpressionIds } }
      );
      const response: DeleteExpressionResponse = request.data;
      return response;
    } catch (error: any) {
      return error?.response;
    }
  }
}

export { CronExpressionService };
