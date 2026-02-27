import * as React from "react";
import { cn } from "@ui/lib/utils";
import { cva, type VariantProps } from "@ui/lib/cva";

const inputVariants = cva(
  "w-full bg-neutral-900 text-white border rounded-md px-4 py-3 text-base placeholder:text-neutral-600 transition-colors duration-normal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      state: {
        default: "border-neutral-800",
        error: "border-red-400",
      },
    },
    defaultVariants: {
      state: "default",
    },
  }
);

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, state, type = "text", ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      className={cn(inputVariants({ state }), className)}
      {...props}
    />
  )
);
Input.displayName = "Input";

export { Input, inputVariants };
