import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcrypt";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/mail";
import { signupTemplate } from "@/emails/signupTemplate";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password } = body;

    // Check if a user already exists with the given email
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      // If the existing user was created as a guest (name = "Guest User"), update their details
      if (existingUser.name === "Guest User") {
        const hashedPassword = await hash(password, 10);

        const updatedUser = await prisma.user.update({
          where: { email },
          data: {
            name,
            password: hashedPassword,
          },
        });

        return NextResponse.json(updatedUser, { status: 200 });
      }

      // If the user already exists and is not a guest, prevent duplicate registration
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    // If no user exists, create a new one
    const hashedPassword = await hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    await sendEmail(email, "Welcome to GetSmoke!", signupTemplate(name));

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error("[USER_POST_ERROR]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("[USER_FETCH_ERROR]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const body = await req.json();
    const { name, image } = body;

    // Validate at least one field to update
    if (!name && !image) {
      return NextResponse.json(
        { error: "No update fields provided" },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update user with provided fields
    const updatedUser = await prisma.user.update({
      where: { email },
      data: {
        ...(name && { name }),
        ...(image && { image }),
      },
      select: { id: true, name: true, email: true, image: true },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("[USER_UPDATE_ERROR]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
