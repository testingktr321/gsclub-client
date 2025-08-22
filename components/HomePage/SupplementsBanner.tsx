import Image from "next/image";
import Link from "next/link";
import React from "react";

const SupplementsBanner = () => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mx-4 sm:mx-8 lg:mx-14 mb-8 sm:mb-10 lg:mb-14 rounded-2xl font-unbounded font-light">
            <div className="relative lg:col-span-3 h-[400px] sm:h-[450px] lg:h-[360px] w-full rounded-[18px] overflow-hidden">
                {/* Background Image */}
                <Image
                    src="/images/couple-goals.jpg"
                    alt="Couple exercising together - supplements lifestyle"
                    fill
                    className="object-cover lg:object-[right_65%_top_30%]"
                    priority
                    sizes="(max-width: 1024px) 100vw, 75vw"
                />

                {/* Content Overlay */}
                <div className="relative p-6 sm:p-8 lg:p-12 flex flex-col justify-between h-full">
                    <p className="text-sm sm:text-base lg:text-[20px] tracking-tighter leading-[150%] font-thin mb-4 text-white lg:text-black">
                        Ready to boost your health and <br className="hidden sm:block" />
                        power your active lifestyle? <br className="hidden sm:block" />
                        Discover your perfect <br className="hidden sm:block" />
                        <b className="font-semibold text-sm sm:text-base lg:text-[20px] uppercase">
                            supplements
                        </b>{" "}
                        that can <br className="hidden sm:block" />
                        elevate your wellness, keep you <br className="hidden sm:block" />
                        energized, and help you stay <br className="hidden sm:block" />
                        at your best every day!
                    </p>
                    <div className="flex justify-start">
                        <Link href="/supplements" className="group">
                            <svg
                                width="40"
                                height="40"
                                viewBox="0 0 67 67"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-[40px] h-[40px] sm:w-[45px] sm:h-[45px] lg:w-[50px] lg:h-[50px] transition-transform duration-300 group-hover:rotate-45"
                            >
                                <circle cx="33.5" cy="33.5" r="33" stroke="currentColor" className="text-white lg:text-black" />
                                <line
                                    x1="21.3536"
                                    y1="21.6464"
                                    x2="45.8819"
                                    y2="46.1748"
                                    stroke="currentColor"
                                    className="text-white lg:text-black"
                                />
                                <path d="M45.5283 46.0566L22.8868 46.0566" stroke="currentColor" className="text-white lg:text-black" />
                                <path d="M46 46.585L46 24.0001" stroke="currentColor" className="text-white lg:text-black" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="lg:col-span-1 bg-[#CFA3AD] rounded-[18px] flex justify-center items-center text-white p-6 sm:p-8 lg:p-4 min-h-[300px] lg:min-h-0">
                <div className="text-center lg:text-left">
                    <p className="text-sm sm:text-base lg:text-medium font-light">
                        <b className="font-semibold text-3xl sm:text-4xl lg:text-5xl block mb-2 lg:mb-0">70%</b>
                        <br className="hidden lg:block" />
                        <br className="hidden lg:block" />
                        <span className="block mt-2 lg:mt-0">
                            of adults in the U.S.
                            <br /> use supplements, with <br />
                            <b className="font-semibold">
                                many experiencing <br />
                                improved nutrient
                                <br /> intake and potential <br />
                                reductions in <br />
                                deficiency-related <br />
                                health issues
                            </b>
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SupplementsBanner;