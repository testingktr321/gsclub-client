import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type Props = {
  params: Promise<{ reviewId: string }>;
};

export async function DELETE(request: Request, { params }: Props) {
  try {
    const { reviewId } = await params;
    const { searchParams } = new URL(request.url);
    const userEmail = searchParams.get("userEmail");

    // Validate required fields
    if (!reviewId || !userEmail) {
      return NextResponse.json(
        { success: false, message: "Review ID and user email are required" },
        { status: 400 }
      );
    }

    // First, check if the review exists and belongs to the user
    const existingReview = await prisma.review.findUnique({
      where: {
        id: reviewId,
      },
    });

    if (!existingReview) {
      return NextResponse.json(
        { success: false, message: "Review not found" },
        { status: 404 }
      );
    }

    // Check if the review belongs to the user (email match)
    if (existingReview.userEmail !== userEmail) {
      return NextResponse.json(
        { success: false, message: "You can only delete your own reviews" },
        { status: 403 }
      );
    }

    // Delete the review
    await prisma.review.delete({
      where: {
        id: reviewId,
      },
    });

    return NextResponse.json(
      { success: true, message: "Review deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting review:", error);

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
