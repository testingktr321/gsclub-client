import { prisma } from "@/lib/prisma";
import { Product } from "@/types/product";
import { NextRequest, NextResponse } from "next/server";

type Props = {
  params: Promise<{ productSlug: string }>;
};

export async function GET(req: NextRequest, { params }: Props) {
  const { productSlug } = await params;

  try {
    const product = await prisma.product.findUnique({
      where: {
        slug: productSlug,
      },
      include: {
        Review: true,
        images: {
          orderBy: {
            position: "asc",
          },
        },
        brand: true,
        flavor: true,
        Nicotine: true,
        productPuffs: {
          include: {
            puffs: true,
          },
          orderBy: {
            createdAt: "asc",
          },
        },
        productFlavors: {
          include: {
            flavor: true,
          },
        },
        ProductContentSection: true,
      },
    });

    if (!product) {
      return new NextResponse(null, { status: 404 });
    }
    if (!product.slug) {
      console.error("Product found but slug is null:", product.id);
      return new NextResponse(null, { status: 500 });
    }

    const transformedProduct: Product = {
      ...product,
      slug: product.slug,
      packCount: product.packCount ?? 1,
      puffs: product.productPuffs.map((pp) => ({
        ...pp.puffs,
        description: pp.puffDesc,
      })),
    };

    return NextResponse.json(transformedProduct);
  } catch (error) {
    console.error("Failed to fetch product:", error);
    return new NextResponse(null, { status: 500 });
  }
}
