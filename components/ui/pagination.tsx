"use client"
import * as React from "react"
import { useState, useRef, useEffect } from "react"
import { ChevronLeftIcon, ChevronRightIcon, MoreHorizontalIcon } from "lucide-react"
import { cn } from "@/lib/utils"

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

      const size = Math.max(rect.width, rect.height) * 1.5;

      const newRipple = {
        x,
        y,
        size,
        id: nextId.current++,
      };

      setRipples((prev) => [...prev, newRipple]);

      onClick?.(e);
    };

    useEffect(() => {
      if (ripples.length > 0) {
        const timer = setTimeout(() => {
          setRipples((prev) => prev.slice(1));
        }, 600);

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

function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      data-slot="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  )
}

function PaginationContent({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn("flex flex-row items-center gap-1", className)}
      {...props}
    />
  )
}

function PaginationItem({ ...props }: React.ComponentProps<"li">) {
  return <li data-slot="pagination-item" {...props} />
}

type PaginationLinkProps = {
  isActive?: boolean
  size?: 'default' | 'sm' | 'lg' | 'icon'
} & React.ComponentProps<"a">

function PaginationLink({
  className,
  isActive,
  size = "icon",
  ...props
}: PaginationLinkProps) {
  return (
    <a
      aria-current={isActive ? "page" : undefined}
      data-slot="pagination-link"
      data-active={isActive}
      className={cn(
        `inline-flex items-center justify-center 
        cursor-pointer rounded-full transition-colors 
        focus-visible:outline-none focus-visible:ring-2 
        focus-visible:ring-indigo-500 focus-visible:ring-offset-2 
        disabled:opacity-50 disabled:pointer-events-none 
        duration-300 relative overflow-hidden
        ${isActive
          ? 'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50'
          : 'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50'}
        ${size === 'default' ? 'h-9 px-4 py-2' : ''}
        ${size === 'sm' ? 'h-8 rounded-md gap-1.5 px-3' : ''}
        ${size === 'lg' ? 'h-10 rounded-md px-6' : ''}
        ${size === 'icon' ? 'size-9' : ''}`,
        className
      )}
      {...props}
    />
  )
}

function PaginationPrevious({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      aria-label="Go to previous page"
      size="default"
      className={cn("gap-1 px-2.5 sm:pl-2.5", className)}
      {...props}
    >
      <ChevronLeftIcon />
      <span className="hidden sm:block">Previous</span>
    </PaginationLink>
  )
}

function PaginationNext({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      aria-label="Go to next page"
      size="default"
      className={cn("gap-1 px-2.5 sm:pr-2.5", className)}
      {...props}
    >
      <span className="hidden sm:block">Next</span>
      <ChevronRightIcon />
    </PaginationLink>
  )
}

function PaginationEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn("flex size-9 items-center justify-center", className)}
      {...props}
    >
      <MoreHorizontalIcon className="size-4" />
      <span className="sr-only">More pages</span>
    </span>
  )
}

export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
}