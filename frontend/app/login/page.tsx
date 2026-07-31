"use client";
import { Button, TextInput } from "@mantine/core";
import Link from "next/link";
import React, { SubmitEvent, useEffect, useState } from "react";
import { loginAPI } from "@/api/auth";
import { toast } from "react-toastify";
import { useStore } from "@/store/useStore";
import { useRouter } from "next/navigation";

const defaultLoginPayload = {
  email: "",
  password: "",
};

const Login = () => {
  const [loginPayload, setLoginPayload] = useState(defaultLoginPayload);
  const { user } = useStore();
  const router = useRouter();

  useEffect(() => {
    if (![undefined, null].includes(user as never)) {
      router.push(`/`);
    }
  }, [router, user]);

  const handlePayloadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginPayload({ ...loginPayload, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await loginAPI(loginPayload);
    if (!response.success) {
      toast.error(response.error);
      return;
    }
    localStorage.setItem(
      "accessToken",
      (response.data as { accessToken: string }).accessToken
    );

    toast.success(`Login successful`);
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  return (
    <div>
      <p className="font-bold text-xl text-center my-5">Login</p>
      <div className="place-items-center">
        <form className="grid gap-2" onSubmit={handleSubmit}>
          <div className="w-50">
            <TextInput
              label="Email"
              name="email"
              value={loginPayload.email}
              onChange={handlePayloadChange}
            />
          </div>
          <div className="w-50">
            <TextInput
              label="Password"
              name="password"
              type="password"
              value={loginPayload.password}
              onChange={handlePayloadChange}
            />
          </div>
          <div>
            <Button style={{ width: "100%" }} type="submit">
              Login
            </Button>
          </div>
          <div className="w-50">
            <Link href="/signup" className="text-blue-600 text-sm underline">
              Signup
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};
export default Login;
