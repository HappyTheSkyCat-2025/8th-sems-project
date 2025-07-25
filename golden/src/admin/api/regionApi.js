import axiosInstance from "../../utils/axiosInstance";

const BASE_URL = "admin-dashboard/regions/";

export const getRegions = (url = BASE_URL) => axiosInstance.get(url);
export const getRegion = (id) => axiosInstance.get(`${BASE_URL}${id}/`);
export const createRegion = (data) => axiosInstance.post(BASE_URL, data);
export const updateRegion = (id, data) => axiosInstance.put(`${BASE_URL}${id}/`, data);
export const deleteRegion = (id) => axiosInstance.delete(`${BASE_URL}${id}/`);
