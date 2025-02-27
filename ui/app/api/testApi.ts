import axios from "axios";

const url = `https://dummyjson.com/users`;

export const getTestUsers = async () => {
  return axios.get(url);
};
