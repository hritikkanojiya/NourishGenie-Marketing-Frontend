import {
  GetResponseOptions,
  MetaData,
  SuccessResponse,
} from "../../../common/globals/common.model";

type METHODS = "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | null;

export interface ServiceRoute {
  readonly appRouteId?: string;
  method: METHODS;
  path: string;
  secure: boolean | string;
  appAccessGroupIds: string[];
  type?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateRouteResponse extends SuccessResponse {
  data: {
    appRoute: ServiceRoute;
    message: string;
  };
}

export interface GetRoutesResponse extends SuccessResponse {
  data: {
    appRoutes: ServiceRoute[];
    metaData: MetaData;
    message: string;
  };
}

export interface GetRouteOptions extends GetResponseOptions {
  appRouteId?: string | null;
  method?: METHODS | string | null;
  secure?: boolean | string | null;
  appAccessGroupIds?: string[] | null;
  search?: string | null;
  metaData?: MetaData;
  page?: any;
}

export interface UpdateRouteResponse extends SuccessResponse {}

export interface DeleteRouteResponse extends SuccessResponse {}
