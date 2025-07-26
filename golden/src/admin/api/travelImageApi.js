import axiosInstance from "../../utils/axiosInstance";

const BASE_URL = "admin-dashboard/travel-images/";

export const getTravelImages = (url = BASE_URL) => axiosInstance.get(url);
export const getTravelImage = (id) => axiosInstance.get(`${BASE_URL}${id}/`);
export const createTravelImage = (data) => axiosInstance.post(BASE_URL, data);
export const updateTravelImage = (id, data) => axiosInstance.put(`${BASE_URL}${id}/`, data);
export const deleteTravelImage = (id) => axiosInstance.delete(`${BASE_URL}${id}/`);
