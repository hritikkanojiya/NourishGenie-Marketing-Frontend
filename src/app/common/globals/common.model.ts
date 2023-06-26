export interface ErrorResponse {
  error: {
    status: number;
    message: string;
  };
}

export interface MetaData {
  sortBy?: string | null;
  sortOn?: string | null;
  limit?: number;
  offset?: number;
  fields?: string[];
  total_records?: number;
}

export interface SuccessResponse {
  error: boolean;
  data: {
    message: string;
  };
}

export interface GetResponseOptions {}

export type Option = {
  value: any;
  label: string;
};
