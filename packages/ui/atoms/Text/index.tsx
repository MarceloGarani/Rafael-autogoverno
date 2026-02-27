import * as React from "react";
import { cn } from "@ui/lib/utils";
import { cva, type VariantProps } from "@ui/lib/cva";

const textVariants = cva("", {
  variants: {
    size: {
      xs: "text-xs",
      sm: "text-sm",
      base: "text-base",
      lg: "text-lg",
    },
    color: {
      primary: "text-white",
      secondary: "text-neutral-500",
      muted: "text-neutral-600",
      accent: "text-red-500",
    },
    variant: {
      body: "leading-normal",
      caption: "text-xs leading-normal",
      overline: "text-xs uppercase tracking-widest font-medium",
    },
  },
  defaultVariants: {
    size: "base",
    color: "primary",
    variant: "body",
  },
});

export interface TextProps
  extends Omit<React.HTMLAttributes<HTMLParagraphElement>, 'color'>,
    VariantProps<typeof textVariants> {
  as?: "p" | "span" | "div";
}

const Text = React.forwardRef<HTMLParagraphElement, TextProps>(
  ({ className, size, color, variant, as: Tag = "p", children, ...props }, ref) => (
    <Tag ref={ref} className={cn(textVariants({ size, color, variant }), className)} {...props}>
      {children}
    </Tag>
  )
);
Text.displayName = "Text";

export { Text, textVariants };
