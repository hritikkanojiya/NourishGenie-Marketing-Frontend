import {
  MetaData,
  SuccessResponse,
} from "../../../common/globals/common.model";

export interface AppContact {
  ngUserId: number;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  mobileDialCode: string;
  smsConfiguration: {
    smsNumber: string;
    _id: string;
  };
  whatsAppConfiguration: {
    whatsappNumber: string;
    _id: string;
  };
  sendInBlueConfiguration: {
    sendInBlueContactId: number;
    emailBlacklisted: boolean;
    smsBlacklisted: boolean;
    listIds: number[];
    attributes: any;
    _id: string;
  };
  pushNotificationConfiguration: {
    deviceId: string;
    _id: string;
  };
  isDeleted: boolean;
  appContactId: string;
  createdAt: Date;
  updatedAt: Date;
  __v: 0;
}

export interface CreateContactPayload {
  ngUserId: number;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  mobileDialCode: string;
  smsNumber: string;
  whatsappNumber: string;
  deviceId: string;
  appListIds: string[];
}

export interface CreateAppContactResponse extends SuccessResponse {
  data: {
    contactDetails: AppContact;
    message: string;
  };
}

export interface GetAppContactsResponse extends SuccessResponse {
  data: {
    appContacts: AppContact[];
    message: string;
    metaData: MetaData;
  };
}

export interface GetAppContactsOptions {
  appContactId?: string | null;
  ngUserId?: number | null;
  sendInBlueContactId?: number | null;
  search?: string | null;
  metaData?: MetaData;
  page?: number;
}

export interface UpdateAppContactResponse extends SuccessResponse {}

export interface DeleteAppContactResponse extends SuccessResponse {}

export interface ToggleListResponse extends SuccessResponse {}

export interface ImportContactsResponse extends SuccessResponse {}

export interface ToggleListPayload {
  appContactIds: string[];
  appListIds: string[];
  toggleAction: "ADD" | "REMOVE" | string;
}

export interface ImportContactsPayload {
  appDataSourceId: string;
  appListId: string;
}
