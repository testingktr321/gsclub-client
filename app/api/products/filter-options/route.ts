import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export interface FilterOptions {
  brands: { id: string; name: string }[];
  flavors: { id: string; name: string }[];
  puffs: { id: string; name: string }[];
  nicotineLevels: { id: string; name: string }[];
}

export async function GET() {
  try {
    const [brands, flavors, puffs, nicotineLevels] = await Promise.all([
      prisma.brand.findMany({
        select: { id: true, name: true },
        orderBy: { name: "asc" },
      }),
      prisma.flavor.findMany({
        select: { id: true, name: true },
        orderBy: { name: "asc" },
      }),
      prisma.puffs.findMany({
        select: { id: true, name: true },
        orderBy: { name: "asc" },
      }),
      prisma.nicotine.findMany({
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
