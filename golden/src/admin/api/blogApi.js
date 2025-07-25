import axiosInstance from "../../utils/axiosInstance";

const BASE_URL = "admin-dashboard/blogs/";

export const getBlogs = () => axiosInstance.get(BASE_URL);
export const getBlog = (id) => axiosInstance.get(`${BASE_URL}${id}/`);
export const createBlog = (data) => axiosInstance.post(BASE_URL, data);
export const updateBlog = (id, data) => axiosInstance.put(`${BASE_URL}${id}/`, data);
export const deleteBlog = (id) => axiosInstance.delete(`${BASE_URL}${id}/`);
