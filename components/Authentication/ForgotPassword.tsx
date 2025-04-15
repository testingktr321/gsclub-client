"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";

// Zod validation schema
const formSchema = z.object({
    email: z.string().email("Invalid email address"),
});

type FormData = z.infer<typeof formSchema>;

const ForgotPassword = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(formSchema),
    });

    const onSubmit = async (formData: FormData) => {
        setIsSubmitting(true);

        try {
            const res = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: formData.email }),
            });

            const data = await res.json();
            if (res.ok) {
                toast.success(data.message);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-[82vh] flex items- justify-center bg-white text-black font-unbounded pt-[11rem] lg:pt-[2rem] pb-[1rem] lg:pb-[4rem]">
            <div className="w-full max-w-md">
                <h1 className="text-2xl font-semibold mb-6 text-center flex items-center gap-2 justify-center mr-4 hover:underline cursor-pointer"
                    onClick={() => router.back()}
                >
                    <Image src={"/images/left-arrow.png"} width={25} height={25} alt="arrow" />
                    Forget Password
                </h1>

                <p className="text-center text-gray-600">
                    Enter your email address and we&apos;ll send you a link to reset your password.
                </p>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="font-medium">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                {...register("email")}
                                placeholder="example@email.com"
                                error={errors.email?.message}
                            />
                        </div>
                    </div>

                    <Button type="submit" variant="primary" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? "Sending..." : "Send Reset Link"}
                    </Button>
                </form>

                <div className="text-center group text-sm text-[#666666] mt-5">
                    <Link href={"/login"}>
                        Remember your password?{" "}
                        <span className="text-black group-hover:underline">
                            Login
                        </span>
                    </Link>
                </div>
                <div className="text-center group text-sm text-[#666666] mt-2">
                    <Link href={"/signup"}>
                        Don&apos;t have an account?{" "}
                        <span className="text-black group-hover:underline">
                            Create an account
                        </span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;