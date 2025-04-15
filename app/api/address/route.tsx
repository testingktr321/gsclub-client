import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (!email) {
        return NextResponse.json(
            { message: 'Email is required' },
            { status: 400 }
        );
    }

    try {
        const addresses = await prisma.address.findMany({
            where: {
                userEmail: email,
            },
        });

        return NextResponse.json(addresses, { status: 200 });
    } catch (error) {
        console.log("[ADDRESSES_GET]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { email, name, streetAddress, state, city, zipCode } = body;

    if (!email || !name || !streetAddress || !state || !city || !zipCode) {
        return NextResponse.json(
            { message: 'All fields are required' },
            { status: 400 }
        );
    }

    try {
        const newAddress = await prisma.address.create({
            data: {
                userEmail: email,
                name,
                streetAddress,
                state,
                city,
                zipCode,
            },
        });

        return NextResponse.json(newAddress, { status: 201 });
    } catch (error) {
        console.log("[ADDRESS_POST]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}