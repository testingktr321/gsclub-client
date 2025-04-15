"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

// Zod validation schema
const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Please confirm your password"),
    agreeToTerms: z.literal(true, {
        errorMap: () => ({ message: "You must accept the terms and conditions" }),
    }),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

type FormData = z.infer<typeof formSchema>;

const Signup = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const router = useRouter();
    const [callbackUrl, setCallbackUrl] = useState("/");
    useEffect(() => {
        // This runs ONLY in the browser (after hydration)
        const searchParams = new URLSearchParams(window.location.search);
        setCallbackUrl(searchParams.get("callbackUrl") || "/");
    }, []);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(formSchema),
    });

    const onSubmit = async (formData: FormData) => {
        console.log(formData);
        setIsSubmitting(true);

        try {
            const dataToSend = {
                name: formData.name,
                email: formData.email,
                password: formData.password,
            };

            const res = await fetch("/api/user", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(dataToSend),
            });

            const contentType = res.headers.get("content-type") || "";
            const isJson = contentType.includes("application/json");
            const responseData = isJson ? await res.json() : null;

            if (res.ok) {
                toast.success("Signup successful!");

                // Auto login after successful signup
                const loginResponse = await signIn("credentials", {
                    email: formData.email,
                    password: formData.password,
                    redirect: false,
                });

                if (loginResponse?.error) {
                    throw new Error(loginResponse.error);
                }

                router.push("/");
            } else {
                const errorMessage = responseData?.error || "Signup failed";
                toast.error(errorMessage);
            }
        } catch (error) {
            console.error("Signup error:", error);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-[82vh] flex items- justify-center bg-white text-black font-unbounded pt-[11rem] lg:pt-[2rem] pb-[1rem] lg:pb-[4rem]">
            <div className="w-full max-w-md">
                <h1 className="text-2xl font-semibold mb-6 text-center flex items-center gap-2 justify-center mr-4 hover:underline"
                    onClick={() => router.back()}
                >
                    <Image src={"/images/left-arrow.png"} width={25} height={25} alt="arrow" />
                    Sign up
                </h1>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="font-medium">Full Name</Label>
                            <Input id="name" {...register("name")} placeholder="Your Name" error={errors.name?.message} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email" className="font-medium">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                {...register("email")}
                                placeholder="example@email.com"
                                error={errors.email?.message}
                            />
                        </div>

                        <div className="space-y-2 relative">
                            <Label htmlFor="password" className="font-medium">Password</Label>
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                {...register("password")}
                                placeholder="••••••••"
                                error={errors.password?.message}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-3 flex items-center top-6"
                            >
                                {!showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>

                        <div className="space-y-2 relative">
                            <Label htmlFor="confirmPassword" className="font-medium">Confirm Password</Label>
                            <Input
                                id="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                {...register("confirmPassword")}
                                placeholder="••••••••"
                                error={errors.confirmPassword?.message}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute inset-y-0 right-3 flex items-center top-6"
                            >
                                {!showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>

                        <div className="flex items-center mt-5">
                            <input
                                type="checkbox"
                                id="agreeToTerms"
                                {...register("agreeToTerms")}
                                className="w-4 h-4 accent-[#3E2FE1] mr-2"
                            />
                            <label htmlFor="agreeToTerms" className="text-sm text-[#666666]">
                                I agree to the{" "}
                                <a href="/terms" className="text-black underline">
                                    Terms & Conditions
                                </a>
                            </label>
                        </div>
                        {errors.agreeToTerms && (
                            <p className="text-sm text-red-500">{errors.agreeToTerms.message}</p>
                        )}
                    </div>

                    <Button type="submit" variant="primary" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? "Creating..." : "Create Account"}
                    </Button>
                </form>

                <div>
                    <div className="mt-6 flex items-center gap-3 px-1">
                        <hr className="flex-grow border-t border-[#999999]" />
                        <div className="text-[#999999]">Or</div>
                        <hr className="flex-grow border-t border-[#999999]" />
                    </div>
                </div>

                <div>
                    <div
                        className="my-5 p-2.5 rounded-full bg-gray-100 text-[#1A1A1A] font-medium cursor-pointer flex gap-3 items-center justify-center border-none transition-all duration-300 ease-in-out"
                        onClick={() => signIn("google", { callbackUrl })}
                    >
                        <Image src={"/images/google.png"} width={25} height={25} alt="google" />
                        Signup with Google
                    </div>
                </div>
                <div className="text-center group text-sm text-[#666666]">
                    <Link href={"/login"}>
                        Already a member?{" "}
                        <span className="text-black group-hover:underline">
                            Login
                        </span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Signup;