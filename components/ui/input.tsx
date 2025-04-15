import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    error?: string
}
const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, error, ...props }, ref) => {
        return (
            <div className="space-y-1">
                <input
                    ref={ref}
                    className={`mt-1 flex h-10 w-full rounded-full border 
              ${error ? 'border-red-500' : 'border-gray-300'} 
              px-3 py-2 text-sm ring-offset-gray-200 
              file:border-0 file:bg-transparent file:text-sm file:font-medium 
              focus:outline-none focus:ring-1 focus:ring-gray-200 focus:ring-offset-1
              disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
                    {...props}
                />
                {error && <p className="text-sm text-red-600">{error}</p>}
            </div>
        );
    }
);


Input.displayName = "Input"

export { Input }