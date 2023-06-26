import { MetaData, SuccessResponse } from "../../../common/globals/common.model";

export interface AppConstant {
  readonly appConstantId?: string;
  name: string;
  value: string;
  isAutoLoad: boolean | string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateConstantResponse extends SuccessResponse {
  data: {
    appConstant: AppConstant;
    message: string;
  }
}

export interface GetConstantResponse extends SuccessResponse {
  data: {
    appConstants: AppConstant[];
    metaData: MetaData;
    message: string;
  }
}

export interface GetConstantOptions {
  appConstantId?: string | null;
  search?: string | null;
  isAutoLoad?: boolean | string | null;
  metaData?: MetaData;
  page?: number;
}

export interface UpdateConstantResponse extends SuccessResponse { }

export interface DeleteConstantResponse extends SuccessResponse { }