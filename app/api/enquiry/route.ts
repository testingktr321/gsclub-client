import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { email, subject, inquiry } = body;
    if (!email || !subject || !inquiry) {
      return NextResponse.json(
        { error: "Email, subject, and inquiry are required" },
        { status: 400 }
      );
    }

    const newEnquiry = await prisma.enquiry.create({
      data: {
        email,
        subject,
        inquiry,
      },
    });

    return NextResponse.json(newEnquiry, { status: 201 });
  } catch (error) {
    console.error("Enquiry creation error:", error);
    return NextResponse.json(
      { error: "Failed to create enquiry" },
      { status: 500 }
    );
  }
}
