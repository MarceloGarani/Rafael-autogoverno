import * as React from "react";
import { cn } from "@ui/lib/utils";
import { cva, type VariantProps } from "@ui/lib/cva";

const textareaVariants = cva(
  "w-full bg-neutral-900 text-white border rounded-md px-4 py-3 text-base placeholder:text-neutral-600 transition-colors duration-normal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:cursor-not-allowed disabled:opacity-50 resize-none",
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

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaVariants> {
  autoResize?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, state, autoResize, onChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (autoResize) {
        e.target.style.height = "auto";
        e.target.style.height = `${e.target.scrollHeight}px`;
      }
      onChange?.(e);
    };

    return (
      <textarea
        ref={ref}
        className={cn(textareaVariants({ state }), className)}
        onChange={handleChange}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea, textareaVariants };
