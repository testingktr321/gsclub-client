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
      : 12;
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

    // Add relational filters
    if (brandId) filter.brandId = brandId;
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
        { name: { contains: search, mode: "insensitive" } },
        { eLiquidContent: { contains: search, mode: "insensitive" } },
        { batteryCapacity: { contains: search, mode: "insensitive" } },
        { coil: { contains: search, mode: "insensitive" } },
        { firingMechanism: { contains: search, mode: "insensitive" } },
        { type: { contains: search, mode: "insensitive" } },
      ];
    }

    // Enhanced flavor filtering that checks both direct flavor relation and productFlavors
    if (flavorId) {
      // First get the flavor name from the database
      const flavor = await prisma.flavor.findUnique({
        where: { id: flavorId },
        select: { name: true },
      });

      if (flavor) {
        // Split the flavor name into words
        const flavorWords = flavor.name
          .split(" ")
          .filter((word) => word.length > 0);

        // Create OR condition that checks both direct flavor relation and productFlavors
        filter.OR = [
          // Direct flavor relation
          {
            flavor: {
              OR: [
                { name: { equals: flavor.name, mode: "insensitive" } },
                {
                  name: { startsWith: `${flavor.name} `, mode: "insensitive" },
                },
                { name: { contains: ` ${flavor.name} `, mode: "insensitive" } },
                { name: { endsWith: ` ${flavor.name}`, mode: "insensitive" } },
              ],
            },
          },
          // ProductFlavors relation
          {
            productFlavors: {
              some: {
                flavor: {
                  OR: [
                    { name: { equals: flavor.name, mode: "insensitive" } },
                    {
                      name: {
                        startsWith: `${flavor.name} `,
                        mode: "insensitive",
                      },
                    },
                    {
                      name: {
                        contains: ` ${flavor.name} `,
                        mode: "insensitive",
                      },
                    },
                    {
                      name: {
                        endsWith: ` ${flavor.name}`,
                        mode: "insensitive",
                      },
                    },
                  ],
                },
              },
            },
          },
        ];

        // For multi-word flavors, we need to use AND conditions
        if (flavorWords.length > 1) {
          filter.OR = [
            // Direct flavor relation
            {
              flavor: {
                AND: flavorWords.map((word) => ({
                  name: { contains: word, mode: "insensitive" },
                })),
              },
            },
            // ProductFlavors relation
            {
              productFlavors: {
                some: {
                  flavor: {
                    AND: flavorWords.map((word) => ({
                      name: { contains: word, mode: "insensitive" },
                    })),
                  },
                },
              },
            },
          ];
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
        productFlavors: {
          include: {
            flavor: true,
          },
        },
      },
      skip,
      take: limit,
      orderBy: [
        {
          packCount: "desc",
        },
        {
          createdAt: "desc",
        },
      ],
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
