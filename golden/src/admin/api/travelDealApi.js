import axiosInstance from "../../utils/axiosInstance";

const BASE_URL = "admin-dashboard/travel-deals/";

export const getTravelDeals = (url = BASE_URL) => axiosInstance.get(url);
export const getTravelDeal = (id) => axiosInstance.get(`${BASE_URL}${id}/`);
export const createTravelDeal = (data) => axiosInstance.post(BASE_URL, data);
export const updateTravelDeal = (id, data) => axiosInstance.put(`${BASE_URL}${id}/`, data);
export const deleteTravelDeal = (id) => axiosInstance.delete(`${BASE_URL}${id}/`);
