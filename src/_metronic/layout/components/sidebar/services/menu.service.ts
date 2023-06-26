import { httpClient } from "../../../../../app/common/axios/axios.config";
import { ErrorResponse } from "../../../../../app/common/globals/common.model";
import { ConstructMenuResponse } from "../models/menu.model";

class MenuService {
  static async constructMenu(): Promise<ConstructMenuResponse | ErrorResponse> {
    try {
      const request = await httpClient.get(
        "/v1/permission/menu/construct-menu"
      );
      const response: ConstructMenuResponse = request.data;
      return response;
    } catch (error: any) {
      return error?.response;
    }
  }
}

export { MenuService };
