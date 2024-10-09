"use client";

import { FormEvent, useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from 'next-auth/react';
import { BiLogoGoogle, BiSolidShow } from 'react-icons/bi';
import { BiSolidHide } from 'react-icons/bi';

const Signin = () => {
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user) {
      router.push("/");
    }
  }, [session, router]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const res = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });

    if (res?.error) {
      setError(res.error as string)
    };

    if (!res?.error) {
      return router.push("/")
    };
  };

  return (
    <section className="w-full h-screen flex items-center justify-center">
      <form
        className="p-8 xs:p-10 w-full max-w-[450px] flex flex-col justify-center items-center gap-2 border border-solid border-[#9fb0a8] bg-slate-100 rounded-xl shadow-2xl shadow-blue-700"
        onSubmit={handleSubmit}
      >
        {error && <div className="">{error}</div>}
        <h1 className="mb-4 w-full text-4xl font-bold">Sign In</h1>

        <label className="w-full text-xl font-bold">Email:</label>
        <input
          type="email"
          placeholder="Email"
          className="w-full h-8 border border-solid border-[#5c5254] p-2 rounded text-[16px]"
          name="email"
        />

        <label className="w-full text-xl font-bold pt-2 pb-0">Password:</label>
        <div className="flex w-full">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full h-10 border-2 border-solid border-[#5c5254] p-2 rounded text-[16px]"
            name="password"
          />
          <button
            className="w-2/12 border-y-2 border-r-2 border-solid border-[#5c5254] bg-gray-200 rounded-r flex items-center justify-center transition duration-150 ease hover:bg-slate-300"
            onClick={(e) => {
              e.preventDefault();
              setShowPassword(!showPassword)
            }}
          >
            {showPassword ? <BiSolidHide /> : <BiSolidShow />}
          </button>
        </div>
        <button className="w-full bg-teal-600 text-white font-semibold  py-1.5 mt-4 rounded transition duration-150 ease hover:bg-teal-800 text-[20px]"
        >
          Sign In
        </button>

        <div className="w-full h-10 relative flex items-center justify-center">
          <div className="absolute h-px w-full top-2/4 bg-[#242424]"></div>
          <p className="w-8 h-6 text-white font-bold text-lg bg-black z-10 rounded-full flex items-center justify-center">or</p>
        </div>

        {/* <button
          className="flex py-2 px-4 text-base  bg-blue-600 text-white font-semibold align-middle items-center rounded text-999 border border-solid border-[#242424] transition duration-150 ease hover:bg-blue-800 gap-3"
          onClick={(e) => {
            e.preventDefault();
            signIn("google")
          }}>
          <BiLogoGoogle className="text-2xl" /> Sign in with Google
        </button> */}
        <Link href="/register" className="text-lg font-bold pt-4 transition duration-150 ease hover:text-gray-500">
          Don&apos;t have an account? Sign Up
        </Link>
      </form>
    </section>
  );
}

export default Signin;
