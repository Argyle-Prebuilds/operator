import axios from "axios";
import config from "../config";

export const API_URL = config.API_URL;

export const authAPI = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-type": "application/json"
  }
});

authAPI.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return Promise.resolve(config);
  }
);

authAPI.interceptors.response.use((response) => {
  return response;
}, (error) => {
  if (401 === error.response.status) {
    window.location = '/admin/login';
  } else {
    return Promise.reject(error);
  }
});
