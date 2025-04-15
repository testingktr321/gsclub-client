import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { email, token, password } = await req.json();
  if (!email || !token || !password)
    return NextResponse.json({ message: "Invalid request" }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.resetToken)
    return NextResponse.json({ message: "Invalid token" }, { status: 400 });

  const isValidToken = await bcrypt.compare(token, user.resetToken);
  if (
    !isValidToken ||
    !user.resetTokenExpiry ||
    new Date() > new Date(user.resetTokenExpiry)
  )
    return NextResponse.json(
      { message: "Token expired or invalid" },
      { status: 400 }
    );

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.update({
    where: { email },
    data: {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiry: null,
    },
  });

  return NextResponse.json(
    { message: "Password reset successful!" },
    { status: 200 }
  );
}
