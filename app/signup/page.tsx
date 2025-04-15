import Signup from '@/components/Authentication/Signup'
import React from 'react'
import { authOptions } from '@/utils/auth';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

const page = async () => {
    const session = await getServerSession(authOptions);
    if (session?.user) {
        redirect('/')
    }
    return (
        <Signup />
    )
}

export default page
