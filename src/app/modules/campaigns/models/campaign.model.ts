import { Dispatch, SetStateAction } from "react";
import {
  MetaData,
  SuccessResponse,
} from "../../../common/globals/common.model";
import { WABATemplate } from "../../valuefirst/models/wabaTemplate.model";

export interface CreateAppCampaignPayload {
  name: string;
  description: string;
  appListIds: string[];
  platforms: {
    email: {
      sendInBlue: {
        appSendInBlueTemplateId: string;
      };
      config: {
        senderId: string;
      };
    };
    whatsapp: any;
    sms: {
      msg91: {
        appMSG91FlowId: string;
      };
      config: {
        senderId: string;
      };
    };
    pushNotification: {
      firebase: {
        appFirebaseTemplateId: string;
      };
    };
  };
  tag: string[];
  utmCampaign: string;
}

export interface AppCampaign extends SuccessResponse {
  readonly appCampaignId: string;
  appAgentAccDetails: {
    readonly appAgentId: string;
    email: string;
    username: string;
    appAccessGroup: {
      readonly appAccessGroupId: string;
      name: string;
      description: string;
      isAdministrator: boolean;
    };
  };
  name: string;
  description: string;
  appLists: {
    name: string;
    description: string;
    sendInBlue: {
      folderId: string;
      sendInBlueListId: number;
    };
    createdAt: Date;
    appListId: string;
    totalContacts: string;
  };
  platforms: {
    email: {
      serviceName: string;
      sendInBlue: {
        appSendInBlueTemplateId: string;
        sendInBlueCampaignId: string;
        subject: string;
        replyTo: string;
        htmlContent: string;
        htmlContentParams: { matchedString: string; parameterName: string }[];
        header: string;
        footer: string;
        toField: string;
        type: string;
        status: string;
        config: {
          senderId: string;
        };
        readonly _id: string;
      };
      whatsapp: any;
      sms: {
        serviceName: string;
        msg91: {
          readonly appMSG91FlowId: string;
          messageBody: string;
          messageBodyParams: any;
        };
        config: {
          senderId: string;
        };
        readonly _id: string;
      };
      pushNotification: {
        serviceName: string;
        firebase: {
          firebaseTemplateId: string;
          templateBody: string;
          templateBodyParams: {
            matchedString: string;
            parameterName: string;
          }[];
        };
        readonly _id: string;
      };
    };
  };
  tag: string[];
  utmCampaign: string;
  isTestSent: boolean;
  status: string;
  scheduledAt: Date | null;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCampaignResponse extends SuccessResponse {
  data: {
    appCampaignDetail: AppCampaign;
    message: string;
  };
}

export interface GetCampaignsResponse extends SuccessResponse {
  data: {
    appCampaignDetails: AppCampaign[];
    message: string;
    metaData: MetaData;
  };
}

export interface GetCampaignsOptions {
  appCampaignId?: string | null;
  search?: string | null;
  metaData?: MetaData;
  page?: number;
}

export interface TestCampaignPayload {
  appCampaignId: string;
  appListId?: string;
}

export interface TestCampaignResponse extends SuccessResponse {}

export interface ScheduleCampaignPayload extends TestCampaignPayload {
  scheduledAt: Date | "";
}

export interface ScheduleCampaignResponse extends SuccessResponse {}

export interface StepProps {
  hasError: boolean;
  formik: any;
  isReadOnly?: boolean;
  editMode?: boolean;
  platforms?: string[];
  services?: string[];
  setPlatforms?: any;
  setService?: any;
  setValidForm?: Dispatch<SetStateAction<boolean>>;
  wabaTemplateDetails?: WABATemplate | {};
}
