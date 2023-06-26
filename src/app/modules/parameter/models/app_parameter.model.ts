import {
  MetaData,
  SuccessResponse,
} from "../../../common/globals/common.model";

export interface AppParameter {
  readonly appParameterId?: string;
  name: string;
  description: string;
  config: {
    category: "CONTACT" | "MARKETING";
    type: "STATIC" | "DYNAMIC" | null;
    value: string | null;
    default: string | null;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateAppParameterResponse extends SuccessResponse {
  data: {
    appParameter: AppParameter;
    message: string;
  };
}

export interface GetAppParametersResponse extends SuccessResponse {
  data: {
    appParameters: AppParameter[];
    message: string;
    metaData: MetaData;
  };
}

export interface GetAppParameterOptions {
  appParameterId?: string | null;
  category?: "CONTACT" | "MARKETING" | null | string;
  type?: "STATIC" | "DYNAMIC" | null | string;
  search?: string | null;
  metaData?: MetaData;
  page?: number;
}

export interface UpdateAppParameterResponse extends SuccessResponse {}

export interface DeleteAppParameterResponse extends SuccessResponse {}

export interface SearchParameterPayload {
  rawString: string;
  appContactId: string | null;
  replaceParameters: boolean;
}

export interface MatchedParams {
  matchedString: string;
  parameterName: string;
  replaceWith: string;
}

export interface SearchParamsResponse extends SuccessResponse {
  data: {
    appParameters: MatchedParams[];
    constructedString: string | null;
    message: string;
  };
}
