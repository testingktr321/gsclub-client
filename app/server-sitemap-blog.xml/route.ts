import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// Helper function to escape XML special characters
function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function GET() {
  try {
    const articles = await prisma.blogArticle.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        updatedAt: true,
        createdAt: true,
        images: {
          select: {
            url: true,
          },
          take: 1,
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${articles
  .map((article) => {
    // Use slug if available, otherwise use ID
    const urlPath = article.slug;

    return `
  <url>
    <loc>https://www.itip.com/blog/${urlPath}</loc>
    <lastmod>${article.updatedAt.toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
    ${
      article.images.length > 0
        ? `<image:image>
      <image:loc>${escapeXml(article.images[0].url)}</image:loc>
      <image:title>${escapeXml(article.title)}</image:title>
    </image:image>`
        : ""
    }
  </url>`;
  })
  .join("")}
</urlset>`;

    return new NextResponse(sitemap, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600",
      },
    });
  } catch (error) {
    console.error("Error generating blog sitemap:", error);
    return new NextResponse("Error generating sitemap", { status: 500 });
  }
}
