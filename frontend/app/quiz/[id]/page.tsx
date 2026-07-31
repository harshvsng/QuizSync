
"use client";
import { getSpecificQuiz } from "@/api/quiz";
import { SocketService } from "@/lib/socket";
import { useStore } from "@/store/useStore";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { toast } from "react-toastify";

const defaultQuizValues = {
  _id: "",
  title: "",
  host: { _id: "", name: "" },
  status: "waiting", // waiting | in_progress | ended
};

export default function PreviewQuiz({ params }: { params: Promise<{ id: string }> }) {
  const { id: quizId } = use(params);
  const [quiz, setQuiz] = useState(defaultQuizValues);
  const [currentQuestion, setCurrentQuestion] = useState<{ text: string; options: string[] } | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);

  const { user } = useStore();
  const router = useRouter();

  // 1. Load Initial Quiz Details
  useEffect(() => {
    if (user === null) {
      router.push(`/login`);
    } else if (user !== undefined) {
      getSpecificQuiz({ id: quizId }).then((response) => {
        if (!response.success) {
          toast.error(response.error);
          router.push(`/`);
          return;
        }
        setQuiz((response.data as { quiz: typeof defaultQuizValues }).quiz);
      });
    }
  }, [router, user, quizId]);

  // 2. 10-Second Countdown Timer UI Logic
  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  // 3. Socket Game Loop Routing
  useEffect(() => {
    const socket = SocketService.getSocket();

    const onConnect = () => {
      // Automatically tell the server we are entering this specific lobby
      socket.emit("quiz:join-lobby", { quizId });
    };

    const onQuizStarted = () => {
      setQuiz((prev) => ({ ...prev, status: "in_progress" }));
      toast.info("The host has started the quiz!");
    };

    const onNewQuestion = (data: { question: { text: string; options: string[] }; duration: number }) => {
      setCurrentQuestion(data.question);
      setTimeLeft(data.duration); // Reset down-counter to 10 seconds
    };

    const onQuizEnded = () => {
      setQuiz((prev) => ({ ...prev, status: "ended" }));
      setCurrentQuestion(null);
      toast.success("Quiz finished!");
    };

    socket.on("connect", onConnect);
    socket.on("quiz:started", onQuizStarted);
    socket.on("quiz:question", onNewQuestion);
    socket.on("quiz:ended", onQuizEnded);

    if (socket.connected) onConnect();

    return () => {
      socket.off("connect", onConnect);
      socket.off("quiz:started", onQuizStarted);
      socket.off("quiz:question", onNewQuestion);
      socket.off("quiz:ended", onQuizEnded);
    };
  }, [quizId]);

  // Submit Answer Action
  const handleSelectAnswer = (optionIndex: number) => {
    if (timeLeft <= 0) return;
    SocketService.getSocket().emit("quiz:submit-answer", { quizId, optionIndex });
    toast.success("Answer recorded!");
  };

  return (
    <main className="max-w-xl mx-auto p-4 text-center">
      <h1 className="text-3xl font-bold my-4">{quiz.title}</h1>

      {/* PHASE 1: WAITING ROOM */}
      {quiz.status === "waiting" && (
        <section className="my-12 py-10 bg-gray-100 rounded-lg animate-pulse">
          <p className="text-2xl font-semibold italic text-gray-600">Waiting for host to start...</p>
        </section>
      )}

      {/* PHASE 2: IN PROGRESS (GAME LOOP RUNNING) */}
      {quiz.status === "in_progress" && currentQuestion && (
        <section className="my-6 bg-white shadow-lg p-6 rounded-xl border">
          <div className="flex justify-between items-center mb-6">
            <span className="px-3 py-1 bg-red-100 text-red-700 font-bold rounded-full">
              Time Left: {timeLeft}s
            </span>
          </div>

          <h2 className="text-xl font-medium mb-6">{currentQuestion.text}</h2>

          <div className="grid gap-3">
            {currentQuestion.options.map((option, idx) => (
              <button
                key={idx}
                disabled={timeLeft === 0}
                onClick={() => handleSelectAnswer(idx)}
                className="w-full py-3 px-4 bg-blue-50 text-blue-800 rounded-lg hover:bg-blue-100 transition disabled:opacity-50 text-left border border-blue-200"
              >
                {option}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* PHASE 3: ENDED */}
      {quiz.status === "ended" && (
        <section className="my-12 py-10 bg-green-50 rounded-lg border border-green-200">
          <p className="text-2xl font-bold text-green-700">Quiz Completed!</p>
        </section>
      )}
    </main>
  );
}
