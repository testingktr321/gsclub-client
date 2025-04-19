import { useForm } from "react-hook-form";
import { Button } from "../ui/button";

interface ShippingAddressFormData {
    id: string;
    name: string;
    streetAddress: string;
    state: string;
    city: string;
    zipCode: string;
}

interface ShippingAddressFormProps {
    onSubmit: (data: ShippingAddressFormData) => void;
    defaultValues?: ShippingAddressFormData;
    setShowModal: (show: boolean) => void;
}

const ShippingAddressForm = ({ onSubmit, defaultValues, setShowModal }: ShippingAddressFormProps) => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ShippingAddressFormData>({
        defaultValues,
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div className="flex flex-col gap-4">
                {/* Name Field */}
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

                {/* Street Address Field */}
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

                {/* State and City Fields */}
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

                {/* Zip Code Field */}
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

            {/* Buttons */}
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
                    type="submit"
                    variant="primary"
                    disabled={isSubmitting}
                    className="disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? "Submitting..." : "Save"}
                </Button>
            </div>
        </form>
    );
};

export default ShippingAddressForm;