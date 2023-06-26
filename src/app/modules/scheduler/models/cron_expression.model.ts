import {
  MetaData,
  SuccessResponse,
} from "../../../common/globals/common.model";

export interface CronExpression {
  readonly appCronExpressionId?: string;
  name: string;
  description: string;
  expression: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateExpressionResponse extends SuccessResponse {
  data: {
    appCronExpression: CronExpression;
    message: string;
  };
}

export interface GetExpressionsResponse extends SuccessResponse {
  data: {
    appCronExpressions: CronExpression[];
    metaData: MetaData;
    message: string;
  };
}

export interface GetExpressionOptions {
  appCronExpressionId?: string | null;
  expression?: string | null;
  search?: string | null;
  metaData?: MetaData;
  page?: number;
}

export interface UpdateExpressionResponse extends SuccessResponse {}

export interface DeleteExpressionResponse extends SuccessResponse {}
