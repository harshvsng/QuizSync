import { API, handleError } from ".";
import { IAPIResponse } from "@/types/common";
import { IGetSpecificQuizPayload, IOrganiseQuizPayload } from "@/types/quiz";

export const organiseQuiz = async (
  payload: IOrganiseQuizPayload
): Promise<IAPIResponse> => {
  try {
    const { data } = await API.post("/quiz/create", payload, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    return { success: true, data };
  } catch (error) {
    return handleError(error);
  }
};
export const getSpecificQuiz = async (
  payload: IGetSpecificQuizPayload
): Promise<IAPIResponse> => {
  try {
    const { data } = await API.get(`/quiz/${payload.id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    return { success: true, data };
  } catch (error) {
    return handleError(error);
  }
};
