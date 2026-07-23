import mongoose, { Types } from "mongoose";

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
    joiningCredentials: {
      id: {
        type: String,
        required: true,
        trim: true,
      },
      password: {
        type: String,
        required: true,
        trim: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

const QuizModel = mongoose.model("Quiz", quizSchema);

export default QuizModel;
