import * as React from "react";
import { cn } from "@ui/lib/utils";
import { Text } from "@ui/atoms/Text";
import { Textarea } from "@ui/atoms/Textarea";

export interface ReflectionCardProps {
  question: string;
  answer?: string;
  onAnswerChange?: (answer: string) => void;
  index: number;
  className?: string;
}

function ReflectionCard({ question, answer, onAnswerChange, index, className }: ReflectionCardProps) {
  return (
    <div
      className={cn(
        "bg-neutral-900 border border-neutral-800 rounded-lg p-6 flex flex-col gap-4",
        className
      )}
    >
      <div className="flex gap-3">
        <div className="flex items-center justify-center h-6 w-6 rounded-full bg-red-500/10 text-red-500 text-xs font-bold shrink-0">
          {index + 1}
        </div>
        <Text size="base" className="font-medium text-white leading-relaxed">
          {question}
        </Text>
      </div>
      {onAnswerChange !== undefined ? (
        <Textarea
          placeholder="Sua reflexão (opcional)..."
          rows={3}
          value={answer || ""}
          onChange={(e) => onAnswerChange(e.target.value)}
          aria-label={`Resposta para: ${question}`}
        />
      ) : null}
    </div>
  );
}

export { ReflectionCard };
