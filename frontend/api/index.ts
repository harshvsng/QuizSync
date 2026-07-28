import axios, { isAxiosError } from "axios";
import { toast } from "react-toastify";

export const API = axios.create({
  baseURL: process.env["NEXT_PUBLIC_SERVER_URL"],
});

API.interceptors.response.use(
  // Pass through successful responses
  (response) => response,
  // Handle errors
  (error) => {
    if (error.response && error.response.status === 401) {
      toast.error("Session expired, Please login again");
      setTimeout(() => {
        window.location.reload();
      }, 1500);
      return;
    }

    // Reject the promise so the calling function can still handle the error
    return Promise.reject(error);
  }
);

export const handleError = (error: unknown) => {
  if (isAxiosError(error)) {
    return { success: false, error: error.response?.data.error };
  }

  return {
    success: false,
    error,
  };
};
