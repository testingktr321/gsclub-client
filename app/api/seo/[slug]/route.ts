import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function GET(req: NextRequest, { params }: Props) {
  const { slug } = await params;

  try {
    const seoData = await prisma.seoPage.findUnique({
      where: {
        slug: slug,
        isActive: true,
      },
    });

    if (!seoData) {
      return NextResponse.json(
        { message: "SEO data not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(seoData);
  } catch (error) {
    console.error("Error fetching SEO data:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
