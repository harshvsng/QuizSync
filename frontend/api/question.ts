import { IAPIResponse } from "@/types/common";
import { API, handleError } from ".";

export const getTopics = async (): Promise<IAPIResponse> => {
  try {
    const { data } = await API.get("/question/topics", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    return { success: true, data };
  } catch (error) {
    return handleError(error);
  }
};
