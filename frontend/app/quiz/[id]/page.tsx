"use client";
import { getSpecificQuiz } from "@/api/quiz";
import { SocketService } from "@/lib/socket";
import { useStore } from "@/store/useStore";
import { Button } from "@mantine/core";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { toast } from "react-toastify";

interface IQuiz {
  _id: string;
  title: string;
  host: { _id: string; name: string };
  status: string;
}

export default function PreviewQuiz({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: quizId } = use(params);
  const [quiz, setQuiz] = useState<IQuiz | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<{
    title: string;
    options: string[];
  } | null>(null);
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
        setQuiz((response.data as { quiz: IQuiz }).quiz);
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

  const onQuizStarted = () => {
    setQuiz((prev) => ({ ...prev, status: "In Progress" }) as IQuiz);
    toast.info("The host has started the quiz!");
  };

  const onQuizEnded = () => {
    setQuiz((prev) => ({ ...prev, status: "Ended" }) as IQuiz);
    setCurrentQuestion(null);
    toast.success("Quiz finished!");
  };

  // 3. Socket Game Loop Routing
  useEffect(() => {
    const socket = SocketService.getSocket();

    const onConnect = () => {
      // Automatically tell the server we are entering this specific lobby
      socket.emit("quiz:join-lobby", { quizId });
    };

    const onNewQuestion = (data: {
      question: { title: string; options: string[] };
      duration: number;
    }) => {
      if (user?._id === quiz?.host._id) {
        return;
      }
      setCurrentQuestion(data.question);
      setTimeLeft(data.duration); // Reset down-counter to 10 seconds
    };

    socket.on("connect", onConnect);
    socket.on("quiz:started", onQuizStarted);
    socket.on("quiz:question", onNewQuestion);
    socket.on("quiz:ended", onQuizEnded);

    return () => {
      socket.off("connect", onConnect);
      socket.off("quiz:started", onQuizStarted);
      socket.off("quiz:question", onNewQuestion);
      socket.off("quiz:ended", onQuizEnded);
    };
  }, [quizId, user, quiz]);

  // Submit Answer Action
  const handleSelectAnswer = (optionIndex: number) => {
    if (timeLeft <= 0) return;
    SocketService.getSocket().emit("quiz:submit-answer", {
      quizId,
      optionIndex,
    });
    toast.success("Answer recorded!");
  };
  const handleStartQuiz = () => {
    SocketService.getSocket().emit("quiz:start", { quizId });
  };

  return (
    <main className="max-w-xl mx-auto p-4 text-center">
      <h1 className="text-3xl font-bold my-4">{quiz?.title}</h1>
      <p className="text-lg">By - {quiz?.host.name}</p>

      {/* PHASE 1: WAITING ROOM */}
      {quiz?.status === "Waiting" && (
        <>
          <section className="my-12 py-10 bg-gray-100 rounded-lg animate-pulse">
            <p className="text-2xl font-semibold italic text-gray-600">
              Waiting for host to start...
            </p>
          </section>
          <section>
            {quiz.host._id === user?._id && (
              <div>
                <p className="mb-4">
                  You&apos;re the host. Click the button below to start the quiz
                </p>
                <Button onClick={handleStartQuiz}>Start</Button>
              </div>
            )}
          </section>
          <section>
            <Link href={`/`} className="underline text-blue-600">
              Go to Home
            </Link>
          </section>
        </>
      )}

      {/* PHASE 2: IN PROGRESS (GAME LOOP RUNNING) */}
      {quiz?.status === "In Progress" && currentQuestion && (
        <section className="my-6 bg-white shadow-lg p-6 rounded-xl border">
          <div className="flex justify-between items-center mb-6">
            <span className="px-3 py-1 bg-red-100 text-red-700 font-bold rounded-full">
              Time Left: {timeLeft}s
            </span>
          </div>

          <h2 className="text-xl font-medium mb-6">{currentQuestion.title}</h2>

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

      {/* PHASE 2.5: VIEW FOR HOST */}
      {quiz?.status === "In Progress" &&
        quiz &&
        user &&
        quiz.host._id === user?._id && (
          <section className="my-12 py-10 bg-green-50 rounded-lg border border-amber-200">
            <p className="text-2xl font-bold text-amber-500">
              Quiz In Progress!
            </p>
          </section>
        )}

      {/* PHASE 3: ENDED */}
      {quiz?.status === "Ended" && (
        <>
          <section className="my-12 py-10 bg-green-50 rounded-lg border border-green-200">
            <p className="text-2xl font-bold text-green-700">Quiz Completed!</p>
          </section>
          <section>
            <Link href={`/`} className="underline text-blue-600">
              Go to Home
            </Link>
          </section>
        </>
      )}
    </main>
  );
}
