import {baseAPI} from "./baseAPI";
import config from "../config";

export const API_URL = config.API_URL;


export const activateAccountService = (data = {}) => {
  return baseAPI.put(`${API_URL}/users/activate/`, data);
};
export const loginService = (data) => {
  return baseAPI.post(`${API_URL}/auth/login/`, data)
}

export const passwordResetService = (data) => {
  return baseAPI.put(`${API_URL}/auth/password-reset`, data)
}

export const passwordUpdateService = (user_id, data) => {
  return baseAPI.put(`${API_URL}/auth/password-update/${user_id}`, data)
}

export const validateTokenService = (data) => {
  return baseAPI.post(`${API_URL}/auth/validate-token/`, data)
}
