import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export interface FilterOptions {
  brands: { id: string; name: string }[];
  flavors: { id: string; name: string }[];
  puffs: { id: string; name: string }[];
  nicotineLevels: { id: string; name: string }[];
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const brandId = searchParams.get("brandId");
    const flavorId = searchParams.get("flavorId");
    const puffsId = searchParams.get("puffsId");
    const nicotineId = searchParams.get("nicotineId");

    // Base product filter based on current selections
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const productFilter: any = { isArchived: false };

    if (brandId) productFilter.brandId = brandId;
    if (flavorId) {
      productFilter.OR = [
        { flavorId: flavorId },
        { productFlavors: { some: { flavorId: flavorId } } },
      ];
    }
    if (puffsId) {
      productFilter.productPuffs = { some: { puffsId: puffsId } };
    }
    if (nicotineId) productFilter.nicotineId = nicotineId;

    // Get product IDs that match current filters
    const matchingProducts = await prisma.product.findMany({
      where: productFilter,
      select: { id: true },
    });
    const productIds = matchingProducts.map((p) => p.id);

    // Now get filter options that exist in these products
    const [brands, flavors, puffs, nicotineLevels] = await Promise.all([
      prisma.brand.findMany({
        where: {
          products: {
            some: { id: { in: productIds } },
          },
        },
        select: { id: true, name: true },
        orderBy: { name: "asc" },
      }),
      prisma.flavor.findMany({
        where: {
          OR: [
            { products: { some: { id: { in: productIds } } } },
            { ProductFlavors: { some: { productId: { in: productIds } } } },
          ],
        },
        select: { id: true, name: true },
        orderBy: { name: "asc" },
      }),
      prisma.puffs.findMany({
        where: {
          productPuffs: {
            some: { productId: { in: productIds } },
          },
        },
        select: { id: true, name: true },
        orderBy: { name: "asc" },
      }),
      prisma.nicotine.findMany({
        where: {
          products: {
            some: { id: { in: productIds } },
          },
        },
        select: { id: true, name: true },
        orderBy: { name: "asc" },
      }),
    ]);

    const response: FilterOptions = {
      brands,
      flavors,
      puffs,
      nicotineLevels,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("[FILTER_OPTIONS_GET]", error);
    return NextResponse.json(
      { error: "Failed to fetch filter options" },
      { status: 500 }
    );
  }
}
