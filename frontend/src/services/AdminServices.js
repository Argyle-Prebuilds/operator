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

export const getAPIKeys = () => {
    return authAPI.get(`${API_URL}/integrations/api-keys/`);
};

export const updateAPIKey = (id, data = {}) => {
    return authAPI.put(`${API_URL}/integrations/api-keys/${id}/`, data);
};

export const addAPIKey = (data = {}) => {
    return authAPI.post(`${API_URL}/integrations/api-keys/`, data);
};

export const setHomepageSettings = (data = {}) => {
    return authAPI.post(`${API_URL}/homepage/homepage-settings/`, data);
};

export const getUserEditsSettings = () => {
    return authAPI.get(`${API_URL}/templates/activation-user-template/`);
};

export const setUserEditsSettings = (data = {}) => {
    return authAPI.post(`${API_URL}/templates/activation-user-template/`, data);
};

export const generateUserLink = (data) => {
    return authAPI.post(`${API_URL}/generator/user-link/`, data)
}

export const getDataPartners = (params) => {
    return authAPI.get(`${API_URL}/generator/data-partners/`, {params})
}
export const getUserLinks = () => {
    return authAPI.get(`${API_URL}/generator/user-link`)
}

export const resendUserLinkEmail = (userUUID) => {
    return authAPI.post(`${API_URL}/generator/user-link/resend-email/${userUUID}/`)
}

export const resendUserLinkSMS = (userUUID) => {
    return authAPI.post(`${API_URL}/generator/user-link/resend-sms/${userUUID}/`)
}

export const deleteUserLinkService = (userUUID) => {
    return authAPI.delete(`${API_URL}/generator/user-link/delete/${userUUID}/`)
}
