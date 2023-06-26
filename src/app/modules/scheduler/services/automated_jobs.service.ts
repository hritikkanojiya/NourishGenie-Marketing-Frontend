import { httpClient } from "../../../common/axios/axios.config";
import { GENIE_MARKETING_API_VERSION } from "../../../common/globals/common.constants";
import { ErrorResponse } from "../../../common/globals/common.model";
import {
  AutomatedJob,
  CreateJobResponse,
  DeleteJobResponse,
  ForceExecuteJobResponse,
  GetJobsOptions,
  GetJobsResponse,
  ReadAutomatedJobLogsResponse,
  ReadJobLogsOptions,
  ToggleJobPayload,
  ToggleJobResponse,
  UpdateJobResponse,
} from "../models/automated_jobs.model";

class AutomatedJobsService {
  private static baseUrl = `/${GENIE_MARKETING_API_VERSION}/scheduler/automated-job`;

  static async createAutomatedJob(
    jobDetails: AutomatedJob
  ): Promise<CreateJobResponse | ErrorResponse> {
    try {
      const request = await httpClient.post(
        `${this.baseUrl}/create-automated-job`,
        jobDetails
      );
      const response: CreateJobResponse = request.data;
      return response;
    } catch (error: any) {
      return error?.response;
    }
  }

  static async getAutomatedJobs(
    options?: GetJobsOptions
  ): Promise<GetJobsResponse | ErrorResponse> {
    try {
      const request = await httpClient.post(
        `${this.baseUrl}/get-automated-job`,
        options
      );
      const response: GetJobsResponse = request.data;
      return response;
    } catch (error: any) {
      return error?.response;
    }
  }

  static async updateAutomatedJobs(
    jobDetails: AutomatedJob
  ): Promise<UpdateJobResponse | ErrorResponse> {
    try {
      const request = await httpClient.put(
        `${this.baseUrl}/update-automated-job`,
        jobDetails
      );
      const response: UpdateJobResponse = request.data;
      return response;
    } catch (error: any) {
      return error?.response;
    }
  }

  static async deleteAutomatedJobs(
    appAutomatedJobIds: string[]
  ): Promise<DeleteJobResponse | ErrorResponse> {
    try {
      const request = await httpClient.delete(
        `${this.baseUrl}/delete-automated-job`,
        { data: { appAutomatedJobIds } }
      );
      const response: DeleteJobResponse = request.data;
      return response;
    } catch (error: any) {
      return error?.response;
    }
  }

  static async toggleAutomatedJob(
    toggleDetails: ToggleJobPayload
  ): Promise<ToggleJobResponse | ErrorResponse> {
    try {
      const request = await httpClient.put(
        `${this.baseUrl}/toggle-automated-job`,
        toggleDetails
      );
      const response: ToggleJobResponse = request.data;
      return response;
    } catch (error: any) {
      return error?.response;
    }
  }

  static async forceExecuteAutomatedJob(
    appAutomatedJobIds: string[]
  ): Promise<ForceExecuteJobResponse | ErrorResponse> {
    try {
      const request = await httpClient.post(
        `${this.baseUrl}/force-execute-automated-job`,
        { appAutomatedJobIds }
      );
      const response: ToggleJobResponse = request.data;
      return response;
    } catch (error: any) {
      return error?.response;
    }
  }

  static async readAutomatedJobLogs(
    options?: ReadJobLogsOptions
  ): Promise<ReadAutomatedJobLogsResponse | ErrorResponse> {
    try {
      const request = await httpClient.post(
        `${this.baseUrl}/read-automated-job-logs`,
        options
      );
      const response: ReadAutomatedJobLogsResponse = request.data;
      return response;
    } catch (error: any) {
      return error?.response;
    }
  }
}

export { AutomatedJobsService };
