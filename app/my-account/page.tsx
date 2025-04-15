import React from 'react';
import Account from '../../components/myAccount/Account';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/utils/auth';
// import { prisma } from '@/lib/prisma';

const Page = async () => {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    redirect(`/login?callbackUrl=${encodeURIComponent('/my-account')}`);
  }

  // Fetch orders for the logged-in user
  // const orders = await prisma.order.findMany({
  //   where: {
  //     userEmail: session.user.email,
  //   },
  //   include: {
  //     Shipment: true,
  //     orderItems: {
  //       include: {
  //         product: {
  //           include: {
  //             images: true,
  //           },
  //         },
  //       },
  //     },
  //   },
  //   orderBy: {
  //     createdAt: 'desc',
  //   },
  // });

  return (
    <div>
      {/* <Account orders={orders as Order[]} /> */}
      <Account />
    </div>
  );
};

export default Page;