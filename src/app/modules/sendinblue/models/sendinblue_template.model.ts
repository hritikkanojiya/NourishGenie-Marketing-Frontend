import {
  MetaData,
  SuccessResponse,
} from "../../../common/globals/common.model";

export interface SendInBlueTemplate {
  readonly appSendInBlueTemplateId?: string;
  sendInBlueTemplateId?: number;
  name: string;
  subject: string;
  tag: string;
  appSendInBlueSenderId: string;
  replyTo: string;
  toField: string;
  htmlContent: string;
  attachmentUrl: string | null;
  htmlContentParams?: { matchedString: string; parameterName: string }[];
  isTestSent?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateTemplateResponse extends SuccessResponse {
  data: {
    sendInBlueTemplate: SendInBlueTemplate;
    message: string;
  };
}

export interface GetTemplatesResponse extends SuccessResponse {
  data: {
    sendInBlueTemplates: SendInBlueTemplate[];
    message: string;
    metaData: MetaData;
  };
}

export interface GetTemplateOptions {
  appSendInBlueTemplateId?: string | null;
  sendInBlueTemplateId?: number | null;
  appSendInBlueSenderId?: number | null;
  isTestSent?: boolean | string | null;
  search?: string | null;
  metaData?: MetaData;
  page?: number;
}

export interface UpdateTemplateResponse extends SuccessResponse {}

export interface DeleteTemplateResponse extends SuccessResponse {}

export interface TestTemplatePayload {
  appSendInBlueTemplateId: string;
  appListId: string;
}

export interface TestTemplateResponse extends SuccessResponse {}
