import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ShippingAddressForm from "./ShippingAddressForm";
import { PiPencilSimpleLine } from "react-icons/pi";

interface Card {
    id: string;
    name: string;
    streetAddress: string;
    state: string;
    city: string;
    zipCode: string;
}

const popupVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
};

interface ShippingAddressModalProps {
    selectedCard: Card | null;
    onAddressSubmit: (address: Card) => void;
}

const ShippingAddressModal = ({ selectedCard, onAddressSubmit }: ShippingAddressModalProps) => {
    const [showModal, setShowModal] = useState(false);

    const handleFormSubmit = (data: Card) => {
        onAddressSubmit(data);
        setShowModal(false);
    };

    return (
        <div>
            {/* Button to Add/Edit Address */}
            {!selectedCard ? (
                <div className="w-full flex items-center justify-center">
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-white text-black w-12 h-12 rounded-full flex justify-center items-center mt-4 shadow hover:shadow-lg transition"
                    >
                        +
                    </button>
                </div>
            ) : (
                <div className="p-4 rounded-lg relative border-[1.5px] border-[#8C14AC]">
                    <div className="flex justify-between items-center absolute right-3">
                        <button
                            onClick={() => setShowModal(true)}
                            className="text-gray-500 hover:text-gray-800 transition"
                        >
                            <PiPencilSimpleLine className="text-[1.3rem]" />
                        </button>
                    </div>
                    <h3 className="font-semibold">{selectedCard.name}</h3>
                    <p className="text-gray-500">
                        {selectedCard.streetAddress}, {selectedCard.city}, {selectedCard.state}, {selectedCard.zipCode}
                    </p>
                </div>
            )}

            <AnimatePresence>
                {showModal && (
                    <motion.div
                        className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
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
                            <ShippingAddressForm
                                onSubmit={handleFormSubmit}
                                defaultValues={selectedCard || undefined}
                                setShowModal={setShowModal}
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ShippingAddressModal;