import * as React from "react";
import { cn } from "@ui/lib/utils";
import { Chip } from "@ui/atoms/Chip";

const CATEGORIES = [
  "Audiência",
  "Negociação",
  "Cliente",
  "Cobrança",
  "Equipe",
  "Decisão",
  "Outro",
] as const;

export type Category = (typeof CATEGORIES)[number];

export interface CategoryChipsProps {
  value: Category | null;
  onChange: (category: Category) => void;
  className?: string;
}

function CategoryChips({ value, onChange, className }: CategoryChipsProps) {
  return (
    <div
      className={cn("flex flex-wrap gap-2", className)}
      role="radiogroup"
      aria-label="Categoria da situação"
    >
      {CATEGORIES.map((category) => (
        <Chip
          key={category}
          selected={value === category}
          onSelect={() => onChange(category)}
        >
          {category}
        </Chip>
      ))}
    </div>
  );
}

export { CategoryChips, CATEGORIES };
