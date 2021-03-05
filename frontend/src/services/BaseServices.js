import {baseAPI} from "./baseAPI";
import config from "../config";

export const API_URL = config.API_URL;


export const activateAccountService = (user_id, data ) => {
  return baseAPI.put(`${API_URL}/users/activate/${user_id}/`, data);
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

export const getHomepageSettings = () => {
  return baseAPI.get(`${API_URL}/homepage/homepage-settings/`);
};

export const getArgylePluginKey = () => {
  return baseAPI.get(`${API_URL}/integrations/argyle-plugin/`);
};

export const getUserLinkData = (userUUID) => {
  return baseAPI.get(`${API_URL}/generator/user-link-data/${userUUID}`);
};

export const updateUserLinkData = (userUUID, data) => {
  return baseAPI.put(`${API_URL}/generator/user-link-data/${userUUID}/`, data);
};

export const generateNewUserToken = (userUUID) => {
  return baseAPI.post(`${API_URL}/generator/argyle-token/${userUUID}/`);
};
