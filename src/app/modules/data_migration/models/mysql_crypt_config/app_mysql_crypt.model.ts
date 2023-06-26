import {
  MetaData,
  SuccessResponse,
} from "../../../../common/globals/common.model";

export interface AppMySQLCrypt {
  readonly appMySQLCryptId?: string;
  name: string;
  description: string;
  secret_key_path: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateCryptResponse extends SuccessResponse {
  data: {
    MySQLCrypt: AppMySQLCrypt;
    message: string;
  };
}

export interface GetCryptResponse extends SuccessResponse {
  data: {
    appMySQLCrypts: AppMySQLCrypt[];
    metaData: MetaData;
    message: string;
  };
}

export interface GetCryptOptions {
  appMySQLCryptId?: string | null;
  search?: string | null;
  metaData?: MetaData;
  page?: number;
}

export interface UpdateCryptResponse extends SuccessResponse {}

export interface DeleteCryptResponse extends SuccessResponse {}
