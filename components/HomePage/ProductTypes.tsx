"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function ProductTypes() {
    const productTypes = [
        { title: "Vapes", href: "/vapes", img: "/images/vape.png" },
        { title: "Hookah", href: "/hookah", img: "/images/hookah.png" },
        {
            title: "Supplements",
            href: "/supplements",
            img: "/images/supplyment.png",
        },
        {
            title: "Adults goods",
            href: "/adults-goods",
            img: "/images/adult-good.png",
        },
        { title: "Accessories", href: "/accessories", img: "" },
    ];

    return (
        <div className="font-unbounded flex gap-6 flex-wrap justify-center xl:justify-between pt-16 w-11/12 mx-auto">
            {productTypes.map((type, idx) => (
                <div key={idx} className="text-center">
                    <Link href={type.href}>
                        <div className="relative w-30 h-30 md:w-58 md:h-58 rounded-full overflow-hidden flex flex-wrap items-center justify-between border bg-[#DCDCF8] hover:shadow-sm">
                            {type.img ? (
                                <Image
                                    src={type.img}
                                    alt={type.title}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <span className="text-[1rem] text-white text-center md:mx-15 ">
                                    Coming Soon
                                </span>
                            )}
                        </div>
                        <h2>{type.title}</h2>
                    </Link>
                </div>
            ))}
        </div>
    );
}