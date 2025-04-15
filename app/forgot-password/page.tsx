import ForgotPassword from '@/components/Authentication/ForgotPassword'
import { authOptions } from '@/utils/auth';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import React from 'react'

const page = async () => {
    const session = await getServerSession(authOptions);
    if (session?.user) {
        redirect('/')
    }
    return (
        <ForgotPassword />
    )
}

export default page
