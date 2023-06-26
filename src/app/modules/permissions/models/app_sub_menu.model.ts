import {
  MetaData,
  SuccessResponse,
} from "../../../common/globals/common.model";

export interface AppSubMenuModel {
  readonly appSubMenuId?: string;
  appMenuId?: string;
  description: string;
  name: string;
  url: string;
  sequenceNumber?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface GetSubMenusResponse extends SuccessResponse {
  data: {
    appSubMenus: AppSubMenuModel[];
    message: string;
    metaData: MetaData;
  };
}

export interface GetSubMenuOptions {
  appSubMenuId?: string | null;
  appMenuId?: string | null;
  search?: string | null;
  metaData?: MetaData;
  page?: number;
}

export interface CreateSubMenuResponse extends SuccessResponse {
  data: {
    appSubMenus: {
      appMenuId: string;
      appSubMenus: AppSubMenuModel[];
    };
    message: string;
  };
}

export interface CreateSubMenuPayload {
  appMenuId: string;
  appSubMenus: AppSubMenuModel[];
}

export interface UpdateSubMenuResponse extends SuccessResponse {}

export interface DeleteSubMenuResponse extends SuccessResponse {}
