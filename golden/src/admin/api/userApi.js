// src/admin/api/userApi.js
import axiosInstance from "../../utils/axiosInstance";

const BASE_URL = "admin-dashboard/users/";

export const getUsers = () => axiosInstance.get(BASE_URL);
export const getUser = (id) => axiosInstance.get(`${BASE_URL}${id}/`);
export const createUser = (data) => axiosInstance.post(BASE_URL, data);
export const updateUser = (id, data) => axiosInstance.put(`${BASE_URL}${id}/`, data);
export const deleteUser = (id) => axiosInstance.delete(`${BASE_URL}${id}/`);
