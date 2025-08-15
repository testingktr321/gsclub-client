import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET: Fetch all FAQ pages or single page by slug
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const pageSlug = searchParams.get("pageSlug");

    if (pageSlug) {
      // Get single FAQ page by slug
      const faqPage = await prisma.faq.findFirst({
        where: {
          pageSlug,
          isActive: true,
        },
      });

      if (!faqPage) {
        return NextResponse.json(
          { error: "FAQ page not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(faqPage, { status: 200 });
    } else {
      // Get all active FAQ pages
      const faqPages = await prisma.faq.findMany({
        where: { isActive: true },
        orderBy: { createdAt: "desc" },
      });

      return NextResponse.json(faqPages, { status: 200 });
    }
  } catch (error) {
    console.error("GET /api/faqs error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
