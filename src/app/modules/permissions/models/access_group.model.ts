import {
  MetaData,
  SuccessResponse,
} from "../../../common/globals/common.model";

export interface AccessGroupModel {
  readonly appAccessGroupId?: string;
  name: string;
  description: string;
  isAdministrator: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  totalAppAgents?: number;
}

export interface GetGroupOptions {
  appAccessGroupId?: string | null;
  isAdministrator?: boolean | null;
  search?: string | null;
  metaData?: MetaData;
  page?: number;
}

export interface GetGroupsResponse extends SuccessResponse {
  data: {
    appAccessGroups: AccessGroupModel[];
    metaData: MetaData;
    message: string;
  };
}

export interface CreateGroupResponse extends SuccessResponse {
  data: {
    appAccessGroup: AccessGroupModel;
    message: string;
  };
}

export interface UpdateGroupResponse extends SuccessResponse { }

export interface DeleteGroupResponse extends SuccessResponse { }
