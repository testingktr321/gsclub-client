"use client";
// import { Order } from "@/types/order";
import { useRouter } from "next/navigation";
import React from "react";
import { IoIosArrowBack } from "react-icons/io";
// import OrderHistoryPop from "./OrderHistoryPopUp";

// interface AccountProps {
//   orders: Order[];
// }

const MobileOrder = ({ }) => {
  // const MobileOrder: React.FC<AccountProps> = ({ orders }) => {
  // const [orderDetails, setOrderDetails] = useState(false);
  // const [singleOrderDetails, setSingleOrderDetails] = useState<Order>();

  // -------------------function for date format---------------------
  // const DateFormatted = (date: string) => {
  //   const newDate = new Date(date);

  //   const day = newDate.getUTCDate();
  //   const month = newDate.toLocaleString("default", { month: "short" });
  //   const year = newDate.getUTCFullYear();

  //   const formattedDate = `${day} ${month}, ${year}`;

  //   return formattedDate;
  // };

  // const detailsForSingleProduct = (id: string) => {
  //   setOrderDetails(true);

  //   const allData = orders.find((order) => order.id === id); // Use find instead of filter

  //   if (allData) {
  //     setSingleOrderDetails(allData);
  //   } else {
  //     console.error("Order not found with ID:", id);
  //   }
  // };

  const router = useRouter();

  return (
    <div className="w-11/12 lg:w-10/12 mx-auto lg:mt-[7rem] mt-[11rem] mb-[3rem] md:mb-[5rem] font-plusSans min-h-[100vh] lg:hidden">
      <h3
        className="flex items-center font-plusSans font-bold text-[1.2rem] cursor-pointer"
        onClick={() => router.back()}
      >
        <span>
          <IoIosArrowBack />
        </span>
        Account
      </h3>

      {/* Mapping over orders */}
      {/* {orders.length > 0 ? (
        orders.map((order) => (
          <div
            key={order.id}
            className="bg-white p-2 shadow-md rounded-md mt-5 flex justify-between items-center cursor-pointer"
            onClick={() => detailsForSingleProduct(order.id)}
          // onClick={() => router.push(`/order/${order.id}`)}
          >
            <div>
              <h3 className="font-bold text-[1.1rem]">#{order.id}</h3>
              <p className="text-[0.9rem] font-medium">
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
              <span className="text-[0.8rem] text-[#8E8E93]">
                ${order.total.toFixed(2)}
              </span>
            </div>
            <span className="text-[1.2rem]">
              <IoIosArrowForward />
            </span>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500 mt-5">No orders found.</p>
      )} */}

      {/* order popUp  */}
      {/* <OrderHistoryPop
        orderDetails={orderDetails}
        singleOrderDetails={singleOrderDetails}
        setOrderDetails={setOrderDetails}
        DateFormatted={DateFormatted}
      /> */}
    </div>
  );
};

export default MobileOrder;
