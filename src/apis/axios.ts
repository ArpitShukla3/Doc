import useSocketStore from "@stores/socketStore";
import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3000",
});

api.interceptors.request.use((config) => {
  const socketId = (useSocketStore.getState() as { socketId: string }).socketId;
  if (socketId) {
    config.headers["socket-id"] = socketId;
  }
  return config;
});
