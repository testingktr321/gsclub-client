'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Button } from '../ui/button';

export default function AgeVerification() {
    const [isVerified, setIsVerified] = useState<boolean | null>(null);
    const [showNotOldEnough, setShowNotOldEnough] = useState(false);

    useEffect(() => {
        // Check localStorage on component mount
        const verified = localStorage.getItem('ageVerified') === 'true';
        setIsVerified(verified);

        // Prevent scrolling when modal is open and not verified
        if (verified === false) {
            document.body.style.overflow = 'hidden';
        }

        // Cleanup function to restore scrolling when component unmounts or verification changes
        return () => {
            document.body.style.overflow = '';
        };
    }, [isVerified]);

    const handleConfirm = (confirmed: boolean) => {
        if (confirmed) {
            localStorage.setItem('ageVerified', 'true');
            setIsVerified(true);
            // Re-enable scrolling
            document.body.style.overflow = '';
        } else {
            setShowNotOldEnough(true);
        }
    };

    // Don't show anything if verified or still loading
    if (isVerified === null || isVerified) {
        return null;
    }

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md p-4"
            >
                <motion.div
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    className="bg-white rounded-lg max-w-md w-full p-8 text-center flex flex-col justify-center items-center font-unbounded"
                >
                    <Image src={"/images/logo.png"} width={180} height={180} alt='getsmoke_logo' className='' />

                    <p className="my-4">Are you of legal smoking age?</p>

                    <div className="flex flex-col gap-4 justify-center">
                        <Button
                            onClick={() => handleConfirm(true)}
                            variant='primary'
                            className="w-full"
                        >
                            Yes, I&apos;m 21 years +
                        </Button>
                        <Button
                            variant='secondary'
                            onClick={() => handleConfirm(false)}
                            className="w-full"
                        >
                            No, I&apos;m under 21 years age
                        </Button>
                    </div>

                    {showNotOldEnough && (
                        <motion.p
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="text-red-600 mt-4"
                        >
                            You are not old enough to view this content.
                        </motion.p>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}