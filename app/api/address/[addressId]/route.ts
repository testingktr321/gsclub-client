import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

type Props = {
  params: Promise<{ addressId: string }>;
};

export async function PUT(req: NextRequest, { params }: Props) {
  const { addressId } = await params;
  const body = await req.json();
  const { name, streetAddress, state, city, zipCode } = body;

  if (!addressId) {
    return NextResponse.json(
      { message: "Address ID is required" },
      { status: 400 }
    );
  }

  if (!name || !streetAddress || !state || !city || !zipCode) {
    return NextResponse.json(
      { message: "All fields are required" },
      { status: 400 }
    );
  }

  try {
    const updatedAddress = await prisma.address.update({
      where: {
        id: addressId,
      },
      data: {
        name,
        streetAddress,
        state,
        city,
        zipCode,
      },
    });

    return NextResponse.json(updatedAddress, { status: 200 });
  } catch (error) {
    console.log("[ADDRESS_PUT]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: Props) {
  const { addressId } = await params;

  if (!addressId) {
    return NextResponse.json(
      { message: "Address ID is required" },
      { status: 400 }
    );
  }

  try {
    await prisma.address.delete({
      where: {
        id: addressId,
      },
    });

    return NextResponse.json(
      { message: "Address deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log("[ADDRESS_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
