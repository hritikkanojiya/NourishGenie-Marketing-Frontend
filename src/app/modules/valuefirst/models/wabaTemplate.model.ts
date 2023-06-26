import {
  MetaData,
  SuccessResponse,
} from "../../../common/globals/common.model";

export interface WABATemplatePayload {
  name: string;
  description: string;
  appWABASenderId: string;
  category: "MARKETING" | "UTILITY" | "AUTHENTICATION" | "";
  language: {
    policy: string;
    code: string;
  };
  allow_category_change: boolean | string;
  origin: "MANUAL" | "API";
  isValidated: boolean;
  status?: "PENDING" | "SUBMITTED" | "APPROVED" | "REJECTED";
  requestType: "FRESH" | "EXISTING" | "";
  // language: string;
  type: "STANDARD" | "MEDIA" | "";
  components: {
    componentType: "BODY" | "HEADER" | "FOOTER" | "BUTTONS" | "";
    metaData: {
      format: "TEXT" | "IMAGE" | "VIDEO" | "DOCUMENT";
      text: string;
      hasParameters: boolean;
      example?: {
        header_text?: string[];
        header_handle?: string[];
        body_text?: [string[]];
      };
    };
  }[];
}

export interface WABATemplate {
  appWABAValueFirstTemplateId: string;
  name: string;
  description: string;
  type: "STANDARD" | "MEDIA";
  category: "MARKETING" | "UTILITY" | "AUTHENTICATION";
  language: {
    policy: string;
    code: string;
  };
  namespace: string;
  isValidated: boolean;
  components: {
    componentType: "BODY" | "HEADER" | "FOOTER" | "BUTTONS";
    metaData: {
      format: "TEXT" | "IMAGE" | "VIDEO" | "DOCUMENT";
      text: string;
      hasParameters: boolean;
      url?: {
        value: string;
        hasParameters: boolean;
        example: string[];
      };
      buttonType?: "QUICK_REPLY" | "PHONE_NUMBER" | "URL";
      example: any;
      payloadText: string;
      parameters: { matchedString: string; parameterName: string }[];
    };
  }[];
  requestType: "FRESH" | "EXISTING" | "";
  origin: "MANUAL" | "API";
  rejected_reason: string | null;
  status: "SUBMITTED" | "APPROVED" | "REJECTED";
  provider: "D360" | "ValueFirst";
  createdAt: Date;
  updatedAt: Date;
  appWABASender: {
    appWABASenderId: string;
    name: string;
    description: string;
    mobile: string;
    provider: "D360" | "ValueFirst";
  };
}

export interface CreateTemplateResponse extends SuccessResponse {
  data: {
    D360WABATemplate: WABATemplate;
    message: string;
  };
}

export interface GetWabaTemplatesResponse extends SuccessResponse {
  data: {
    WABATemplates: WABATemplate[];
    metaData: MetaData;
    message: string;
  };
}

export interface GetWabaTemplatesOptions {
  appWABAValueFirstTemplateId?: string | null;
  appWABASenderId?: string | null;
  valueFirstTemplateId?: number | null;
  isTestSent?: Boolean | null;
  status?: "SUBMITTED" | "APPROVED" | "REJECTED" | null | string;
  category?: "MARKETING" | "UTILITY" | "AUTHENTICATION" | null | string;
  type?: "STANDARD" | "MEDIA" | null | string;
  search?: string | null | string;
  metaData?: MetaData;
  page?: number;
}

export interface DeleteWabaTemplatesResponse extends SuccessResponse {}

export interface SyncWabaTemplatesResponse extends SuccessResponse {}

export interface UpdateWABATemplateComponentPayload {
  appWABAValueFirstTemplateId: string;
  components: {
    componentType: "BODY" | "HEADER" | "FOOTER" | "BUTTONS" | "";
    metaData: {
      format: "TEXT" | "IMAGE" | "VIDEO" | "DOCUMENT";
      text: string;
      hasParameters: boolean;
      url?: {
        value: string;
        hasParameters: boolean;
        example: string[];
      };
      buttonType?: "QUICK_REPLY" | "PHONE_NUMBER" | "URL";
      example?: {
        header_text?: string[];
        header_handle?: string[];
        body_text?: [string[]];
      };
    };
  }[];
}

export interface UpdateWABATemplateComponentResponse extends SuccessResponse {}
