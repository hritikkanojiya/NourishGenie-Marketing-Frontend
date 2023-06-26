import { httpClient } from "../../../common/axios/axios.config";
import { GENIE_MARKETING_API_VERSION } from "../../../common/globals/common.constants";
import { ErrorResponse } from "../../../common/globals/common.model";
import {
  CreateShortLinkResponse,
  ReadShortLinkResponse,
} from "../models/short_link.model";

class ShortLinkService {
  private static baseUrl = `/${GENIE_MARKETING_API_VERSION}/ng`;

  static async createShortLink(
    original_url: string
  ): Promise<CreateShortLinkResponse | ErrorResponse> {
    try {
      const request = await httpClient.post(`${this.baseUrl}/createLink`, {
        original_url,
      });
      const response: CreateShortLinkResponse = request.data;
      return response;
    } catch (error: any) {
      return error?.response;
    }
  }

  static async readShortLink(
    url_id: string
  ): Promise<ReadShortLinkResponse | ErrorResponse> {
    try {
      const request = await httpClient.get(`${this.baseUrl}/${url_id}`);
      const response: ReadShortLinkResponse = request.data;
      return response;
    } catch (error: any) {
      return error?.response;
    }
  }
}

export { ShortLinkService };
