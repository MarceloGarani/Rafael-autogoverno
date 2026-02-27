import * as React from "react";
import { cn } from "@ui/lib/utils";
import { cva, type VariantProps } from "@ui/lib/cva";
import { icons, type LucideIcon } from "lucide-react";

const iconVariants = cva("shrink-0", {
  variants: {
    size: {
      sm: "h-4 w-4",
      md: "h-5 w-5",
      lg: "h-6 w-6",
      xl: "h-8 w-8",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

export interface IconProps
  extends React.SVGAttributes<SVGSVGElement>,
    VariantProps<typeof iconVariants> {
  name: string;
}

const Icon = React.forwardRef<SVGSVGElement, IconProps>(
  ({ className, name, size, ...props }, ref) => {
    const LucideComponent = icons[name as keyof typeof icons] as LucideIcon;

    if (!LucideComponent) {
      return null;
    }

    return (
      <LucideComponent
        ref={ref}
        className={cn(iconVariants({ size }), className)}
        aria-hidden="true"
        {...props}
      />
    );
  }
);
Icon.displayName = "Icon";

export { Icon, iconVariants };
