import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get('slug');

  if (!slug) {
    return NextResponse.json({ error: 'Missing slug' }, { status: 400 });
  }

  try {
    const product = await prisma.product.findUnique({
      where: { slug },
      select: { redirectLink: true },
    });

    return NextResponse.json({ redirectLink: product?.redirectLink || null });
  } catch (error) {
    console.error('API redirect check error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
