import {
  MetaData,
  SuccessResponse,
} from "../../../common/globals/common.model";

export interface SmartFunction {
  readonly appSmartFunctionId?: string;
  name: string;
  description: string;
  parameters: {
    parameterName: string;
    required: boolean;
  }[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateFunctionResponse extends SuccessResponse {
  data: {
    appSmartFunction: SmartFunction;
    message: string;
  };
}

export interface GetFunctionsResponse extends SuccessResponse {
  data: {
    appSmartFunctions: SmartFunction[];
    metaData: MetaData;
    message: string;
  };
}

export interface GetFunctionsOptions {
  appSmartFunctionId?: string | null;
  search?: string | null;
  metaData?: MetaData;
  page?: number;
}

export interface UpdateFunctionResponse extends SuccessResponse {}

export interface DeleteFunctionResponse extends SuccessResponse {}
