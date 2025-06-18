import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getSEOData(slug: string) {
  try {
    const seoData = await prisma.seoPage.findUnique({
      where: {
        slug,
        isActive: true,
      },
    });

    return seoData;
  } catch (error) {
    console.error("Error fetching SEO data:", error);
    return null;
  }
}
