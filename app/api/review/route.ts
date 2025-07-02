import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Validate request content type
    const contentType = request.headers.get("content-type");
    if (!contentType?.includes("application/json")) {
      return NextResponse.json(
        { success: false, message: "Invalid content type" },
        { status: 400 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { userName, userEmail, rating, title, comment, productId } = body;

    // Validate required fields
    if (
      !userName ||
      !userEmail ||
      !rating ||
      !title ||
      !comment ||
      !productId
    ) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate rating range (1-5)
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, message: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    // Create new review
    const newReview = await prisma.review.create({
      data: {
        userName,
        userEmail,
        rating,
        title,
        comment,
        productId,
      },
    });

    return NextResponse.json(
      { success: true, data: newReview },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
