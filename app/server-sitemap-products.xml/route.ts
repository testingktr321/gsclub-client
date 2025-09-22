import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// Helper function to escape XML special characters
function escapeXml(unsafe: string) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: {
        isArchived: false,
      },
      select: {
        id: true,
        slug: true,
        name: true,
        updatedAt: true,
        images: {
          select: {
            url: true,
          },
          take: 1,
        },
      },
    });

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${products
  .map(
    (product) => `
  <url>
    <loc>https://www.itip.com/product/${product.slug}</loc>
    <lastmod>${product.updatedAt.toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    ${
      product.images.length > 0
        ? `<image:image>
      <image:loc>${escapeXml(product.images[0].url)}</image:loc>
      <image:title>${escapeXml(product.name)}</image:title>
    </image:image>`
        : ""
    }
  </url>`
  )
  .join("")}
</urlset>`;

    return new NextResponse(sitemap, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("Error generating products sitemap:", error);
    return new NextResponse("Error generating sitemap", { status: 500 });
  }
}
