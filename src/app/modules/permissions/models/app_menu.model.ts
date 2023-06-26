import {
  MetaData,
  SuccessResponse,
} from "../../../common/globals/common.model";

export interface AppMenuModel {
  readonly appMenuId?: string;
  name: string;
  description: string;
  hasSubMenus: boolean | string;
  url: string | null;
  appAccessGroupIds: string[];
  sequenceNumber?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateMenuResponse extends SuccessResponse {
  data: {
    appMenu: AppMenuModel;
    message: string;
  };
}

export interface GetMenuResponse extends SuccessResponse {
  data: {
    appMenus: AppMenuModel[];
    metaData: MetaData;
    message: string;
  };
}

export interface GetMenuOptions {
  appMenuId?: string | null;
  hasSubMenus?: boolean | null;
  appAccessGroupIds?: string[];
  search?: string | null;
  checkAppAccessGroupIds?: string[];
  metaData?: MetaData;
  page?: number;
}

export interface UpdateMenuResponse extends SuccessResponse {}

export interface DeleteMenuResponse extends SuccessResponse {}

export interface ToggleMenuResponse extends SuccessResponse {}
