import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    topic: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    options: {
      type: [String],
      required: true,
    },
    answer: {
      type: Number,
      required: true,
      min: 0,
      max: 3,
    },
  },
  {
    timestamps: true,
  }
);

const QuestionModel = mongoose.model("Question", questionSchema);

export default QuestionModel;
