import {
  MetaData,
  SuccessResponse,
} from "../../../../common/globals/common.model";

export interface MSG91Sender {
  readonly appMSG91SenderId?: string;
  MSG91SenderId: string;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateSenderResponse extends SuccessResponse {
  data: {
    MSG91Sender: MSG91Sender;
    message: string;
  };
}

export interface GetSendersResponse extends SuccessResponse {
  data: {
    MSG91Senders: MSG91Sender[];
    metaData: MetaData;
    message: string;
  };
}

export interface GetSenderOptions {
  appMSG91SenderId?: string | null;
  MSG91SenderId?: string | null;
  search?: string | null;
  metaData?: MetaData;
  page?: number;
}

export interface UpdateSenderResponse extends SuccessResponse { }

export interface DeleteSenderResponse extends SuccessResponse { }
