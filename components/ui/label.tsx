import React from 'react'

// Option 1: Using type alias instead of empty interface
type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>

// Option 2: If you want to keep the interface, add at least one property
// interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
//   variant?: 'default' | 'required' | 'optional'
// }

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
    ({ className, ...props }, ref) => {
        return (
            <label
                ref={ref}
                className={`leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}
                {...props}
            />
        )
    }
)

Label.displayName = "Label"

export { Label }