import axiosInstance from "../../utils/axiosInstance";

const BASE_URL = "admin-dashboard/deal-categories/";

export const getDealCategories = (url = BASE_URL) => {
  return axiosInstance.get(url);
};

export const getDealCategory = (id) => {
  return axiosInstance.get(`${BASE_URL}${id}/`);
};

export const createDealCategory = (data) => {
  return axiosInstance.post(BASE_URL, data);
};

export const updateDealCategory = (id, data) => {
  return axiosInstance.put(`${BASE_URL}${id}/`, data);
};

export const deleteDealCategory = (id) => {
  return axiosInstance.delete(`${BASE_URL}${id}/`);
};
