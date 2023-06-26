import { httpClient } from "../../../../common/axios/axios.config";
import { GENIE_MARKETING_API_VERSION } from "../../../../common/globals/common.constants";
import { ErrorResponse } from "../../../../common/globals/common.model";
import {
  CreateSenderResponse,
  DeleteSenderResponse,
  GetSenderOptions,
  GetSendersResponse,
  MSG91Sender,
  UpdateSenderResponse,
} from "../../models/sender/sender.model";

class SenderService {
  private static baseUrl = `/${GENIE_MARKETING_API_VERSION}/msg91/sender`;

  static async createSender(
    senderDetails: MSG91Sender
  ): Promise<CreateSenderResponse | ErrorResponse> {
    try {
      const request = await httpClient.post(
        `${this.baseUrl}/create-sender`,
        senderDetails
      );
      const response: CreateSenderResponse = request.data;
      return response;
    } catch (error: any) {
      return error?.response;
    }
  }

  static async getSenders(
    options?: GetSenderOptions
  ): Promise<GetSendersResponse | ErrorResponse> {
    try {
      const request = await httpClient.post(
        `${this.baseUrl}/get-sender`,
        options
      );
      const response: GetSendersResponse = request.data;
      return response;
    } catch (error: any) {
      return error?.response;
    }
  }

  static async updateSender(
    senderDetails: MSG91Sender
  ): Promise<UpdateSenderResponse | ErrorResponse> {
    try {
      const request = await httpClient.put(
        `${this.baseUrl}/update-sender`,
        senderDetails
      );
      const response: UpdateSenderResponse = request.data;
      return response;
    } catch (error: any) {
      return error?.response;
    }
  }

  static async deleteSender(
    appMSG91SenderIds: string[]
  ): Promise<DeleteSenderResponse | ErrorResponse> {
    try {
      const request = await httpClient.delete(`${this.baseUrl}/delete-sender`, {
        data: { appMSG91SenderIds },
      });
      const response: DeleteSenderResponse = request.data;
      return response;
    } catch (error: any) {
      return error?.response;
    }
  }
}

export { SenderService };
