import {authAPI} from "./authAPI";
import config from "../config";

export const API_URL = config.API_URL;


export const fetchAdminUsersService = () => {
  return authAPI.get(`${API_URL}/users/list/`);
};

export const removeAdminUserService = (id) => {
  return authAPI.delete(`${API_URL}/users/delete/${id}/`);
};

export const addAdminUserService = (data) => {
  return authAPI.post(`${API_URL}/users/create/`, data);
};
