"use client";
import React, { Suspense, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";

// Zod validation schema
const formSchema = z.object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

type FormData = z.infer<typeof formSchema>;

const ResetPassword = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const router = useRouter();
    const [token, setToken] = useState<string | null>(null);
    const [email, setEmail] = useState<string | null>(null);
    useEffect(() => {
        // Only runs in the browser
        const params = new URLSearchParams(window.location.search);
        setToken(params.get('token'));
        setEmail(params.get('email'));
    }, []);

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
            const res = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email,
                    token,
                    password: formData.password
                }),
            });

            const data = await res.json();
            if (res.ok) {
                toast.success(data.message);
                setTimeout(() => {
                    router.push('/login');
                }, 2000);
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
        <Suspense fallback={<div>Loading...</div>}>
            <div className="min-h-[82vh] flex items- justify-center bg-white text-black font-unbounded pt-[11rem] lg:pt-[2rem] pb-[1rem] lg:pb-[4rem]">
                <div className="w-full max-w-md">
                    <h1 className="text-2xl font-semibold mb-6 text-center flex items-center gap-2 justify-center mr-4 hover:underline cursor-pointer"
                        onClick={() => router.back()}
                    >
                        <Image src={"/images/left-arrow.png"} width={25} height={25} alt="arrow" />
                        Reset Password
                    </h1>

                    <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="font-medium">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email || ''}
                                    disabled
                                />
                            </div>

                            <div className="space-y-2 relative">
                                <Label htmlFor="password" className="font-medium">New Password</Label>
                                <div className="relative">
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
                                        className="absolute inset-y-0 right-3 flex items-center"
                                    >
                                        {!showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2 relative">
                                <Label htmlFor="confirmPassword" className="font-medium">Confirm New Password</Label>
                                <div className="relative">
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
                                        className="absolute inset-y-0 right-3 flex items-center"
                                    >
                                        {!showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <Button type="submit" variant="primary" className="w-full" disabled={isSubmitting}>
                            {isSubmitting ? "Resetting..." : "Reset Password"}
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
                </div>
            </div>
        </Suspense>
    );
};

export default ResetPassword;