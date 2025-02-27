import axiosInstance from "@/lib/axiosInstance";
import { fetchClient } from "@/lib/fetch-client";

const url = process.env.NEXT_PUBLIC_API_URL + "/user";

export const getUser = async () => {
  return axiosInstance.get(url);
};

export const getUsers = async (queryParams: Record<string, any>) => {
  const params = new URLSearchParams(queryParams).toString(); // Convert to query string

  return axiosInstance.get(`${url}s?${params}`);
  // return fetchClient(`${url}s${params}`, {
  //   headers: { "Content-Type": "application/json" },
  // });
};

export const updateUser = async (data: any) => {
  return axiosInstance.put(url + "/profile/update-info", data);
};

export const updateUserPass = async (data: any) => {
  return axiosInstance.put(url + "/profile/update-pass", data);
};

export const createUser = async (data: any) => {
  return axiosInstance.post(url, data);
};

export const getSingleUser = async (id: any) => {
  return axiosInstance.get(`${url}/${id}`);
};

export const updateSingleUser = async (id: any, data: any) => {
  return axiosInstance.put(`${url}/${id}`, data);
};
