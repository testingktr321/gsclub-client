"use client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { User } from "@/types/user";

const Profile = () => {
  const { data: session } = useSession();
  const [userDetails, setUserDetails] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (session?.user?.email) {
        try {
          const response = await axios.get(`/api/user?email=${session.user.email}`);
          setUserDetails(response.data);
        } catch (error) {
          console.error("Failed to fetch user details", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserDetails();
  }, [session]);

  return (
    <div className="w-full px-4 lg:px-2 py-4 flex lg:justify-center items-center gap-2 border-b border-gray-200">
      <div className="bg-red-200 w-[60px] md:w-[80px] rounded-full relative">
        <Image
          src={userDetails?.image || "/avatar.png"}
          alt="user"
          width={500}
          height={500}
          className="object-cover w-full h-full rounded-full"
        />
      </div>
      <div>
        {loading ? (
          <>
            <div className="h-4 w-32 bg-gray-300 rounded animate-pulse mb-2"></div>
            <div className="h-3 w-48 bg-gray-300 rounded animate-pulse"></div>
          </>
        ) : (
          <>
            <h3 className="font-medium xl:text-[1rem] lg:text-[0.9rem]">
              {userDetails?.name}
            </h3>
            <p className="xl:text-[0.9rem] text-[#8E8E93] lg:text-[0.8rem]">
              {userDetails?.email}
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;