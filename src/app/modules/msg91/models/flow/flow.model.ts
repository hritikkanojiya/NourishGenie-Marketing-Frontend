import {
  MetaData,
  SuccessResponse,
} from "../../../../common/globals/common.model";

export interface MSG91Flow {
  readonly appMSG91FlowId?: string;
  MSG91FlowId?: string;
  MSG91SenderId: string;
  flowName: string;
  smsType?: 1;
  receiver?: "##mobiles##" | string;
  message: string;
  dltTemplateId: string;
  description: string;
  requestType: "FRESH" | "EXISTING" | "";
  existingFlowId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateFlowResponse extends SuccessResponse {
  data: {
    MSG91Flow: MSG91Flow;
    message: string;
  };
}

export interface GetFlowResponse extends SuccessResponse {
  data: {
    MSG91Flows: MSG91Flow[];
    message: string;
    metaData: MetaData;
  };
}

export interface GetFlowOptions {
  appMSG91FlowId?: string | null;
  appMSG91SenderId?: string | null;
  MSG91FlowId?: string | null;
  isTestSent?: boolean | null | string;
  search?: string | null;
  metaData?: MetaData;
  page?: number;
}
