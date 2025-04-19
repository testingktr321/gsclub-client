"use client";

import React, { useState, useEffect } from "react";
import { PiPencilSimpleLine } from "react-icons/pi";
import { AnimatePresence, motion } from "framer-motion";
import { MdDeleteOutline } from "react-icons/md";
import { useSession } from "next-auth/react";
import { useForm, SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import { FaSpinner } from "react-icons/fa";
import { Address } from "@/types/address";
import { Button } from "../ui/button";

interface FormData {
  name: string;
  streetAddress: string;
  state: string;
  city: string;
  zipCode: string;
}

interface ShippingAddressProps {
  onSelectCard?: (card: Address) => void;
  ischeckoutPage: boolean;

}

const ShippingAddress: React.FC<ShippingAddressProps> = ({ onSelectCard, ischeckoutPage }) => {
  const { data: session } = useSession();
  const email = session?.user.email;
  const [cards, setCards] = useState<Address[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [currentCardId, setCurrentCardId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [loadingDelete, setLoadingDelete] = useState<{ [key: string]: boolean }>({});

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/address?email=${email}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const addresses = await response.json();
      setCards(addresses);
    } catch (error) {
      console.error("Failed to fetch addresses:", error);
      toast.error("Failed to fetch addresses");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (card: Address) => {
    setCurrentCardId(card.id);
    reset({
      name: card.name,
      streetAddress: card.streetAddress,
      state: card.state,
      city: card.city,
      zipCode: card.zipCode,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    try {
      setLoadingDelete((prev) => ({ ...prev, [id]: true }));
      await fetch(`/api/address/${id}`, {
        method: "DELETE",
      });
      setCards((prevCards) => prevCards.filter((card) => card.id !== id));
      toast.success("Address deleted successfully");
    } catch (error) {
      console.error("Failed to delete address:", error);
      toast.error("Failed to delete address");
    } finally {
      setLoadingDelete((prev) => ({ ...prev, [id]: false }));
    }
  };

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    const { name, streetAddress, state, city, zipCode } = data;
    setIsSubmitting(true);

    try {
      if (currentCardId) {
        // Update existing address
        await fetch(`/api/address/${currentCardId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            streetAddress,
            state,
            city,
            zipCode,
          }),
        });
        toast.success("Address updated successfully");
      } else {
        // Add new address
        const response = await fetch("/api/address", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            name,
            streetAddress,
            state,
            city,
            zipCode,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to add address");
        }

        const newAddress = await response.json();
        setCards((prevCards) => [...prevCards, newAddress]);
        setSelectedCardId(newAddress.id);
        toast.success("Address added successfully");
      }

      fetchAddresses();
      setShowModal(false);
      setCurrentCardId(null);
      reset();
    } catch (error) {
      console.error("Failed to save address:", error);
      toast.error("Failed to save address");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddNewCard = () => {
    setCurrentCardId(null);
    reset();
    setShowModal(true);
  };

  const handleCardClick = (card: Address) => {
    setSelectedCardId(card.id);
    if (onSelectCard) {
      onSelectCard(card);
    }
  };

  const popupVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
  };

  return (
    <div className={` ${ischeckoutPage ? "h-fit lg:h-[75vh] overflow-y-auto scrollbar-thin py-4 -mt-2" : "p-4 h-full lg:h-[85vh] overflow-y-auto scrollbar-thin"} w-full flex flex-col items-center `}>
      <div className="space-y-4 w-full ">
        {loading ? (
          <>
            {[...Array(5)].map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow p-4 flex justify-between items-start space-x-4 animate-pulse"
              >
                <div className="w-full">
                  {/* Title shimmer */}
                  <div className="h-5 bg-gray-200 rounded w-1/3 mb-3"></div>

                  {/* Address lines shimmer */}
                  <div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                  </div>
                </div>

                {/* Buttons shimmer */}
                <div className="flex gap-4 shrink-0">
                  <div className="w-5 h-5 bg-gray-200 rounded"></div>
                  <div className="w-5 h-5 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </>
        ) : cards.length > 0 ? (
          cards.map((card) => (
            <div
              key={card.id}
              className={`bg-white  rounded-lg shadow p-4 flex justify-between items-start space-x-4 ${!ischeckoutPage ? "" : "cursor-pointer"} ${selectedCardId === card.id ? ` ${ischeckoutPage ? "border-[1.5px] border-[#8C14AC]" : "border border-gray-100"} ` : "border border-gray-100"
                }`}
              onClick={() => {
                if (ischeckoutPage) {
                  handleCardClick(card);
                }
              }}
            >
              <div>
                <h3 className="font-semibold">{card.name}</h3>
                <p className="text-gray-500">
                  {card.streetAddress},  {card.city}, {card.state}, {card.zipCode}
                </p>
              </div>

              <div className="flex gap-4">
                {!ischeckoutPage &&
                  <button
                    key={card.id}
                    className="text-[1.3rem] text-gray-500 hover:text-gray-800 transition cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(card.id);
                    }}
                    disabled={loadingDelete[card.id]}
                  >
                    {loadingDelete[card.id] ? (
                      <FaSpinner className="animate-spin mx-auto" />
                    ) : (
                      <MdDeleteOutline />
                    )}
                  </button>
                }
                <button
                  className="text-[1.3rem] text-gray-500 hover:text-gray-800 transition cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(card);
                  }}
                >
                  <PiPencilSimpleLine />
                </button>
              </div>
            </div>
          ))
        ) : (
          // No address message
          <p className="text-gray-500 text-center">No addresses available.</p>
        )}
      </div>
      <button
        onClick={handleAddNewCard}
        className="bg-white border border-gray-100 text-black w-12 h-12 rounded-full flex justify-center items-center mt-4 shadow hover:shadow-md transition cursor-pointer"
      >
        +
      </button>

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
              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                <div className="flex flex-col gap-4">
                  <label className="font-bold text-[#8E8E93] text-[0.8rem]">
                    Name
                    <input
                      {...register("name", { required: "Name is required" })}
                      placeholder="Name"
                      className="p-2 mt-1 font-normal text-sm bg-transparent outline-none border rounded-lg w-full"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm">{errors.name.message}</p>
                    )}
                  </label>
                  <label className="font-bold text-[#8E8E93] text-[0.8rem]">
                    Address
                    <textarea
                      {...register("streetAddress", { required: "Address is required" })}
                      placeholder="Address"
                      className="p-2 mt-1 font-normal text-sm bg-transparent outline-none border rounded-lg w-full"
                    />
                    {errors.streetAddress && (
                      <p className="text-red-500 text-sm">{errors.streetAddress.message}</p>
                    )}
                  </label>
                  <div className="flex gap-4">
                    <label className="font-bold text-[#8E8E93] text-[0.8rem] w-full">
                      State
                      <input
                        {...register("state", { required: "State is required" })}
                        placeholder="State"
                        className="p-2 mt-1 font-normal text-sm bg-transparent outline-none border rounded-lg w-full"
                      />
                      {errors.state && (
                        <p className="text-red-500 text-sm">{errors.state.message}</p>
                      )}
                    </label>
                    <label className="font-bold text-[#8E8E93] text-[0.8rem] w-full">
                      City
                      <input
                        {...register("city", { required: "City is required" })}
                        placeholder="City"
                        className="p-2 mt-1 font-normal text-sm bg-transparent outline-none border rounded-lg w-full"
                      />
                      {errors.city && (
                        <p className="text-red-500 text-sm">{errors.city.message}</p>
                      )}
                    </label>
                  </div>
                  <label className="font-bold text-[#8E8E93] text-[0.8rem]">
                    Zip Code
                    <input
                      type="number"
                      {...register("zipCode", { required: "Zip Code is required" })}
                      placeholder="Zip Code"
                      className="p-2 mt-1 font-normal text-sm bg-transparent outline-none border rounded-lg w-full"
                    />
                    {errors.zipCode && (
                      <p className="text-red-500 text-sm">{errors.zipCode.message}</p>
                    )}
                  </label>
                </div>
                <div className="flex justify-end gap-4">
                  <Button
                    variant="secondary"
                    type="button"
                    onClick={() => setShowModal(false)}
                    className=""
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={isSubmitting}
                    className=""
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2 justify-center">
                        <span>Submitting</span>
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
    </div>
  );
};

export default ShippingAddress;