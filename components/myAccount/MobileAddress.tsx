"use client"
import { useRouter } from 'next/navigation'
import React from 'react'
import { IoIosArrowBack } from 'react-icons/io'
import ShippingAddress from './ShippingAddress'

const MobileAddress = () => {
    const router = useRouter()

    return (
        <div className="w-11/12 lg:w-10/12 mx-auto font-plusSans">
            <h3
                className="flex items-center font-plusSans font-bold text-[1.2rem] cursor-pointer"
                onClick={() => router.back()}
            >
                <span>
                    <IoIosArrowBack />
                </span>
                Account
            </h3>
            <div className='bg-white p-2 shadow-md rounded-md mt-5 border border-gray-100'>
                <ShippingAddress ischeckoutPage={false} />
            </div>
        </div>
    )
}

export default MobileAddress
