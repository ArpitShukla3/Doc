import useSocketStore from "@stores/socketStore";
import axios from "axios";
import { refreshToken } from "./apis";

export const api = axios.create({
  baseURL: "http://localhost:3000",
});
export const webSocketApi = "ws://[IP_ADDRESS]";
api.interceptors.request.use((config) => {
  const socketId = (useSocketStore.getState() as { socketId: string }).socketId;
  if (socketId) {
    config.headers["socket-id"] = socketId;
  }
  // Attach auth token if available
  const accessToken = localStorage.getItem("accessToken");
  if (accessToken) {
    config.headers["Authorization"] = `Bearer ${accessToken}`;
  }
  return config;
});
let isRefreshing = false
let refreshPromise: any = null
api.interceptors.response.use(
  response => response,
  async error => {
    console.log("Response error:", error.response);
    if (error.response.status == 401) {

      if (!isRefreshing) {
        isRefreshing = true
        refreshPromise = refreshToken()
      }

      await refreshPromise
      isRefreshing = false
      return axios(error.config)
    }

    return Promise.reject(error)
  }
)