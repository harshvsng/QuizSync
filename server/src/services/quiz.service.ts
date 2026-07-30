import AppError from "../errors/app-error";
import { StatusCodes } from "http-status-codes";
import QuizModel from "../models/quiz.model";
import { IGetSpecificQuizPayload, IQuizPayload } from "../types/quiz";
import QuestionModel from "../models/question.model";

export default class QuizService {
  private static instance: QuizService | null = null;

  public static getInstance(): QuizService {
    if (!QuizService.instance) {
      QuizService.instance = new QuizService();
    }
    return QuizService.instance;
  }

  public async create(payload: IQuizPayload) {
    const questionSet = await QuestionModel.aggregate([
      { $match: { topic: payload.topic } },
      { $sample: { size: 10 } },
    ]);

    if (questionSet.length < 10) {
      throw new AppError(
        "Failed to prepare the question set",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }

    const { _id } = await QuizModel.create({
      title: payload.title,
      host: payload.userId,
      questionSet: questionSet,
    });

    const joiningLink = `${process.env[`APP_URL`]}/quiz/${_id}`;

    return joiningLink;
  }
  public async getSpecific(payload: IGetSpecificQuizPayload) {
    const quiz = await QuizModel.findOne({
      _id: payload.id,
    })
      .populate("host", "name")
      .select("title host status");

    if (!quiz) {
      throw new AppError("No matching quiz found", StatusCodes.CONFLICT);
    }

    return quiz;
  }
}
