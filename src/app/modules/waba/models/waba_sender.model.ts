import {
  MetaData,
  SuccessResponse,
} from "../../../common/globals/common.model";

export interface WABASenderPayload {
  appWABASenderId?: string;
  name: string;
  description: string;
  mobile: string | number;
  provider: "D360" | "ValueFirst" | "";
  api_key: string;
  headers: string[];
}

export interface WABASender extends WABASenderPayload {
  appWABASenderId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateWABASenderResponse extends SuccessResponse {
  data: {
    WABASender: WABASender;
    message: string;
  };
}

export interface GetWABASendersResponse extends SuccessResponse {
  data: {
    WABASenders: WABASender[];
    metaData: MetaData;
    message: string;
  };
}

export interface GetWABASendersOptions {
  appWABASenderId?: string | null;
  provider?: "D360" | "ValueFirst" | null | string;
  search?: string | null;
  metaData?: MetaData;
  page?: number;
}

export interface UpdateWABASenderResponse extends SuccessResponse {}

export interface DeleteWABASenderResponse extends SuccessResponse {}
