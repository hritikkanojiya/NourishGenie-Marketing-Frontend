import { httpClient } from "../../../../common/axios/axios.config";
import { GENIE_MARKETING_API_VERSION } from "../../../../common/globals/common.constants";
import { ErrorResponse } from "../../../../common/globals/common.model";
import {
  AppDataSource,
  CreateDataSourceResponse,
  DeleteDataSourceRecordPayload,
  DeleteDataSourceRecordsResponse,
  DeleteDataSourceResponse,
  ExecuteDataSourceResponse,
  GetDataSourceFieldsPayload,
  GetDataSourceFieldsResponse,
  GetDataSourceOptions,
  GetDataSourceRecordOptions,
  GetDataSourceRecordsResponse,
  GetDataSourceResponse,
  ReadDataSourceLogOptions,
  ReadDataSourceLogsResponse,
  SkipDataSourcePayload,
  SkipDataSourceResponse,
  UpdateDataSourceResponse,
} from "../../models/data_sources/app_datasource.model";

class AppDataSourceService {
  private static baseUrl = `/${GENIE_MARKETING_API_VERSION}/migration/data-source`;

  static async createDataSource(
    dataSource: AppDataSource
  ): Promise<CreateDataSourceResponse | ErrorResponse> {
    try {
      const request = await httpClient.post(
        `${this.baseUrl}/create-data-source`,
        dataSource
      );
      const response: CreateDataSourceResponse = request.data;
      return response;
    } catch (error: any) {
      return error?.response;
    }
  }

  static async getDataSource(
    option?: GetDataSourceOptions
  ): Promise<GetDataSourceResponse | ErrorResponse> {
    try {
      const request = await httpClient.post(
        `${this.baseUrl}/get-data-source`,
        option
      );
      const response: GetDataSourceResponse = request.data;
      return response;
    } catch (error: any) {
      return error?.response;
    }
  }

  static async getDataSourceRecords(
    option?: GetDataSourceRecordOptions
  ): Promise<GetDataSourceRecordsResponse | ErrorResponse> {
    try {
      const request = await httpClient.post(
        `${this.baseUrl}/get-data-source-records`,
        option
      );
      const response: GetDataSourceRecordsResponse = request.data;
      return response;
    } catch (error: any) {
      return error?.response;
    }
  }

  static async getDataSourceFields(
    payload: GetDataSourceFieldsPayload
  ): Promise<GetDataSourceFieldsResponse | ErrorResponse> {
    try {
      const request = await httpClient.post(
        `${this.baseUrl}/get-data-source-fields`,
        payload
      );
      const response: GetDataSourceFieldsResponse = request.data;
      return response;
    } catch (error: any) {
      return error?.response;
    }
  }

  static async updateDataSource(
    datasource: AppDataSource
  ): Promise<UpdateDataSourceResponse | ErrorResponse> {
    try {
      const request = await httpClient.put(
        `${this.baseUrl}/update-data-source`,
        datasource
      );
      const response: UpdateDataSourceResponse = request.data;
      return response;
    } catch (error: any) {
      return error?.response;
    }
  }

  static async deleteDataSource(
    dataSourceIds: string[]
  ): Promise<DeleteDataSourceResponse | ErrorResponse> {
    try {
      const request = await httpClient.delete(
        `${this.baseUrl}/delete-data-source`,
        { data: { dataSourceIds } }
      );
      const response: DeleteDataSourceResponse = request.data;
      return response;
    } catch (error: any) {
      return error?.response;
    }
  }

  static async deleteDataSourceRecords(
    payload: DeleteDataSourceRecordPayload
  ): Promise<DeleteDataSourceRecordsResponse | ErrorResponse> {
    try {
      const request = await httpClient.delete(
        `${this.baseUrl}/delete-data-source-records`,
        { data: payload }
      );
      const response: DeleteDataSourceRecordsResponse = request.data;
      return response;
    } catch (error: any) {
      return error?.response;
    }
  }

  static async skipDatasource(
    payload: SkipDataSourcePayload
  ): Promise<SkipDataSourceResponse | ErrorResponse> {
    try {
      const request = await httpClient.put(
        `${this.baseUrl}/skip-data-source-records`,
        payload
      );
      const response: SkipDataSourceResponse = request.data;
      return response;
    } catch (error: any) {
      return error?.response;
    }
  }

  static async executeDataSource(
    appDataSourceId: string
  ): Promise<ExecuteDataSourceResponse | ErrorResponse> {
    try {
      const request = await httpClient.post(
        `${this.baseUrl}/execute-data-source`,
        { appDataSourceId }
      );
      const response: ExecuteDataSourceResponse = request.data;
      return response;
    } catch (error: any) {
      return error?.response;
    }
  }

  static async readDataSourceLogs(
    option?: ReadDataSourceLogOptions
  ): Promise<ReadDataSourceLogsResponse | ErrorResponse> {
    try {
      const request = await httpClient.post(
        `${this.baseUrl}/read-data-source-logs`,
        option
      );
      const response: ReadDataSourceLogsResponse = request.data;
      return response;
    } catch (error: any) {
      return error?.response;
    }
  }
}

export { AppDataSourceService };
