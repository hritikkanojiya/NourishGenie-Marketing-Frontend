import {
  MetaData,
  SuccessResponse,
} from "../../../common/globals/common.model";

export interface AppList {
  readonly appListId?: string;
  name: string;
  description: string;
  totalContacts?: number;
  sendInBlue?: {
    sendInBlueFolderId: number;
    sendInBlueListId: number;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateAppListResponse extends SuccessResponse {
  data: {
    appList: AppList;
    message: string;
  };
}

export interface GetAppListResponse extends SuccessResponse {
  data: {
    appLists: AppList[];
    metaData: MetaData;
    message: string;
  };
}

export interface GetAppListOptions {
  appListId?: string | null;
  name?: string | null;
  sendInBlue?: {
    sendInBlueFolderId?: number | null;
    sendInBlueListId?: number | null;
  };
  search?: string | null;
  metaData?: MetaData;
  page?: number;
}

export interface UpdateAppListResponse extends SuccessResponse {}

export interface DeleteAppListResponse extends SuccessResponse {}
