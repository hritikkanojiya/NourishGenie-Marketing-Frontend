import { httpClient } from "../../../common/axios/axios.config"
import { GENIE_MARKETING_API_VERSION } from "../../../common/globals/common.constants"
import { ErrorResponse } from "../../../common/globals/common.model"
import { CreateWABASenderResponse, DeleteWABASenderResponse, GetWABASendersOptions, GetWABASendersResponse, UpdateWABASenderResponse, WABASenderPayload } from "../models/waba_sender.model"

class WABASenderService {
  private static baseUrl = `/${GENIE_MARKETING_API_VERSION}/waba/sender`

  static async createSender(payload: WABASenderPayload): Promise<CreateWABASenderResponse | ErrorResponse> {
    try {
      const request = await httpClient.post(`${this.baseUrl}/create-sender`, payload);
      const response: CreateWABASenderResponse = request.data;
      return response;
    } catch (error: any) {
      return error?.response;
    }
  }

  static async getSenders(options?: GetWABASendersOptions): Promise<GetWABASendersResponse | ErrorResponse> {
    try {
      const request = await httpClient.post(`${this.baseUrl}/get-senders`, options);
      const response: GetWABASendersResponse = request.data;
      return response;
    } catch (error: any) {
      return error?.response;
    }
  }

  static async updateSenders(payload: WABASenderPayload): Promise<UpdateWABASenderResponse | ErrorResponse> {
    try {
      const request = await httpClient.put(`${this.baseUrl}/update-sender`, payload);
      const response: UpdateWABASenderResponse = request.data;
      return response;
    } catch (error: any) {
      return error?.response;
    }
  }

  static async deleteSenders(appWABASenderIds: string[]): Promise<DeleteWABASenderResponse | ErrorResponse> {
    try {
      const request = await httpClient.delete(`${this.baseUrl}/delete-senders`, { data: { appWABASenderIds } });
      const response: DeleteWABASenderResponse = request.data;
      return response;
    } catch (error: any) {
      return error?.response;
    }
  }

}

export { WABASenderService }