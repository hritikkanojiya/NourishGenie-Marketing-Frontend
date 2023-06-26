import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { AuthTokenService } from "../../modules/auth/services/authToken.service";
import {
  ACCESS_TOKEN_HEADER,
  GENIE_MARKETING_API_VERSION,
  GENIE_MARKETING_API,
} from "../globals/common.constants";
import { showToast } from "../toastify/toastify.config";
import { SocketService } from "../services/socket.service";

const httpClient = axios.create({
  baseURL: GENIE_MARKETING_API,
  withCredentials: true,
});

httpClient.interceptors.request.use((request: AxiosRequestConfig) => {
  const token = AuthTokenService.getTokenFromLocalStorage();
  if (token && request.headers) {
    request.headers[ACCESS_TOKEN_HEADER] = `Bearer ${token}`;
  }
  return request;
});

httpClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest: any = error.config;
    if (error.response?.status === 401) {
      try {
        const response = await axios.post(
          `${GENIE_MARKETING_API}/${GENIE_MARKETING_API_VERSION}/agent/auth/refresh`,
          {},
          { withCredentials: true }
        );
        AuthTokenService.setTokenInLocalStorage(response.data);
        httpClient.defaults.headers.common[
          ACCESS_TOKEN_HEADER
        ] = `Bearer ${response.data.data.jwt_token}`;
        SocketService.reSetupSocketConnection();
        return httpClient(originalRequest);
      } catch (error) {
        AuthTokenService.clearTokenFromLocalStorage();
        window.location.replace(`/agent/auth/login?next=${window.location.href}`);
      }
    }
    if (error.response) {
      const message = error.response.data.error.message;
      showToast(message || "Unable to process the request", "error");
    }
    return Promise.reject(error);
  }
);

export { httpClient };
