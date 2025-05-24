import React from 'react'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    error?: string
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, error, ...props }, ref) => {
        return (
            <div className="space-y-1">
                <textarea
                    ref={ref}
                    className={`mt-1 flex min-h-20 w-full rounded-2xl border 
              ${error ? 'border-red-500' : 'border-gray-300'} 
              px-3 py-2 text-sm ring-offset-gray-200 
              focus:outline-none focus:ring-1 focus:ring-gray-200 focus:ring-offset-1
              disabled:cursor-not-allowed disabled:opacity-50 resize-vertical ${className}`}
                    {...props}
                />
                {error && <p className="text-sm text-red-600">{error}</p>}
            </div>
        );
    }
);

Textarea.displayName = "Textarea"

export { Textarea }