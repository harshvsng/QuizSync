import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import { IExtendedRequest } from "../types/common";
import QuizService from "../services/quiz.service";

const quizService = QuizService.getInstance();

export default class QuizController {
  private static instance: QuizController | null = null;

  public static getInstance(): QuizController {
    if (!QuizController.instance) {
      QuizController.instance = new QuizController();
    }
    return QuizController.instance;
  }

  public async create(req: IExtendedRequest, res: Response) {
    const joiningLink = await quizService.create({
      title: req.body.title,
      userId: req.user!._id,
      topic: req.body.topic,
    });

    res.status(StatusCodes.OK).json({ joiningLink });
  }
  public async getSpecific(req: IExtendedRequest, res: Response) {
    const quiz = await quizService.getSpecific({
      id: req.params.id.toString(),
    });

    res.status(StatusCodes.OK).json({ quiz });
  }
}
