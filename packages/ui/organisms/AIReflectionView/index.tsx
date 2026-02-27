"use client";

import * as React from "react";
import { cn } from "@ui/lib/utils";
import { Heading } from "@ui/atoms/Heading";
import { Text } from "@ui/atoms/Text";
import { Button } from "@ui/atoms/Button";
import { ReflectionCard } from "@ui/molecules/ReflectionCard";

export interface ReflectionQuestion {
  id: string;
  question: string;
}

export interface AIReflectionViewProps {
  loading: boolean;
  questions: ReflectionQuestion[];
  answers: Record<string, string>;
  onAnswerChange: (questionId: string, answer: string) => void;
  onSave: () => void;
  onSkip: () => void;
  saving?: boolean;
  className?: string;
}

function AIReflectionView({
  loading,
  questions,
  answers,
  onAnswerChange,
  onSave,
  onSkip,
  saving,
  className,
}: AIReflectionViewProps) {
  if (loading) {
    return (
      <div className={cn("flex flex-col items-center justify-center gap-4 py-16", className)}>
        <svg
          className="animate-spin h-8 w-8 text-red-500"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        <Text color="secondary">Gerando reflexão...</Text>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-6 max-w-md mx-auto", className)}>
      <div className="flex flex-col gap-1">
        <Heading level={2} size="xl">
          Reflexão
        </Heading>
        <Text size="sm" color="secondary">
          Baseada no Código A.D.V. — responda se quiser, no seu tempo.
        </Text>
      </div>

      <div className="flex flex-col gap-4">
        {questions.map((q, index) => (
          <ReflectionCard
            key={q.id}
            question={q.question}
            answer={answers[q.id] || ""}
            onAnswerChange={(answer) => onAnswerChange(q.id, answer)}
            index={index}
          />
        ))}
      </div>

      <div className="flex gap-3 pt-2">
        <Button variant="ghost" onClick={onSkip} className="flex-1">
          Responder depois
        </Button>
        <Button variant="primary" onClick={onSave} loading={saving} className="flex-1">
          Salvar respostas
        </Button>
      </div>
    </div>
  );
}

export { AIReflectionView };
