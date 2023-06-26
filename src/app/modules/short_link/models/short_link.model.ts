import { SuccessResponse } from "../../../common/globals/common.model";

export interface ShortLink {
  url_id: string;
  original_url: string;
  clicks: number;
  _id: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateShortLinkResponse extends SuccessResponse {
  data: {
    shortLinkDetails: ShortLink;
    shortLink: string;
    message: string;
  };
}

export interface ReadShortLinkResponse extends SuccessResponse {
  data: {
    redirectTo: string;
    message: string;
  };
}
