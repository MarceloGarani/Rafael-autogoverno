import * as React from "react";
import { cn } from "@ui/lib/utils";
import { cva, type VariantProps } from "@ui/lib/cva";

const chipVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-normal cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black",
  {
    variants: {
      state: {
        default: "bg-neutral-900 border border-neutral-800 text-neutral-500 hover:border-neutral-700 hover:text-white",
        selected: "bg-red-500 border border-red-500 text-white",
        disabled: "bg-neutral-900 border border-neutral-800 text-neutral-700 cursor-not-allowed opacity-50",
      },
    },
    defaultVariants: {
      state: "default",
    },
  }
);

export interface ChipProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange">,
    VariantProps<typeof chipVariants> {
  selected?: boolean;
  onSelect?: () => void;
  icon?: React.ReactNode;
}

const Chip = React.forwardRef<HTMLButtonElement, ChipProps>(
  ({ className, selected, disabled, onSelect, icon, children, ...props }, ref) => {
    const state = disabled ? "disabled" : selected ? "selected" : "default";

    return (
      <button
        ref={ref}
        type="button"
        role="radio"
        aria-checked={selected}
        className={cn(chipVariants({ state }), className)}
        onClick={onSelect}
        disabled={disabled}
        {...props}
      >
        {icon}
        {children}
      </button>
    );
  }
);
Chip.displayName = "Chip";

export { Chip, chipVariants };
