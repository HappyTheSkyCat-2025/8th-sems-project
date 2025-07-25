// src/admin/api/contactApi.js
import axiosInstance from "../../utils/axiosInstance";

const BASE_URL = "admin-dashboard/contact-messages/";

export const getMessages = () => axiosInstance.get(BASE_URL);
export const getMessage = (id) => axiosInstance.get(`${BASE_URL}${id}/`);
export const deleteMessage = (id) => axiosInstance.delete(`${BASE_URL}${id}/`);
