import { httpClient } from "../../../common/axios/axios.config";
import { GENIE_MARKETING_API_VERSION } from "../../../common/globals/common.constants";
import { ErrorResponse } from "../../../common/globals/common.model";
import { CreateSenderResponse, DeleteSenderResponse, GetSenderOptions, GetSendersResponse, SendInBlueSender, SyncSendersResponse, UpdateSenderResponse } from "../models/sendinblue_sender.model";

class SendInBlueSenderService {
  private static baseUrl = `/${GENIE_MARKETING_API_VERSION}/sendinblue/sender`;

  static async createSender(sender: SendInBlueSender): Promise<CreateSenderResponse | ErrorResponse> {
    try {
      const request = await httpClient.post(`${this.baseUrl}/create-sender`, sender);
      const response: CreateSenderResponse = request.data;
      return response;
    } catch (error: any) {
      return error?.response;
    }
  }

  static async getSenders(options?: GetSenderOptions): Promise<GetSendersResponse | ErrorResponse> {
    try {
      const request = await httpClient.post(`${this.baseUrl}/get-senders`, options);
      const response = request.data;
      return response;
    } catch (error: any) {
      return error?.response;
    }
  }

  static async updateSender(sender: SendInBlueSender): Promise<UpdateSenderResponse | ErrorResponse> {
    try {
      const request = await httpClient.put(`${this.baseUrl}/update-sender`, sender);
      const response: UpdateSenderResponse = request.data;
      return response;
    } catch (error: any) {
      return error?.response;
    }
  }

  static async deleteSender(appSendInBlueSenderIds: string[]): Promise<DeleteSenderResponse | ErrorResponse> {
    try {
      const request = await httpClient.delete(`${this.baseUrl}/delete-senders`, { data: { appSendInBlueSenderIds } });
      const response: DeleteSenderResponse = request.data;
      return response;
    } catch (error: any) {
      return error?.response;
    }
  }

  static async synchronizeSenders(): Promise<SyncSendersResponse | ErrorResponse> {
    try {
      const request = await httpClient.get(`${this.baseUrl}/synchronize-senders`);
      const response: SyncSendersResponse = request.data;
      return response;
    } catch (error: any) {
      return error?.response;
    }
  }

}

export { SendInBlueSenderService };