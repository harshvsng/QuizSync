import QuestionModel from "../models/question.model";

export default class QuestionService {
  private static instance: QuestionService | null = null;

  public static getInstance(): QuestionService {
    if (!QuestionService.instance) {
      QuestionService.instance = new QuestionService();
    }
    return QuestionService.instance;
  }

  public async getTopics() {
    const result = await QuestionModel.aggregate([
      {
        $group: {
          _id: null,
          topics: { $addToSet: "$topic" },
        },
      },
      {
        $project: {
          _id: 0,
          topics: 1,
        },
      },
    ]);

    return result.length > 0 ? result[0].topics : [];
  }
}
