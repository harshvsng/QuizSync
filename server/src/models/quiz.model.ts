import mongoose, { Types } from "mongoose";
import { QUIZ_STATUS } from "../enums/quiz.enum";

const quizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    host: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    questionSet: {
      type: [Types.ObjectId],
      required: true,
    },
    status: {
      type: String,
      enum: QUIZ_STATUS,
      default: QUIZ_STATUS.WAITING,
    },
  },
  {
    timestamps: true,
  }
);

const QuizModel = mongoose.model("Quiz", quizSchema);

export default QuizModel;
