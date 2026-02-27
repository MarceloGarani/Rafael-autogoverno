import * as React from "react";
import { cn } from "@ui/lib/utils";
import { Label } from "@ui/atoms/Label";
import { Input, type InputProps } from "@ui/atoms/Input";
import { Textarea, type TextareaProps } from "@ui/atoms/Textarea";
import { Text } from "@ui/atoms/Text";

export interface FormFieldProps {
  label: string;
  htmlFor: string;
  required?: boolean;
  error?: string;
  className?: string;
  children: React.ReactNode;
}

function FormField({ label, htmlFor, required, error, className, children }: FormFieldProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Label htmlFor={htmlFor} required={required}>
        {label}
      </Label>
      {children}
      {error ? (
        <Text size="sm" color="accent" aria-live="polite">
          {error}
        </Text>
      ) : null}
    </div>
  );
}

export { FormField };
