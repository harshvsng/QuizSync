import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import QuestionService from "../services/question.service";

const questionService = QuestionService.getInstance();

export default class QuestionController {
  private static instance: QuestionController | null = null;

  public static getInstance(): QuestionController {
    if (!QuestionController.instance) {
      QuestionController.instance = new QuestionController();
    }
    return QuestionController.instance;
  }

  public async getTopics(req: Request, res: Response) {
    const topics = await questionService.getTopics();

    res.status(StatusCodes.OK).json({ topics });
  }
}
