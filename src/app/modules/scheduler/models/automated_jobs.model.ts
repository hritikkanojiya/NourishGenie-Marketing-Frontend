import {
  MetaData,
  SuccessResponse,
} from "../../../common/globals/common.model";

export interface AutomatedJob {
  readonly appAutomatedJobId?: string;
  appCronExpressionId: string;
  appSmartFunctionId: string;
  name: string;
  description: string;
  parameters: any;
  isActive: boolean | string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateJobResponse extends SuccessResponse {
  data: {
    appAutomatedJob: AutomatedJob;
    message: string;
  };
}

export interface GetJobsResponse extends SuccessResponse {
  data: {
    appAutomatedJobs: AutomatedJob[];
    metaData: MetaData;
    message: string;
  };
}

export interface GetJobsOptions {
  appAutomatedJobId?: string | null;
  appCronExpressionId?: string | null;
  appSmartFunctionId?: string | null;
  isActive?: boolean | string | null;
  search?: string | null;
  metaData?: MetaData;
  page?: number;
}

export interface UpdateJobResponse extends SuccessResponse {}

export interface DeleteJobResponse extends SuccessResponse {}

export interface ToggleJobPayload {
  appAutomatedJobIds: string[];
  isActive: boolean;
}

export interface ToggleJobResponse extends SuccessResponse {}

export interface ForceExecuteJobResponse extends SuccessResponse {}

export interface AutomatedJobLogs {
  readonly automatedJobLogId: string;
  readonly appAutomatedJobId: string;
  type: string;
  description: string;
  scriptPath: string;
  methodName: string;
  isDeleted: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReadAutomatedJobLogsResponse extends SuccessResponse {
  data: {
    automatedJobLogs: AutomatedJobLogs[];
    message: string;
    metaData: MetaData;
  };
}

export interface ReadJobLogsOptions {
  appAutomatedJobId?: string | null;
  metaData?: MetaData;
}
