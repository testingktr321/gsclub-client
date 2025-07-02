import { prisma } from "@/lib/prisma";
import { Product } from "@/types/product";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const product = await prisma.product.findUnique({
      where: {
        id: params.productId,
      },
      include: {
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
      },
    });

    if (!product) {
      return new NextResponse(null, { status: 404 });
    }

    const transformedProduct: Product = {
      ...product,
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
