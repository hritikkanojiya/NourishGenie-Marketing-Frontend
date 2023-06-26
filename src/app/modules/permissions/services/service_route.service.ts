import { httpClient } from "../../../common/axios/axios.config";
import { GENIE_MARKETING_API_VERSION } from "../../../common/globals/common.constants";
import { ErrorResponse } from "../../../common/globals/common.model";
import {
  CreateRouteResponse,
  DeleteRouteResponse,
  GetRouteOptions,
  GetRoutesResponse,
  ServiceRoute,
  UpdateRouteResponse,
} from "../models/service_route.model";

class ServiceRouteService {
  private static baseUrl = `/${GENIE_MARKETING_API_VERSION}/permission/service-route`;

  static async getServiceRoutes(
    options?: GetRouteOptions
  ): Promise<GetRoutesResponse | ErrorResponse> {
    try {
      const request = await httpClient.post(
        `${this.baseUrl}/get-route`,
        options
      );
      const response: GetRoutesResponse = request.data;
      return response;
    } catch (error: any) {
      return error?.response;
    }
  }

  static async createServiceRoute(
    routeDetails: ServiceRoute
  ): Promise<CreateRouteResponse | ErrorResponse> {
    try {
      const request = await httpClient.post(
        `${this.baseUrl}/create-route`,
        routeDetails
      );
      const response: CreateRouteResponse = request.data;
      return response;
    } catch (error: any) {
      return error?.response;
    }
  }

  static async updateServiceRoute(
    routeDetails: ServiceRoute
  ): Promise<UpdateRouteResponse | ErrorResponse> {
    try {
      const request = await httpClient.put(
        `${this.baseUrl}/update-route`,
        routeDetails
      );
      const response: UpdateRouteResponse = request.data;
      return response;
    } catch (error: any) {
      return error?.response;
    }
  }

  static async deleteServiceRoute(
    appRouteIds: string[]
  ): Promise<DeleteRouteResponse | ErrorResponse> {
    try {
      const request = await httpClient.delete(`${this.baseUrl}/delete-route`, {
        data: { appRouteIds },
      });
      const response: DeleteRouteResponse = request.data;
      return response;
    } catch (error: any) {
      return error?.response;
    }
  }
}

export { ServiceRouteService };
