import axios, { isAxiosError } from "axios";
export const API = axios.create({
  baseURL: process.env["NEXT_PUBLIC_SERVER_URL"],
});

export default API;

export const handleError = (error: unknown) => {
  if (isAxiosError(error)) {
    return { success: false, error: error.response?.data.error };
  }

  return {
    success: false,
    error,
  };
};
