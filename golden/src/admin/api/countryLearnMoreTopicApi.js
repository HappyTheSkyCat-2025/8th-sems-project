import axiosInstance from "../../utils/axiosInstance";

const BASE_URL = "admin-dashboard/country-learn-more-topics/";

export const getTopics = (url = BASE_URL) => axiosInstance.get(url);
export const getTopic = (id) => axiosInstance.get(`${BASE_URL}${id}/`);
export const createTopic = (data) => axiosInstance.post(BASE_URL, data);
export const updateTopic = (id, data) => axiosInstance.put(`${BASE_URL}${id}/`, data);
export const deleteTopic = (id) => axiosInstance.delete(`${BASE_URL}${id}/`);
