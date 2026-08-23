import axios, { type AxiosRequestConfig } from "axios";
import qs from "qs";
import { isSuccess } from "./util";

export const STORAGE_SID = "STORAGE_SID";

// Admin token storage key - implement your own auth store
const ADMIN_TOKEN_KEY = "ADMIN_TOKEN";

interface AxiosRequestConfigCustom extends AxiosRequestConfig {
  hideHttpError?: boolean;
  ignoreSID?: boolean;
}

const baseURL = import.meta.env.DEV ? "/" : import.meta.env.VITE_BASE_API_URL;

axios.defaults.timeout = 30 * 1000;

axios.interceptors.request.use((config) => {
  const token = sessionStorage.getItem(ADMIN_TOKEN_KEY);
  if (token && config.url?.startsWith("/api/admin-auth")) {
    config.headers!["Authorization"] = `${token}`;
  }
  return config;
});

axios.interceptors.response.use(
  (response) => {
    if (response.data) {
      return response;
    }
    return Promise.reject(response);
  },
  (error) => {
    if (error.status == 401) {
      sessionStorage.removeItem(ADMIN_TOKEN_KEY);
    }
    return Promise.reject(error.response);
  },
);

export class Http {
  async request(configs: AxiosRequestConfigCustom) {
    const SID = localStorage.getItem(STORAGE_SID);

    try {
      const response = await axios({
        ...configs,
        headers: SID && !configs.ignoreSID ? { ...configs.headers, SID } : configs.headers,
      });
      return response.data;
    } catch (e: unknown) {
      return e;
    }
  }

  async get(url: string, params?: unknown, option: AxiosRequestConfigCustom = {}) {
    return this.request({
      method: "GET",
      url,
      baseURL,
      params,
      paramsSerializer: (params) => qs.stringify(params, { arrayFormat: "brackets" }),
      ...option,
    });
  }

  async getOther(otherBaseURL: string, url: string, params?: unknown, option: AxiosRequestConfigCustom = { ignoreSID: true }) {
    return this.request({ method: "GET", url, baseURL: otherBaseURL, params, ...option });
  }

  async post(url: string, data?: unknown, params?: unknown, option: AxiosRequestConfigCustom = {}) {
    return this.request({ method: "POST", url, data, params, baseURL, ...option });
  }

  async put(url: string, data?: unknown, params?: unknown, option: AxiosRequestConfigCustom = {}) {
    return this.request({ method: "PUT", url, data, params, baseURL, ...option });
  }

  async delete(url: string, data?: unknown, params?: unknown, option: AxiosRequestConfigCustom = {}) {
    return this.request({ method: "DELETE", url, data, params, baseURL, ...option });
  }

  async patch(url: string, data?: unknown, params?: unknown, option: AxiosRequestConfigCustom = {}) {
    return this.request({ method: "PATCH", url, data, params, baseURL, ...option });
  }

  async head(url: string, params?: unknown, option: AxiosRequestConfigCustom = {}) {
    return this.request({ method: "HEAD", url, params, baseURL, ...option });
  }

  async options(url: string, params?: unknown, option: AxiosRequestConfigCustom = {}) {
    return this.request({ method: "OPTIONS", url, params, baseURL, ...option });
  }

  static checkSuccess(res: Api.Error) {
    return isSuccess(res);
  }
}
