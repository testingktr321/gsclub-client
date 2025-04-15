import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

type Props = {
  params: Promise<{ email: string }>;
};

export async function GET(req: NextRequest, { params }: Props) {
  const { email } = await params;
  try {
    const cart = await prisma.cart.findUnique({
      where: { email: email },
    });

    if (!cart) {
      return new NextResponse("Cart not found", { status: 404 });
    }

    return NextResponse.json(cart);
  } catch (error) {
    console.log("[GET_CART]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: Props) {
  const { email } = await params;

  try {
    const { items } = await req.json();

    const cart = await prisma.cart.update({
      where: { email: email },
      data: { items },
    });

    return NextResponse.json(cart);
  } catch (error) {
    console.log("[UPDATE_CART]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
