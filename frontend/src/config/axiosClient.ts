import axios, { AxiosError, type AxiosResponse } from "axios";
import queryClient from "./queryClient";
import { navigate } from "@/lib/navigate";

const configOptions = {
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true
};

const api = axios.create(configOptions);

const refreshTokenClient = axios.create(configOptions);

refreshTokenClient.interceptors.response.use(function (response: AxiosResponse) {
    return response.data;
});

api.interceptors.response.use(function (response: AxiosResponse) {
    return response.data;
  }, async function (error: AxiosError) {
    if (error.response) {
      const {config, response} = error;
      const { data, status } = response;

      if (
        status === 401 &&
        typeof data === "object" &&
        data !== null &&
        "errorCode" in data &&
        (data as { errorCode?: string }).errorCode === "Invalid_Access_Token"
      ){
        try {
          await refreshTokenClient.get("/auth/refresh");

          if (config) {
            return api(config); 
          }
          return;
        } catch (error) {
          console.log('error caught!!!')
            queryClient.clear();
            navigate("/login", {
              state: {
                redirectUrl: window.location.pathname
              }
            });
        }
      }
        return Promise.reject({ status, ...(data as object) });
    }

    return Promise.reject({
      status: 0,
      message: "Network error or no response from server",
    });
  });

export default api;

