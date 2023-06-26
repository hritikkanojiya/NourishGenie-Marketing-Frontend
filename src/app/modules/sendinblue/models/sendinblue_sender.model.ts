import {
  MetaData,
  SuccessResponse,
} from "../../../common/globals/common.model";

export interface SendInBlueSender {
  readonly appSendInBlueSenderId?: string;
  sendInBlueSenderId?: number;
  name: string;
  description: string;
  email: string;
  isVerified?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateSenderResponse extends SuccessResponse {
  data: {
    sendInBlueSender: SendInBlueSender;
    message: string;
  };
}

export interface GetSendersResponse extends SuccessResponse {
  data: {
    sendInBlueSenders: SendInBlueSender[];
    metaData: MetaData;
    message: string;
  };
}

export interface GetSenderOptions {
  appSendInBlueSenderId?: string | null;
  sendInBlueSenderId?: number | null;
  isVerified?: boolean | string | null;
  search?: string | null;
  metaData?: MetaData;
  page?: number;
}

export interface UpdateSenderResponse extends SuccessResponse {}

export interface DeleteSenderResponse extends SuccessResponse {}

export interface SyncSendersResponse extends SuccessResponse {}
