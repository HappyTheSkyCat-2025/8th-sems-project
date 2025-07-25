import axiosInstance from "../../utils/axiosInstance";

const BASE_URL = "admin-dashboard/itinerary-days/";

export const getItineraryDays = (url = BASE_URL) => axiosInstance.get(url);
export const getItineraryDay = (id) => axiosInstance.get(`${BASE_URL}${id}/`);
export const createItineraryDay = (data) => axiosInstance.post(BASE_URL, data);
export const updateItineraryDay = (id, data) => axiosInstance.put(`${BASE_URL}${id}/`, data);
export const deleteItineraryDay = (id) => axiosInstance.delete(`${BASE_URL}${id}/`);
