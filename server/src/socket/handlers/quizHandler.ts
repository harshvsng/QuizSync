import { Server, Socket } from "socket.io";
import logger from "../../infra/logger/logger";
import QuizModel from "../../models/quiz.model";
import QuestionModel from "../../models/question.model";

// Simple map to track active game intervals running on this node instanced server
const activeTimers: Record<string, NodeJS.Timeout> = {};

export const registerQuizHandlers = (io: Server, socket: Socket) => {
  const userId = socket.userId!;

  // 1. Join Quiz Room Layout
  socket.on("quiz:join-lobby", ({ quizId }: { quizId: string }) => {
    if (!quizId) return;

    // Group this user into a room explicitly for this quiz ID instance
    socket.join(`quiz:${quizId}`);
    logger.info(`User ${userId} joined room channel: quiz:${quizId}`);
  });

  // 2. Start Quiz Loop (Can be triggered via socket or call this from an HTTP controller)
  socket.on("quiz:start", async ({ quizId }: { quizId: string }) => {
    try {
      // Find the quiz structure and load attached questions from MongoDB
      const quiz = await QuizModel.findById(quizId);
      if (!quiz || quiz.host.toString() !== userId) return;

      const questions = await QuestionModel.find({
        _id: { $in: quiz.questionSet },
      }).select("title options answer");

      // Update quiz state in MongoDB here...
      quiz.status = "In Progress";
      await quiz.save();

      // Alert all room listeners to clear out waiting screens
      io.to(`quiz:${quizId}`).emit("quiz:started");

      let currentQuestionIndex = 0;
      const questionDuration = 10; // 10 seconds

      function sendNextQuestion() {
        if (currentQuestionIndex >= questions.length) {
          // Clear active clocks and finalize session pipeline
          clearInterval(activeTimers[quizId]);
          delete activeTimers[quizId];

          io.to(`quiz:${quizId}`).emit("quiz:ended");
          QuizModel.findByIdAndUpdate({ _id: quizId }, { status: "Ended" })
            .then(undefined)
            .catch(undefined);
          logger.info(`Quiz ${quizId} has naturalized and finished.`);
          return;
        }

        const rawQuestion = questions[currentQuestionIndex];
        // Strip the correctIndex out so players cannot cheat using devTools network inspections
        const cleanQuestion = {
          title: rawQuestion.title,
          options: rawQuestion.options,
        };

        io.to(`quiz:${quizId}`).emit("quiz:question", {
          question: cleanQuestion,
          duration: questionDuration,
        });

        currentQuestionIndex++;
      }

      // Fire off first question immediately
      sendNextQuestion();

      // Configure server ticks to broadcast consecutive questions exactly every 10 seconds
      activeTimers[quizId] = setInterval(() => {
        sendNextQuestion();
      }, questionDuration * 1000);
    } catch (error) {
      logger.error(error, "Failed starting quiz loops");
    }
  });

  // 3. Receive player submission
  socket.on(
    "quiz:submit-answer",
    ({ quizId, optionIndex }: { quizId: string; optionIndex: number }) => {
      // Process answer records instantly using your Redis client here!
      // Example: await redisClient.hSet(`quiz:${quizId}:answers`, userId, optionIndex);
      logger.info(
        `User ${userId} chose option index [${optionIndex}] inside quiz: ${quizId}`
      );
    }
  );
};
