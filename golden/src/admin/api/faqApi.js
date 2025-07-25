import axiosInstance from "../../utils/axiosInstance";

const BASE_URL = "admin-dashboard/faqs/";

export const getFaqs = (url = BASE_URL) => axiosInstance.get(url);
export const getFaq = (id) => axiosInstance.get(`${BASE_URL}${id}/`);
export const createFaq = (data) => axiosInstance.post(BASE_URL, data);
export const updateFaq = (id, data) => axiosInstance.put(`${BASE_URL}${id}/`, data);
export const deleteFaq = (id) => axiosInstance.delete(`${BASE_URL}${id}/`);
