import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sendEmail } from "@/lib/mail";
import { prisma } from "@/lib/prisma";
import { resetPasswordTemplate } from "@/emails/resetPasswordTemplate";

export async function POST(req: Request) {
  const { email } = await req.json();
  if (!email)
    return NextResponse.json({ message: "Email is required" }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user)
    return NextResponse.json({ message: "User not found" }, { status: 404 });

  // Generate a reset token
  const token = Math.random().toString(36).substr(2);
  const hashedToken = await bcrypt.hash(token, 10);

  // Store the token in the database
  await prisma.user.update({
    where: { email },
    data: {
      resetToken: hashedToken,
      resetTokenExpiry: new Date(Date.now() + 3600000),
    }, // 1 hour expiry
  });

  // Send email with reset link
  const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}&email=${email}`;
  await sendEmail(
    email,
    "Password Reset Request",
    resetPasswordTemplate(user.name, resetLink)
  );

  return NextResponse.json(
    { message: "Reset link sent! Check your email." },
    { status: 200 }
  );
}
