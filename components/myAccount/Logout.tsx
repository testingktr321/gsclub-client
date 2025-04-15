import React from "react";
import { signOut } from "next-auth/react";
import { Button } from "../ui/button";

const Logout = () => {
    const handleLogout = () => {
        signOut({ callbackUrl: "/" });
    };

    return (
        <div className="flex flex-col items-start justify-center p-6">
            <div className="bg-white rounded-lg shadow p-4 w-full border border-gray-100">
                <h2 className="mb-4">
                    Are you sure you want to log out?
                </h2>
                <div className="ml-2">
                    <Button
                        variant="primary"
                        onClick={handleLogout}
                        className="py-2 px-5 text-white text-sm font-medium cursor-pointer flex gap-3 items-center justify-center border-none"
                    >
                        Logout
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Logout;
