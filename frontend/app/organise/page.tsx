"use client";
import { getTopics } from "@/api/question";
import { organiseQuiz } from "@/api/quiz";
import { useStore } from "@/store/useStore";
import { Autocomplete, Button, TextInput } from "@mantine/core";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SubmitEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";

const defaultOrganisePayload = {
  title: "",
  topic: "",
};

const CreateQuiz = () => {
  const [organiseQuizPayload, setOrganiseQuizPayload] = useState(
    defaultOrganisePayload
  );

  const [topics, setTopics] = useState<string[]>([]);

  const [joiningLink, setJoiningLink] = useState("");

  const { user } = useStore();
  const router = useRouter();

  useEffect(() => {
    if (user === null) {
      router.push(`/login`);
    } else if (user !== undefined) {
      getTopics().then((response) => {
        if (!response.success) {
          toast.error("Failed to fetch topics");
          return;
        }
        setTopics((response.data as { topics: string[] }).topics);
      });
    }
  }, [router, user]);

  const handlePayloadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOrganiseQuizPayload({
      ...organiseQuizPayload,
      [e.target.name]: e.target.value,
    });
  };
  const handleSelectChange = (key: string, value: string) => {
    setOrganiseQuizPayload({
      ...organiseQuizPayload,
      [key]: value,
    });
  };

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await organiseQuiz(organiseQuizPayload);
    if (!response.success) {
      toast.error(response.error);
      return;
    }

    toast.success(`Quiz created successfully`);
    setOrganiseQuizPayload(defaultOrganisePayload);
    setJoiningLink((response.data as { joiningLink: string }).joiningLink);
  };

  return (
    <main>
      <section className="place-items-center">
        <p className="my-10 text-xl font-bold">Organise a Quiz</p>
        <form className="grid gap-2" onSubmit={handleSubmit}>
          <div className="w-50">
            <TextInput
              label="Title"
              name="title"
              value={organiseQuizPayload.title}
              onChange={handlePayloadChange}
            />
          </div>
          <div className="w-50">
            <Autocomplete
              label="Topic"
              placeholder="Choose topic"
              data={topics}
              name="topic"
              value={organiseQuizPayload.topic}
              onChange={(v) => handleSelectChange("topic", v)}
            />
          </div>
          <div className="w-50">
            <Button style={{ width: "100%" }} type="submit">
              Create
            </Button>
          </div>
        </form>
      </section>
      <section className="mt-2">
        {joiningLink && (
          <div className="text-center">
            <Link
              href={joiningLink}
              className="text-blue-600 text-sm underline"
            >
              Go to Quiz
            </Link>
          </div>
        )}
      </section>
      <footer></footer>
    </main>
  );
};
export default CreateQuiz;
