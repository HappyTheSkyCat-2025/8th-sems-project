import axiosInstance from "../../utils/axiosInstance";

const BASE_URL = "admin-dashboard/countries/";

export const getCountries = (url = BASE_URL) => axiosInstance.get(url);
export const getCountry = (id) => axiosInstance.get(`${BASE_URL}${id}/`);
export const createCountry = (data) => axiosInstance.post(BASE_URL, data);
export const updateCountry = (id, data) => axiosInstance.put(`${BASE_URL}${id}/`, data);
export const deleteCountry = (id) => axiosInstance.delete(`${BASE_URL}${id}/`);
