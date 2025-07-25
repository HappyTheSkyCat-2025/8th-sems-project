import axiosInstance from "../../utils/axiosInstance";

const BASE_URL = "admin-dashboard/bookings/";

export const getBookings = (url = BASE_URL) => axiosInstance.get(url);
export const getBooking = (id) => axiosInstance.get(`${BASE_URL}${id}/`);
export const createBooking = (data) => axiosInstance.post(BASE_URL, data);
export const updateBooking = (id, data) => axiosInstance.put(`${BASE_URL}${id}/`, data);
export const deleteBooking = (id) => axiosInstance.delete(`${BASE_URL}${id}/`);
