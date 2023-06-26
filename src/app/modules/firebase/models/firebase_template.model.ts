import {
  MetaData,
  SuccessResponse,
} from "../../../common/globals/common.model";

export interface FirebaseTemplate {
  readonly appFirebaseTemplateId?: string;
  name: string;
  title: string;
  body: string;
  bodyParams?: { matchedString: string; parameterName: string }[];
  data: any;
  isTestSent?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateTemplateResponse extends SuccessResponse {
  data: {
    firebaseTemplate: FirebaseTemplate;
    message: string;
  };
}

export interface GetTemplatesResponse extends SuccessResponse {
  data: {
    firebaseTemplates: FirebaseTemplate[];
    metaData: MetaData;
    message: string;
  };
}

export interface GetTemplateOptions {
  appFirebaseTemplateId?: string | null;
  search?: string | null;
  isTestSent?: boolean | string | null;
  metaData?: MetaData;
  page?: number;
}

export interface UpdateTemplateResponse extends SuccessResponse {}

export interface DeleteTemplateResponse extends SuccessResponse {}
