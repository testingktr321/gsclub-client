"use client"
import Settings from '@/components/myAccount/Settings'
import { useRouter } from 'next/navigation'
import React from 'react'
import { IoIosArrowBack } from 'react-icons/io'

const SettingPage = () => {
    const router = useRouter()
    return (
        <div className="w-11/12 mx-auto py-7 font-unbounded min-h-[100vh] lg:hidden">
            <h3
                className="flex items-center font-plusSans font-bold text-[1.2rem] cursor-pointer"
                onClick={() => router.back()}
            >
                <span>
                    <IoIosArrowBack />
                </span>
                Account
            </h3>
            <div className='bg-white p-2 shadow-md rounded-md mt-5'>
                <Settings />
            </div>
        </div>
    )
}

export default SettingPage
