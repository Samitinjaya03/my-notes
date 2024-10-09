"use client";

import { FormEvent, useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BiLogoGoogle } from "react-icons/bi";
import { BiSolidShow } from "react-icons/bi";
import { BiSolidHide } from "react-icons/bi";

const Signup = () => {
    const [error, setError] = useState();
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();
    const { data: session } = useSession();

    useEffect(() => {
        if (session) {
            router.push("/");
        }
    }, [session, router]);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const formData = new FormData(event.currentTarget);
            const signupResponse = await axios.post(
                `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/signup`,
                {
                    email: formData.get("email"),
                    password: formData.get("password"),
                    name: formData.get("name"),
                }
            );

            const res = await signIn("credentials", {
                email: signupResponse.data.email,
                password: formData.get("password"),
                redirect: false,
            });

            if (res?.ok) return router.push("/");
        } catch (error) {
            console.log(error);
            if (error instanceof AxiosError) {
                const errorMessage = error.response?.data.message;
                setError(errorMessage);
            }
        }
    };

    return (
        <section className="w-full h-screen flex items-center justify-center">
            <form
                onSubmit={handleSubmit}
                className="p-8 xs:p-10 w-full max-w-[450px] flex flex-col justify-center items-center gap-2 border border-solid border-[#9fb0a8] bg-slate-100 rounded-xl shadow-2xl shadow-blue-700"
            >
                {error && <div className="">{error}</div>}
                <h1 className="mb-5 w-full text-4xl font-bold">Signup</h1>

                <label className="w-full text-xl font-bold">Fullname:</label>
                <input
                    type="text"
                    placeholder="Fullname"
                    className="w-full h-8 border border-solid border-[#5c5254] p-2 rounded text-[16px]"
                    name="name"
                />

                <label className="w-full text-xl font-bold">Email:</label>
                <input
                    type="email"
                    placeholder="Email"
                    className="w-full h-8 border border-solid border-[#5c5254] p-2 rounded text-[16px]"
                    name="email"
                />

                <label className="w-full text-xl font-bold pt-2 pb-0 ">Password:</label>
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
                            setShowPassword(!showPassword);
                        }}
                    >
                        {showPassword ? <BiSolidHide /> : <BiSolidShow />}
                    </button>
                </div>

                <button
                    className="w-full bg-teal-600 text-white font-semibold  py-1.5 mt-4 rounded transition duration-150 ease hover:bg-teal-800 text-[20px]"
                >
                    SignUp
                </button>

                <div className="w-full h-10 relative flex items-center justify-center">
                    <div className="absolute h-px w-full top-2/4 bg-[#242424]"></div>
                    <p className="w-8 h-6 text-white font-bold text-lg bg-black z-10 rounded-full flex items-center justify-center">
                        or
                    </p>
                </div>

                {/* <button
                    className="flex py-2 px-4 text-base  bg-blue-600 text-white font-semibold align-middle items-center rounded text-999 border border-solid border-[#242424] transition duration-150 ease hover:bg-blue-800 gap-3"
                    onClick={() => signIn("google")}
                >
                    <BiLogoGoogle className="text-2xl" /> Sign in with Google
                </button> */}
                <Link
                    href="/login"
                    className="text-lg font-bold pt-4 transition duration-150 ease hover:text-gray-500"
                >
                    Already have an account? Sign In
                </Link>
            </form>
        </section>
    );
};

export default Signup;
