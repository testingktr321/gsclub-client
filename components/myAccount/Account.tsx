"use client";

import React, { useEffect, useState } from "react";
import Profile from "./Profile";
import OrderHistory from "./OrderHistory";
import Filter from "./Filter";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { TfiLayoutListThumb } from "react-icons/tfi";
import { MdOutlinePinDrop } from "react-icons/md";
import { IoSettingsOutline } from "react-icons/io5";
import { MdOutlineLogout } from "react-icons/md";
import { Order } from "@/types/order";

const filterOfAccounts = [
  { id: 1, title: 'My orders', logo: <TfiLayoutListThumb /> },
  { id: 3, title: 'Shipping addresses', logo: <MdOutlinePinDrop /> },
  { id: 5, title: 'Settings', logo: <IoSettingsOutline /> },
  { id: 6, title: 'Log-out', logo: <MdOutlineLogout /> },
]

interface AccountProps {
  orders: Order[];
}

const Account: React.FC<AccountProps> = ({ orders }) => {
  const [selectOpt, setSelectOpt] = useState<string>("My orders");
  const [addressCount, setAddressCount] = useState(0);
  const { status, data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const email = session?.user?.email

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
    }
  }, [status, router, pathname]);

  useEffect(() => {
    const fetchAddressCount = async () => {
      if (!email) return;

      try {
        const response = await fetch(`/api/address?email=${email}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const addresses = await response.json();
        setAddressCount(addresses.length);
      } catch (error) {
        console.error('Failed to fetch addresses:', error);
      }
    };

    fetchAddressCount();
  }, [email]);

  return (
    <>
      {/*----------------- for large screen--------------  */}
      <div className="w-11/12 mx-auto py-7 font-unbounded min-h-[100vh] lg:flex gap-4 hidden bg-white text-black">
        <div className="w-1/4 border border-gray-200 rounded-lg h-[90vh]">
          <Profile />
          <Filter
            filterOfAccounts={filterOfAccounts}
            selectOpt={selectOpt}
            setSelectOpt={setSelectOpt}
          />
        </div>
        <div className="w-3/4 h-[90vh]  border border-gray-200 rounded-lg">
          <OrderHistory selectOpt={selectOpt} orders={orders} />
        </div>
      </div>

      {/*----------------- for mobile screen--------------  */}
      <div className="w-11/12 mx-auto py-7 font-unbounded min-h-[100vh] lg:hidden">
        <h3
          className="flex items-center text-[1.2rem] font-unbounded font-bold mb-6 cursor-pointer"
          onClick={() => router.back()}
        >
          <span>
            <IoIosArrowBack />
          </span>
          Go Shopping
        </h3>

        {/*----- Profile ------- */}
        <div className=" shadow-md bg-white rounded-lg gap-4 border border-gray-100">
          <Profile />
        </div>

        {/*------------- Order History ------ */}
        <Link href={"/my-account/orders"} className="border border-gray-100 flex items-center justify-between p-4 shadow-md bg-white rounded-lg gap-4 my-4">
          <div>
            <h3 className=" font-bold text-[1.1rem] ">My orders</h3>
            {/* <p className=" text-[0.9rem] text-[#8E8E93]">You have {orders.length} orders</p> */}
          </div>
          <span className=" text-[1.2rem]">
            <IoIosArrowForward />
          </span>
        </Link>

        {/*------------- Shipping Addresses ------ */}
        <Link href={"/my-account/address"} className="border border-gray-100 flex items-center justify-between p-4 shadow-md bg-white rounded-lg gap-4 my-4">
          <div>
            <h3 className=" font-bold text-[1.1rem] ">Shipping Addresses</h3>
            <p className=" text-[0.9rem] text-[#8E8E93]">You have {addressCount} addresses</p>
          </div>
          <span className=" text-[1.2rem]">
            <IoIosArrowForward />
          </span>
        </Link>

        {/*------------- Settings ------ */}
        <Link href={"/my-account/setting"} className="border border-gray-100 flex items-center justify-between p-4 shadow-md bg-white rounded-lg gap-4 my-4">
          <div>
            <h3 className=" font-bold text-[1.1rem] ">Setting</h3>
            <p className=" text-[0.9rem] text-[#8E8E93]">E-mail, Name</p>
          </div>
          <span className=" text-[1.2rem]">
            <IoIosArrowForward />
          </span>
        </Link>
      </div>
    </>
  );
};

export default Account;
