"use client";
import React, { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const GetMail = () => {
    const [userEmail, setUserEmail] = useState<string>("");
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("Submitted email:", userEmail);
        // You can send it to an API or store it somewhere here
    };
    return (
        <div className="font-unbounded mx-4 sm:mx-8 lg:mx-14 text-white px-4 sm:px-8 lg:px-12 py-4 sm:py-6 leading-[140%] bg-gradient-to-r from-[#232BEC] to-[#98029B] w-auto h-auto flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 lg:gap-0 rounded-[20px]">
            <div className="text-base sm:text-lg lg:text-xl">
                <h2 className="font-medium mb-1 sm:mb-2">
                    Want to stay ahead of the latest updates?
                </h2>
                <p className="font-light">Subscribe to our newsletter today and</p>
                <p className="font-light">be the first to know what&apos;s new!</p>
            </div>
            <div className="w-full lg:w-auto">
                <form onSubmit={handleSubmit} className="font-light flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center">
                    <div className="flex-1 sm:flex-initial">
                        <Input
                            type="email"
                            placeholder="Write your e-mail"
                            className="text-sm sm:text-base lg:text-lg font-extralight pl-4 h-10 sm:h-8 bg-white rounded-full text-[#090808] w-full sm:w-auto sm:min-w-[250px]"
                            value={userEmail}
                            onChange={(e) => setUserEmail(e.target.value)}
                        />
                    </div>
                    <Button
                        variant="secondary"
                        type="submit"
                        className="bg-[#090808] text-center h-10 sm:h-8 text-white font-medium px-8 sm:px-14 text-lg sm:text-xl rounded-full whitespace-nowrap"
                    >
                        I&apos;m in
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default GetMail;