import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    // Extract query parameters
    const { searchParams } = new URL(req.url);
    const productIds = searchParams.getAll("id");
    const limit = searchParams.get("limit")
      ? parseInt(searchParams.get("limit")!)
      : undefined;
    const page = searchParams.get("page")
      ? parseInt(searchParams.get("page")!)
      : 1;
    const skip = page && limit ? (page - 1) * limit : undefined;

    // Filter parameters
    const brandId = searchParams.get("brandId");
    const flavorId = searchParams.get("flavorId");
    const puffsId = searchParams.get("puffsId");
    const nicotineId = searchParams.get("nicotineId");
    const search = searchParams.get("search");
    const archived = searchParams.has("archived")
      ? searchParams.get("archived") === "true"
      : false;
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");

    // Build filter object
    const filter: Prisma.ProductWhereInput = {};

    // Only apply the archive filter if we're not querying by specific IDs
    if (!productIds.length) {
      filter.isArchived = archived;
    }

    // Filter products by IDs
    if (productIds.length) {
      filter.id = { in: productIds };
    }

    // Add OR condition for brandId and flavorId if both are present
    if (brandId && flavorId) {
      filter.OR = [{ brandId: brandId }, { flavorId: flavorId }];
    } else {
      // Add individual filters if only one is present
      if (brandId) filter.brandId = brandId;
      if (flavorId) filter.flavorId = flavorId;
    }

    // Add other filters (these remain AND conditions with the above)
    if (nicotineId) filter.nicotineId = nicotineId;

    // Add puffs filter through ProductPuffs relation
    if (puffsId) {
      filter.productPuffs = {
        some: {
          puffsId: puffsId,
        },
      };
    }

    // Add price range filter
    if (minPrice || maxPrice) {
      filter.currentPrice = {};
      if (minPrice) filter.currentPrice.gte = parseFloat(minPrice);
      if (maxPrice) filter.currentPrice.lte = parseFloat(maxPrice);
    }

    // Add search filter if provided
    if (search) {
      filter.OR = [
        ...(filter.OR || []), // Preserve existing OR conditions
        { name: { contains: search, mode: "insensitive" } },
        { eLiquidContent: { contains: search, mode: "insensitive" } },
        { batteryCapacity: { contains: search, mode: "insensitive" } },
        { coil: { contains: search, mode: "insensitive" } },
        { firingMechanism: { contains: search, mode: "insensitive" } },
        { type: { contains: search, mode: "insensitive" } },
      ];
    }

    // Handle flavor name filtering (same as before)
    if (flavorId && !brandId) {
      // Only apply if brandId isn't also being filtered
      const flavor = await prisma.flavor.findUnique({
        where: { id: flavorId },
        select: { name: true },
      });

      if (flavor) {
        // Remove the simple flavorId filter if we're using OR logic
        if (!filter.OR) {
          delete filter.flavorId;
        }

        const flavorWords = flavor.name
          .split(" ")
          .filter((word) => word.length > 0);

        if (flavorWords.length === 1) {
          filter.flavor = {
            OR: [
              { name: { equals: flavor.name, mode: "insensitive" } },
              { name: { startsWith: `${flavor.name} `, mode: "insensitive" } },
              { name: { contains: ` ${flavor.name} `, mode: "insensitive" } },
              { name: { endsWith: ` ${flavor.name}`, mode: "insensitive" } },
            ],
          };
        } else {
          filter.flavor = {
            AND: flavorWords.map((word) => ({
              name: { contains: word, mode: "insensitive" },
            })),
          };
        }
      }
    }

    // Query products with pagination and filters
    const products = await prisma.product.findMany({
      where: filter,
      include: {
        images: true,
        brand: true,
        flavor: true,
        Nicotine: true,
        productPuffs: {
          include: {
            puffs: true,
          },
        },
      },
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    });

    // Transform the productPuffs data to a more usable format if needed
    const transformedProducts = products.map((product) => ({
      ...product,
      puffs: product.productPuffs.map((pp) => ({
        ...pp.puffs,
        puffDesc: pp.puffDesc,
      })),
    }));

    // Get total count for pagination
    const totalCount = await prisma.product.count({
      where: filter,
    });

    return NextResponse.json({
      products: transformedProducts,
      totalCount,
      page,
      pageSize: limit,
      totalPages: limit ? Math.ceil(totalCount / limit) : 1,
    });
  } catch (error) {
    console.error("[PRODUCTS_GET]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
