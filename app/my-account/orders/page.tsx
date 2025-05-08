import React from 'react'
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/utils/auth';
import { Order } from '@/types/order';
import { prisma } from '@/lib/prisma';
import MobileOrder from '@/components/myAccount/MobileOrder';

const page = async () => {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    redirect(`/login?callbackUrl=${encodeURIComponent('/my-account')}`);
  }

  // Fetch orders for the logged-in user
  const rawOrders = await prisma.order.findMany({
    where: {
      userEmail: session.user.email,
    },
    include: {
      Shipment: true,
      orderItems: {
        include: {
          product: {
            include: {
              images: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  // Transform the raw orders to match your Order type
  const orders: Order[] = rawOrders.map(order => ({
    ...order,
    Shipment: order.Shipment ? {
      ...order.Shipment,
      status: order.Shipment.status as 'pending' | 'label_purchased' | 'shipped' | 'delivered'
    } : null,
    orderItems: order.orderItems.map(item => ({
      ...item,
      productSnapshot: {
        id: item.product.id,
        name: item.product.name,
        currentPrice: item.product.currentPrice,
        originalPrice: item.product.originalPrice,
        brandName: item.product.brandId,
        flavorName: '',
        nicotineName: '',
        puffs: []
      },
      product: item.product
    }))
  }));

  return (
    <div>
      <MobileOrder orders={orders as Order[]} />
    </div>
  )
}

export default page


