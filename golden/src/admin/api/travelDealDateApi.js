import axiosInstance from "../../utils/axiosInstance";

const BASE_URL = "admin-dashboard/travel-deal-dates/";

export const getTravelDealDates = (url = BASE_URL) => axiosInstance.get(url);
export const getTravelDealDate = (id) => axiosInstance.get(`${BASE_URL}${id}/`);
export const createTravelDealDate = (data) => axiosInstance.post(BASE_URL, data);
export const updateTravelDealDate = (id, data) => axiosInstance.put(`${BASE_URL}${id}/`, data);
export const deleteTravelDealDate = (id) => axiosInstance.delete(`${BASE_URL}${id}/`);
