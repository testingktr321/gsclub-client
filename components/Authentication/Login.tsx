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
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";

// Zod validation schema
const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormData = z.infer<typeof formSchema>;

const Login = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
    setIsSubmitting(true);

    try {
      const loginResponse = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (loginResponse?.error) {
        throw new Error(loginResponse.error);
      }

      toast.success("Login successful!");
      router.push("/");
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Invalid credentials. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[82vh] w-11/12 mx-auto flex items- justify-center bg-white text-black font-unbounded pt-[2rem] pb-[4rem]">
      <div className="w-full max-w-md">

        <h1 className="text-2xl font-semibold mb-6 text-center flex items-center gap-2 justify-center mr-4 hover:underline cursor-pointer"
          onClick={() => router.back()}
        >
          <Image src={"/images/left-arrow.png"} width={25} height={25} alt="arrow" />
          Login
        </h1>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
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
          </div>

          <div className="font-light hover:underline text-[#090808]">
            <Link href="/forgot-password">
              Forgot Password?
            </Link>
          </div>

          <Button type="submit" variant="primary" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Logging in..." : "Log In"}
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
            Login with Google
          </div>
        </div>
        <div className="text-center group text-sm text-[#666666]">
          <Link href={"/signup"}>
            Not a member?{" "}
            <span className="text-black group-hover:underline font-medium">
              Sign up
            </span>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Login;
