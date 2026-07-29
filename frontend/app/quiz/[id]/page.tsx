"use client";
import { getSpecificQuiz } from "@/api/quiz";
import { useStore } from "@/store/useStore";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { toast } from "react-toastify";

const defaultQuizValues = {
  _id: "",
  title: "",
  host: {
    _id: "",
    name: "",
  },
};

const PreviewQuiz = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);

  const [quiz, setQuiz] = useState(defaultQuizValues);

  const { user } = useStore();
  const router = useRouter();

  useEffect(() => {
    if (user === null) {
      router.push(`/login`);
    } else if (user !== undefined) {
      getSpecificQuiz({ id }).then((response) => {
        if (!response.success) {
          toast.error(response.error);
          return;
        }
        setQuiz((response.data as { quiz: typeof defaultQuizValues }).quiz);
      });
    }
  }, [router, user, id]);

  return (
    <main>
      <section className="place-items-center">
        <p className="my-10 text-xl font-bold">Preview Quiz</p>
      </section>
      <section className="my-2 grid gap-4">
        <p className="text-center text-3xl">{quiz.title}</p>
        <p className="text-center text-lg tracking-widest">
          <span className="font-bold">Host: </span>
          {quiz.host.name}
        </p>
      </section>
      <footer></footer>
    </main>
  );
};

export default PreviewQuiz;
