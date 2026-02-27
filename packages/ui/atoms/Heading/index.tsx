import * as React from "react";
import { cn } from "@ui/lib/utils";
import { cva, type VariantProps } from "@ui/lib/cva";

const headingVariants = cva("font-bold text-white", {
  variants: {
    size: {
      xs: "text-xs",
      sm: "text-sm",
      base: "text-base",
      lg: "text-lg",
      xl: "text-xl",
      "2xl": "text-2xl",
      "3xl": "text-3xl",
      "4xl": "text-4xl",
    },
  },
  defaultVariants: {
    size: "2xl",
  },
});

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export interface HeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof headingVariants> {
  level?: HeadingLevel;
  as?: `h${HeadingLevel}`;
}

const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, level = 2, as, size, children, ...props }, ref) => {
    const Tag = as || (`h${level}` as const);

    return (
      <Tag ref={ref} className={cn(headingVariants({ size }), className)} {...props}>
        {children}
      </Tag>
    );
  }
);
Heading.displayName = "Heading";

export { Heading, headingVariants };
