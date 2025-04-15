import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    // Check if a cart already exists for this email
    let cart = await prisma.cart.findUnique({
      where: { email: email },
    });

    // If the cart doesn't exist, create a new cart
    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          email: email,
          items: [],
        },
      });
    }

    // Return the cart (either new or existing)
    return NextResponse.json(cart);
  } catch (error) {
    console.log("[INITIALIZE_CART]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
