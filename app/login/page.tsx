import Login from '@/components/Authentication/Login'
import { authOptions } from '@/utils/auth'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import React from 'react'

const page = async () => {
    const session = await getServerSession(authOptions);
    if (session?.user) {
        redirect('/')
    }
    return (
        <Login />
    )
}

export default page
