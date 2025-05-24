import React from 'react'

const ComingSoon = () => {
    return (
        <div className='min-h-[88vh] md:min-h-[82vh] flex flex-col gap-5 items-center justify-center'>
            <h1 className='-mt-14 font-unbounded text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#3E2FE1] to-[#8C14AC] bg-clip-text text-transparent text-center'>
                Coming Soon
            </h1>
            <p className='text-lg text-gray-600 text-center  px-4'>
                We&apos;re working on something amazing! Stay tuned for updates.
                <br />
                Exciting things are on the way.
            </p>
        </div>
    )
}

export default ComingSoon