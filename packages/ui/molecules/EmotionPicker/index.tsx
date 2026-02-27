import * as React from "react";
import { cn } from "@ui/lib/utils";
import { Icon } from "@ui/atoms/Icon";
import { Text } from "@ui/atoms/Text";

const EMOTIONS = [
  { id: "ansiedade", label: "Ansiedade", icon: "Brain" as const },
  { id: "raiva", label: "Raiva", icon: "Flame" as const },
  { id: "medo", label: "Medo", icon: "ShieldAlert" as const },
  { id: "frustracao", label: "Frustração", icon: "Frown" as const },
  { id: "inseguranca", label: "Insegurança", icon: "HelpCircle" as const },
  { id: "culpa", label: "Culpa", icon: "HeartCrack" as const },
  { id: "outro", label: "Outro", icon: "MoreHorizontal" as const },
] as const;

export type Emotion = (typeof EMOTIONS)[number]["id"];

export interface EmotionPickerProps {
  value: Emotion | null;
  onChange: (emotion: Emotion) => void;
  className?: string;
}

function EmotionPicker({ value, onChange, className }: EmotionPickerProps) {
  return (
    <div
      className={cn("grid grid-cols-4 gap-3", className)}
      role="radiogroup"
      aria-label="Emoção sentida"
    >
      {EMOTIONS.map((emotion) => (
        <button
          key={emotion.id}
          type="button"
          role="radio"
          aria-checked={value === emotion.id}
          onClick={() => onChange(emotion.id)}
          className={cn(
            "flex flex-col items-center gap-2 p-3 rounded-lg border transition-colors duration-normal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black",
            value === emotion.id
              ? "bg-red-500/10 border-red-500 text-white"
              : "bg-neutral-900 border-neutral-800 text-neutral-500 hover:border-neutral-700 hover:text-white"
          )}
        >
          <Icon name={emotion.icon} size="lg" className={value === emotion.id ? "text-red-500" : ""} />
          <Text size="xs" color={value === emotion.id ? "primary" : "secondary"} as="span">
            {emotion.label}
          </Text>
        </button>
      ))}
    </div>
  );
}

export { EmotionPicker, EMOTIONS };
