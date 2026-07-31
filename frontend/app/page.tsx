"use client";
import { useStore } from "@/store/useStore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Dashboard = () => {
  const { user } = useStore();
  const router = useRouter();

  useEffect(() => {
    if (user === null) {
      router.push(`/login`);
    } else if (user !== undefined) {
    }
  }, [router, user]);

  return (
    <div>
      <h1 className="font-bold text-2xl">Dashboard</h1>
      <h3>{user?.name || "Unknown user"}</h3>

      <Link href={`/quiz/organise`} className="underline text-blue-600">
        Organise Quiz
      </Link>

      <div>
        <h2>Past Quizes(Hosted and Participated</h2>
      </div>
    </div>
  );
};
export default Dashboard;
