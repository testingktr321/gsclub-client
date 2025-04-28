"use client";
import React, { useState } from "react";
import ShippingAddress from "./ShippingAddress";
import Logout from "./Logout";
import Settings from "./Settings";
import { Order } from "@/types/order";
import OrderHistoryPopUp from "./OrderHistoryPopUp";

interface OrderHistoryProps {
  selectOpt: string;
  orders: Order[];
}

const OrderHistory = ({ selectOpt, orders }: OrderHistoryProps) => {
  const [orderDetails, setOrderDetails] = useState(false);
  const [singleOrderDetails, setSingleOrderDetails] = useState<Order>();

  // -------------------function for date format---------------------
  const DateFormatted = (date: string) => {
    const newDate = new Date(date);

    const day = newDate.getUTCDate();
    const month = newDate.toLocaleString("default", { month: "short" });
    const year = newDate.getUTCFullYear();

    const formattedDate = `${day} ${month}, ${year}`;

    return formattedDate;
  };

  // order details function
  const detailsForSingleProduct = (id: string) => {
    setOrderDetails(true);

    const allData = orders.find((order) => order.id === id);

    if (allData) {
      setSingleOrderDetails(allData);
    } else {
      console.error("Order not found with ID:", id);
    }
  };

  return (
    <div>
      <div>
        {selectOpt == "My orders" && (
          <div>
            <h2 className="text-xl font-medium pl-6 py-4">Order History</h2>
            <div className="h-[80vh] overflow-y-auto scrollbar-thin">
              <table className="w-full text-left font-plusSans">
                <thead>
                  <tr className="bg-[#F2F2F2] font-medium">
                    <th className="border-b border-gray-200 p-2 font-medium px-6">ORDER ID</th>
                    <th className="border-b border-gray-200 p-2 font-medium">DATE</th>
                    <th className="border-b border-gray-200 p-2 font-medium">TOTAL</th>
                    <th className="border-b border-gray-200 p-2 font-medium">{""}</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td className="border-b border-gray-300 px-6 py-2 font-semibold">
                        #{order.id}
                      </td>
                      <td className="border-b border-gray-300 p-2">
                        {DateFormatted(order.createdAt.toString())}
                      </td>
                      <td className="border-b border-gray-300 p-2">
                        ${order.totalAmount.toFixed(2)}(
                        {order.orderItems.reduce(
                          (total, item) => total + item.quantity,
                          0
                        )}{" "}
                        Products)
                      </td>
                      <td
                        onClick={() => detailsForSingleProduct(order.id)}
                        className="border-b border-gray-300 p-2 text-green hover:underline cursor-pointer"
                      >
                        View Details
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* animation popUp of  order details  */}
            <OrderHistoryPopUp
              orderDetails={orderDetails}
              singleOrderDetails={singleOrderDetails}
              setOrderDetails={setOrderDetails}
              DateFormatted={DateFormatted}
            />
          </div>
        )}

        {selectOpt == "Shipping addresses" && (
          <ShippingAddress ischeckoutPage={false} />
        )}
        {selectOpt == "Settings" && <Settings />}
        {selectOpt == "Log-out" && <Logout />}
      </div>
    </div>
  );
};

export default OrderHistory;
