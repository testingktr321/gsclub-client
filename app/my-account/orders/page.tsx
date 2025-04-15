// import React from 'react'
// import { getServerSession } from 'next-auth';
// import { redirect } from 'next/navigation';
// import prisma from '@/lib/db';
// import { authOptions } from '@/utils/auth';
// import MobileOrder from '@/components/myAccount/MobileOrder';
// import { Order } from '@/types/order';

// const page = async () => {
//   const session = await getServerSession(authOptions);
//   if (!session?.user?.email) {
//     redirect(`/login?callbackUrl=${encodeURIComponent('/my-account')}`);
//   }

//   // Fetch orders for the logged-in user
//   const orders = await prisma.order.findMany({
//     where: {
//       userEmail: session.user.email,
//     },
//     include: {
//       Shipment: true,
//       orderItems: {
//         include: {
//           product: {
//             include: {
//               images: true,
//             },
//           },
//         },
//       },
//     },
//     orderBy: {
//       createdAt: 'desc',
//     },
//   });

//   return (
//     <div>
//       <MobileOrder orders={orders as Order[]} />
//     </div>
//   )
// }

// export default page

import React from 'react'

const page = () => {
  return (
    <div>
      sdf
    </div>
  )
}

export default page
