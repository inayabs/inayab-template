import axiosInstance from "@/lib/axiosInstance";

const url = process.env.NEXT_PUBLIC_API_URL + "/auth";

export const login = (credentials: any) => {
  return axiosInstance.post(url + "/login", credentials);
};

export const resetRequest = async (data: any) => {
  return axiosInstance.post(`${url}/reset-request`, data);
};

export const changePassword = async (data: any) => {
  return axiosInstance.post(`${url}/change-password`, data);
};

export const updateTwoFactor = async (data: any) => {
  return axiosInstance.post(`${url}/update-2fa`, data);
};

export const verifyCode = async (data: any) => {
  return axiosInstance.post(`${url}/verify-code`, data);
};
// export const register = async (data: RegisterData) => {
//   return axiosInstance.post(url + '/register', data);
// };

// export const getUser = async () => {
//   return axiosInstance.get(url + "/user");
// };

// export const getSingleUser = async (id: string) => {
//   return axiosInstance.get(url + "/user/" + id);
// };
