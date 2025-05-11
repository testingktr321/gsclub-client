'use client';

import { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ScrollToTopButton = () => {
    const [isVisible, setIsVisible] = useState(false);

    // Show button when page is scrolled down
    const toggleVisibility = () => {
        // Check if window exists (important for Next.js)
        if (typeof window !== 'undefined') {
            // Show button when scrolled down more than half of viewport height
            if (window.scrollY > window.innerHeight / 2) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        }
    };

    // Set up scroll event listener
    useEffect(() => {
        if (typeof window !== 'undefined') {
            window.addEventListener('scroll', toggleVisibility);

            // Clean up the event listener
            return () => {
                window.removeEventListener('scroll', toggleVisibility);
            };
        }
    }, []);

    // Scroll to top function
    const scrollToTop = () => {
        if (typeof window !== 'undefined') {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.button
                    onClick={scrollToTop}
                    className="fixed bottom-8 right-8 p-3 bg-gradient-to-r from-[#3E2FE1] to-[#8C14AC] text-white rounded-xl shadow-lg z-50 flex items-center justify-center hover:shadow-xl hover:cursor-pointer"
                    aria-label="Scroll to top"
                    initial={{ opacity: 0, scale: 0.5, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.5, y: 20 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <ChevronUp size={24} />
                </motion.button>
            )}
        </AnimatePresence>
    );
};

export default ScrollToTopButton;