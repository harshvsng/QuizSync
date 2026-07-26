"use client";
import { Button, TextInput } from "@mantine/core";
import Link from "next/link";
import React, { SubmitEvent, useState } from "react";
import { signupAPI } from "@/api/auth";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const defaultSignupPayload = {
  name: "",
  email: "",
  password: "",
};

const Login = () => {
  const [signupPayload, setSignupPayload] = useState(defaultSignupPayload);

  const router = useRouter();

  const handlePayloadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSignupPayload({ ...signupPayload, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await signupAPI(signupPayload);
    if (!response.success) {
      toast.error(response.error);
      return;
    }
    localStorage.setItem(
      "accessToken",
      (response.data as { accessToken: string }).accessToken,
    );

    toast.success(`Signup successful`);
    setTimeout(() => {
      window.location.reload()
    }, 1500);
  };

  return (
    <div>
      <p className="font-bold text-xl text-center my-5">Signup</p>
      <div className="place-items-center">
        <form className="grid gap-2" onSubmit={handleSubmit}>
          <div className="w-50">
            <TextInput
              label="Name"
              name="name"
              value={signupPayload.name}
              onChange={handlePayloadChange}
            />
          </div>
          <div className="w-50">
            <TextInput
              label="Email"
              name="email"
              value={signupPayload.email}
              onChange={handlePayloadChange}
            />
          </div>
          <div className="w-50">
            <TextInput
              label="Password"
              name="password"
              type="password"
              value={signupPayload.password}
              onChange={handlePayloadChange}
            />
          </div>
          <div>
            <Button style={{ width: "100%" }} type="submit">
              Signup
            </Button>
          </div>
          <div className="w-50">
            <Link href="/login" className="text-blue-600 text-sm underline">
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};
export default Login;
