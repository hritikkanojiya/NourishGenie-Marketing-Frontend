import { httpClient } from "../../../../common/axios/axios.config";
import { GENIE_MARKETING_API_VERSION } from "../../../../common/globals/common.constants";
import { ErrorResponse } from "../../../../common/globals/common.model";
import {
  AppMySQLCrypt,
  CreateCryptResponse,
  DeleteCryptResponse,
  GetCryptOptions,
  GetCryptResponse,
  UpdateCryptResponse,
} from "../../models/mysql_crypt_config/app_mysql_crypt.model";

class AppMySQLCryptService {
  private static baseUrl = `/${GENIE_MARKETING_API_VERSION}/migration/mysql-crypt`;

  static async createMySQLCrypt(
    mysqlCrypt: AppMySQLCrypt
  ): Promise<CreateCryptResponse | ErrorResponse> {
    try {
      const request = await httpClient.post(
        `${this.baseUrl}/create-crypt`,
        mysqlCrypt
      );
      const response: CreateCryptResponse = request.data;
      return response;
    } catch (error: any) {
      return error?.response;
    }
  }

  static async getMySQLCrypts(
    option?: GetCryptOptions
  ): Promise<GetCryptResponse | ErrorResponse> {
    try {
      const request = await httpClient.post(
        `${this.baseUrl}/get-crypt`,
        option
      );
      const response: GetCryptResponse = request.data;
      return response;
    } catch (error: any) {
      return error?.response;
    }
  }

  static async updateMySQLCrypt(
    mysqlCrypt: AppMySQLCrypt
  ): Promise<UpdateCryptResponse | ErrorResponse> {
    try {
      const request = await httpClient.put(
        `${this.baseUrl}/update-crypt`,
        mysqlCrypt
      );
      const response: UpdateCryptResponse = request.data;
      return response;
    } catch (error: any) {
      return error?.response;
    }
  }

  static async deleteMySQLCrypt(
    appMySQLCryptIds: string[]
  ): Promise<DeleteCryptResponse | ErrorResponse> {
    try {
      const request = await httpClient.delete(`${this.baseUrl}/delete-crypt`, {
        data: { appMySQLCryptIds },
      });
      const response: DeleteCryptResponse = request.data;
      return response;
    } catch (error: any) {
      return error?.response;
    }
  }
}

export { AppMySQLCryptService };
