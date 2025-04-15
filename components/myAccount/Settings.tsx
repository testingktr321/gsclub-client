"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { PiPencilSimpleLine } from "react-icons/pi";
import { X } from "lucide-react";
import { useSession } from "next-auth/react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaSpinner } from "react-icons/fa";
import { Button } from "../ui/button";

interface FormData {
  name: string;
}

interface UserDetails {
  name: string;
  email: string;
}

const Settings = () => {
  const { data: session, update } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (session?.user?.email) {
        try {
          const response = await axios.get(`/api/user?email=${session.user.email}`);
          setUserDetails(response.data);
          reset({ name: response.data.name });
        } catch (error) {
          console.error("Failed to fetch user details", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserDetails();
  }, [session, reset]);

  const popupVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
  };

  const onSubmit = async (data: FormData) => {
    if (!session?.user?.email) return;

    setIsSubmitting(true);
    try {
      await axios.patch(`/api/user?email=${session.user.email}`, {
        name: data.name,
      });

      await update({
        name: data.name,
      });

      // Update local state
      setUserDetails((prev) => (prev ? { ...prev, name: data.name } : null));

      toast.success("Name updated successfully");
      setShowModal(false);
    } catch (error) {
      console.log("error", error)
      toast.error("Failed to update name");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="w-full flex gap-6 p-3 md:p-6 font-plusSans">
      <div className="bg-white rounded-lg shadow p-2 md:p-4 w-full flex flex-col justify-between items-start space-x-4 border border-gray-100">
        <h3 className="font-plusSans font-medium text-xl">Account details</h3>

        <div className="mt-5 w-full space-y-5">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">Full Name</p>
              {loading ? (
                <div className="h-4 w-32 bg-gray-300 rounded animate-pulse"></div>
              ) : (
                <p>{userDetails?.name}</p>
              )}
            </div>
            <button
              className="text-[1.3rem] text-gray-500 hover:text-gray-800 transition mr-4 cursor-pointer"
              onClick={() => setShowModal(true)}
            >
              <PiPencilSimpleLine />
            </button>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">E-Mail Address</p>
              {loading ? (
                <div className="h-4 w-48 bg-gray-300 rounded animate-pulse"></div>
              ) : (
                <p>{userDetails?.email}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 bg-opacity-50 flex justify-center items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-6 w-[90%] lg:w-[60%] rounded-lg flex flex-col gap-4"
              variants={popupVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Edit Name</h2>
                <button onClick={() => setShowModal(false)}>
                  <X className="w-5 h-5 cursor-pointer" />
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <label className="font-bold text-[#8E8E93] w-full text-[0.8rem]">
                  FULL NAME
                  <input
                    {...register("name", {
                      required: "Name is required",
                      minLength: {
                        value: 2,
                        message: "Name must be at least 2 characters",
                      },
                    })}
                    placeholder="Name"
                    className="p-2 mt-1 font-normal text-sm bg-transparent outline-none border rounded-lg w-full"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm">{errors.name.message}</p>
                  )}
                </label>

                <div className="w-full flex justify-end mt-5">
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={isSubmitting}
                    className="bg-green px-6 py-2 rounded-lg text-white font-semibold hover:bg-darkGreen transition-all duration-300 ease-in-out hover:scale-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2 justify-center">
                        <span>Saving</span>
                        <FaSpinner className="animate-spin" />
                      </div>
                    ) : (
                      "Save"
                    )}
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Settings;