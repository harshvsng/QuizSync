import { ILoginPayload, ISignupPayload } from "@/types/auth";
import { API, handleError } from ".";
import { IAPIResponse } from "@/types/common";

export const signupAPI = async (
  payload: ISignupPayload
): Promise<IAPIResponse> => {
  try {
    const { data } = await API.post("/auth/signup", payload);
    return { success: true, data };
  } catch (error) {
    return handleError(error);
  }
};

export const loginAPI = async (
  payload: ILoginPayload
): Promise<IAPIResponse> => {
  try {
    const { data } = await API.post("/auth/login", payload);
    return { success: true, data };
  } catch (error) {
    return handleError(error);
  }
};

export const sessionAPI = async (): Promise<IAPIResponse> => {
  try {
    const { data } = await API.get("/auth/session", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    return { success: true, data };
  } catch (error) {
    return handleError(error);
  }
};
