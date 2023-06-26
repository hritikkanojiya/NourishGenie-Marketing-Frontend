import {
  MetaData,
  SuccessResponse,
} from "../../../../common/globals/common.model";

export interface AppDataSource {
  readonly appDataSourceId?: string;
  name: string;
  description: string;
  sql_query: string;
  fields: { name: string; isEncrypted: boolean }[];
  lastExecuted?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateDataSourceResponse extends SuccessResponse {
  data: {
    appDataSource: AppDataSource;
    message: string;
  };
}

export interface GetDataSourceResponse extends SuccessResponse {
  data: {
    appDataSources: AppDataSource[];
    metaData: MetaData;
    message: string;
  };
}

export interface GetDataSourceOptions {
  appDataSourceId?: string | null;
  search?: string | null;
  metaData?: MetaData;
  page?: number;
}

export interface GetDataSourceRecordOptions {
  appDataSourceId?: string | null;
  versionNumber?: number | null;
  ngUserId?: number | null;
  search?: string | null;
  isSkipped?: boolean | null;
  metaData?: MetaData;
}

export interface GetDataSourceFieldsPayload {
  query: string;
  checkOn: "Query";
}

export interface GetDataSourceFieldsResponse extends SuccessResponse {
  data: {
    fields: { name: string; isEncrypted: boolean }[];
    message: string;
  };
}

export interface UpdateDataSourceResponse extends SuccessResponse {}

export interface DeleteDataSourceResponse extends SuccessResponse {}

export interface DataSourceLogs {
  readonly appDataSourceId: string;
  type: string;
  description: string;
  scriptPath: string;
  methodName: string;
  recordsFetched: string;
  createdAt: Date;
  updatedAt: Date;
  appDataSourceLogId: string;
}

export interface ReadDataSourceLogsResponse extends SuccessResponse {
  data: {
    appDataSourceLogs: DataSourceLogs[];
    metaData: MetaData;
    message: string;
  };
}

export interface ReadDataSourceLogOptions {
  appDataSourceId?: string | null;
  metaData?: MetaData;
}

export interface ExecuteDataSourceResponse extends SuccessResponse {}

export interface DataSourceRecord {
  ngUserId: number;
  email: string;
  firstName: string;
  lastName: string;
  hashedEmail: string;
  mobile: string;
  mobileDialCode: string;
  whatsappNumber: string;
  smsNumber: string;
  deviceId: string;
  dsVersionNum: string;
  isSkipped: boolean;
  appDataSourceRecordId: string;
}

export interface GetDataSourceRecordsResponse extends SuccessResponse {
  data: {
    appDataSourceRecords: DataSourceRecord[];
    metaData: MetaData;
    message: string;
  };
}

export interface DeleteDataSourceRecordPayload {
  appDataSourceId: string;
  appDataSourceRecordIds: string[];
}

export interface DeleteDataSourceRecordsResponse extends SuccessResponse {}

export interface SkipDataSourcePayload {
  appDataSourceId: string;
  appDataSourceRecordIds: string[];
  isSkipped: boolean;
}

export interface SkipDataSourceResponse extends SuccessResponse {}
