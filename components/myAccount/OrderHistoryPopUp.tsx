import React, { Dispatch, ReactNode, SetStateAction } from "react";
import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";
import { IoClose } from "react-icons/io5";
// import Image from "next/image";
// import { Product } from "@/types/product";

// interface OrderItem {
//   id: string;
//   orderId: string;
//   quantity: number;
//   productId: string;
//   product: Omit<Product, "orderItems" | "wishlist">;
// }

// interface Order {
//   id: string;
//   userEmail: string;
//   orderItems: OrderItem[];
//   isPaid: boolean;
//   isDelivered: boolean;
//   phone: string;
//   shippingName: string;
//   shippingStreetAddress: string;
//   shippingState: string;
//   shippingCity: string;
//   shippingZipCode: string;
//   total: number;
//   shippingAmount?: string;
//   paymentMethod: string;
//   deliveryType: string;
//   deliveryFrequency?: string | null;
//   subscriptionId?: string | null;
//   subscriptionStatus?: string | null;
//   parentOrderId?: string | null;
//   shippingRateId?: string | null;
//   Shipment?: Shipment | null;
//   createdAt: Date;
//   updatedAt: Date;
// }

interface allDataProps {
  orderDetails: boolean;
  // singleOrderDetails: Order | undefined;
  setOrderDetails: Dispatch<SetStateAction<boolean>>;
  DateFormatted: (date: string) => ReactNode;
}

const OrderHistoryPopUp = ({
  orderDetails,
  // singleOrderDetails,
  setOrderDetails,
  // DateFormatted,
}: allDataProps) => {
  // console.log("singleOrder Details", singleOrderDetails);

  const popupVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
  };

  // const steps = ["Order received", "Processing", "On the way", "Delivered"];
  // const statusMap = {
  //   pending: 0,
  //   label_purchased: 1,
  //   shipped: 2,
  //   delivered: 3,
  // };
  // const shipmentStatus = singleOrderDetails?.Shipment?.status || "pending";
  // const activeStep = statusMap[shipmentStatus];

  return (
    <AnimatePresence>
      {orderDetails && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white p-6 w-[90%] lg:w-[50%] rounded-lg flex flex-col gap-4"
            variants={popupVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            <div className="flex lg:items-center items-start justify-between">
              {/* Payment Status */}
              {/* <div
                className={` rounded-lg text-center font-semibold ${singleOrderDetails?.isPaid ? "" : "text-red-700 "
                  }`}
              >
                {singleOrderDetails?.isPaid
                  ? "✅ Payment Successful"
                  : "❌ Payment Failed"}
              </div> */}
              <p className="flex justify-end text-[1.4rem]">
                <span
                  onClick={() => setOrderDetails(false)}
                  className="cursor-pointer"
                >
                  <IoClose />
                </span>
              </p>
            </div>

            {/* <p className="flex lg:flex-row flex-col gap-2 lg:gap-10 lg:items-center">
              <span className="font-bold text-[1.1rem]">
                #{singleOrderDetails?.id}
              </span>
              <span className="text-[0.9rem] font-medium">
                {DateFormatted(singleOrderDetails?.createdAt?.toString() || "")}
              </span>
              <span className="text-[0.8rem] text-[#8E8E93]">
                TOTAL: ${singleOrderDetails?.total.toFixed(2)} (
                {singleOrderDetails?.orderItems.reduce(
                  (total, order) => total + order.quantity,
                  0
                )}{" "}
                Products)
              </span>
            </p> */}

            <div className="flex lg:flex-row flex-col lg:justify-between  gap-4">
              {/*---- Product Details ----------*/}
              <div className="lg:w-[50%] w-full h-fit lg:h-[40vh] scrollbar-thin overflow-y-scroll">
                {/* {singleOrderDetails?.orderItems.map((item, index) => (
                  <div className="mt-2" key={index}>
                    <div className="flex items-center gap-4 font-plusSans w-full">
                      <div className="shadow p-2 w-fit rounded-lg">
                        <Image
                          src={item && item.product?.images[0]?.url}
                          alt={"logo"}
                          width={50}
                          height={50}
                          className="w-32 h-18 object-contain"
                        />
                      </div>

                      <div className="flex justify-between w-full items-center">
                        <div className="flex flex-col">
                          <span className="font-normal text-[0.6rem]">
                            {item.product.brand}
                          </span>
                          <h3 className="font-bold text-[1.2rem]">
                            {item.product.name}
                          </h3>
                          <span className="text-[0.8rem] font-medium">
                            {item.product.volume}
                          </span>
                          <span className="text-[0.6rem] font-light">
                            {item.quantity} items
                          </span>
                        </div>
                        <span className="bg-white font-bold text-[1.2rem]">
                          ${item.product.currentPrice * item.quantity}
                        </span>
                      </div>
                    </div>
                  </div>
                ))} */}
              </div>

              {/*---- Address & Payment Method ----------*/}
              <div className="lg:w-[50%] w-full  h-fit lg:h-[40vh] scrollbar-thin overflow-y-scroll p-2">
                {/* <div className="bg-white rounded-lg shadow border p-4 mt-2">
                  <h3 className="font-bold">Address</h3>
                  <p className="text-gray-500">
                    {singleOrderDetails?.shippingName}
                  </p>
                  <p className="text-gray-500">
                    {singleOrderDetails?.shippingStreetAddress},{" "}
                    {singleOrderDetails?.shippingCity},{" "}
                    {singleOrderDetails?.shippingState},{" "}
                    {singleOrderDetails?.shippingZipCode}
                  </p>
                </div> */}

                <div className="bg-white rounded-lg shadow border p-4 mt-4">
                  <h3 className="font-semibold">Payment Method</h3>
                  <p className="text-gray-500">
                    {/* {singleOrderDetails?.paymentMethod} */}
                  </p>
                </div>
              </div>
            </div>
            {/* {singleOrderDetails?.isPaid && (
              <div className="shadow border rounded-lg p-4 -mt-4 bg-white">
                <h3 className="text-[1.2rem] font-bold mb-4">Order Status</h3>
                <Box sx={{ width: "100%" }}>
                  <Stepper activeStep={activeStep} alternativeLabel>
                    {steps.map((label, index) => (
                      <Step key={label}>
                        <StepLabel
                          StepIconComponent={CustomStepIcon}
                          sx={{
                            "& .MuiStepLabel-label": {
                              color:
                                index <= activeStep ? "#4caf50" : "#757575",
                              fontWeight:
                                index === activeStep ? "bold" : "normal",
                            },
                          }}
                        >
                          {label}
                        </StepLabel>
                      </Step>
                    ))}
                  </Stepper>
                </Box>
              </div>
            )} */}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OrderHistoryPopUp;
