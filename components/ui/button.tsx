"use client"
import React, { useState, useRef, useEffect } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

interface RippleType {
  x: number;
  y: number;
  size: number;
  id: number;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, onClick, variant = 'primary', ...props }, ref) => {
    const [ripples, setRipples] = useState<RippleType[]>([]);
    const buttonRef = useRef<HTMLButtonElement | null>(null);
    const nextId = useRef(0);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      const button = buttonRef.current;
      if (!button) return;

      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Calculate ripple size to cover the entire button
      const size = Math.max(rect.width, rect.height) * 1.5;

      const newRipple = {
        x,
        y,
        size,
        id: nextId.current++,
      };

      setRipples((prev) => [...prev, newRipple]);

      // Call the original onClick if provided
      onClick?.(e);
    };

    // Clean up ripples after animation
    useEffect(() => {
      if (ripples.length > 0) {
        const timer = setTimeout(() => {
          setRipples((prev) => prev.slice(1));
        }, 600); // Match this with your CSS animation duration

        return () => clearTimeout(timer);
      }
    }, [ripples]);

    const baseStyles = `
      inline-flex items-center justify-center 
      cursor-pointer rounded-full transition-colors 
      focus-visible:outline-none focus-visible:ring-2 
      focus-visible:ring-indigo-500 focus-visible:ring-offset-2 
      disabled:opacity-50 disabled:pointer-events-none 
      h-10 py-2 px-6 duration-300 relative overflow-hidden
    `;

    const variantStyles = {
      primary: `bg-gradient-to-r from-[#3E2FE1] to-[#8C14AC] text-white`,
      secondary: `bg-black text-white`,
    };

    return (
      <button
        ref={(node) => {
          if (typeof ref === "function") {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
          buttonRef.current = node;
        }}
        className={`${baseStyles} ${variantStyles[variant]} ${className}`}
        onClick={handleClick}
        {...props}
      >
        {children}

        {/* Ripple elements */}
        {ripples.map((ripple) => (
          <span
            key={ripple.id}
            className="absolute bg-white opacity-30 animate-ripple rounded-full"
            style={{
              left: ripple.x - ripple.size / 2,
              top: ripple.y - ripple.size / 2,
              width: ripple.size,
              height: ripple.size,
              transform: 'scale(0)',
              pointerEvents: 'none',
            }}
          />
        ))}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };