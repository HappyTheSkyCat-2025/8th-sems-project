import axiosInstance from "../../utils/axiosInstance";

const BASE_URL = "admin-dashboard/country-overviews/";

export const getCountryOverviews = (url = BASE_URL) => axiosInstance.get(url);
export const getCountryOverview = (id) => axiosInstance.get(`${BASE_URL}${id}/`);
export const createCountryOverview = (data) => axiosInstance.post(BASE_URL, data);
export const updateCountryOverview = (id, data) => axiosInstance.put(`${BASE_URL}${id}/`, data);
export const deleteCountryOverview = (id) => axiosInstance.delete(`${BASE_URL}${id}/`);
