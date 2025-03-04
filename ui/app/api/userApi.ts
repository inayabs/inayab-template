import axiosInstance from "@/lib/axiosInstance";

const url = process.env.NEXT_PUBLIC_API_URL + "/user";

export const getUser = async () => {
  return axiosInstance.get(url);
};

export const getUsers = async (
  queryParams: Record<string, string | number | boolean>
) => {
  const params = new URLSearchParams(
    Object.entries(queryParams).reduce((acc, [key, value]) => {
      acc[key] = String(value); // ✅ Ensure all values are converted to strings
      return acc;
    }, {} as Record<string, string>)
  ).toString(); // Convert to query string

  return axiosInstance.get(`${url}s?${params}`);
};

export const updateUser = async (data: UserInfo) => {
  return axiosInstance.put(url + "/profile/update-info", data);
};

export const updateUserPass = async (data: UserPass) => {
  return axiosInstance.put(url + "/profile/update-pass", data);
};

export const createUser = async (data: UserGeneral) => {
  return axiosInstance.post(url, data);
};

export const getSingleUser = async (id: number) => {
  return axiosInstance.get(`${url}/${id}`);
};

export const updateSingleUser = async (id: number, data: UserGeneral) => {
  return axiosInstance.put(`${url}/${id}`, data);
};
