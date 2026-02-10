import * as React from "react";
import { cn } from "../../utils/cn";

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
    return (
        <input
            type={type}
            className={cn(
                "flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm",
                // High contrast text color for user input - dark text on white background
                "text-gray-900 font-medium",
                // Placeholder text - lighter but still readable
                "placeholder:text-gray-500 placeholder:font-normal",
                // Focus states
                "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
                "focus-visible:ring-2 focus-visible:ring-primary",
                // Disabled state
                "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-100",
                // Smooth transitions
                "transition-all duration-200",
                className
            )}
            ref={ref}
            {...props}
        />
    );
});
Input.displayName = "Input";

export { Input };
