"use client";

import * as React from "react";
import { cn } from "@ui/lib/utils";
import { Button } from "@ui/atoms/Button";
import { Heading } from "@ui/atoms/Heading";
import { Text } from "@ui/atoms/Text";
import { Textarea } from "@ui/atoms/Textarea";
import { CategoryChips, type Category } from "@ui/molecules/CategoryChips";
import { EmotionPicker, type Emotion } from "@ui/molecules/EmotionPicker";
import { IntensitySlider } from "@ui/molecules/IntensitySlider";
import { Chip } from "@ui/atoms/Chip";

type SelfPerception = "reactive" | "strategic" | "unsure";

export interface DailyEntryData {
  situation: string;
  category: Category | null;
  emotion: Emotion | null;
  intensity: number;
  reaction: string;
  selfPerception: SelfPerception | null;
}

export interface DailyEntryFormProps {
  onSubmit: (data: DailyEntryData) => void;
  className?: string;
}

const PERCEPTION_OPTIONS: { value: SelfPerception; label: string }[] = [
  { value: "reactive", label: "Reativa" },
  { value: "strategic", label: "Estratégica" },
  { value: "unsure", label: "Não sei" },
];

function DailyEntryForm({ onSubmit, className }: DailyEntryFormProps) {
  const [step, setStep] = React.useState(1);
  const [data, setData] = React.useState<DailyEntryData>({
    situation: "",
    category: null,
    emotion: null,
    intensity: 5,
    reaction: "",
    selfPerception: null,
  });

  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;

  const canAdvance = () => {
    switch (step) {
      case 1:
        return data.situation.trim().length > 0 && data.category !== null;
      case 2:
        return data.emotion !== null;
      case 3:
        return data.reaction.trim().length > 0 && data.selfPerception !== null;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      onSubmit(data);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      {/* Progress Bar */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between">
          <Text size="sm" color="muted">
            Passo {step} de {totalSteps}
          </Text>
        </div>
        <div className="h-1 bg-neutral-800 rounded-full overflow-hidden" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
          <div
            className="h-full bg-red-500 rounded-full transition-all duration-normal"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Step 1 */}
      {step === 1 ? (
        <div className="flex flex-col gap-6">
          <Heading level={2} size="xl">
            O que aconteceu hoje?
          </Heading>
          <Textarea
            placeholder="Descreva a situação de pressão, conflito ou decisão..."
            rows={5}
            value={data.situation}
            onChange={(e) => setData({ ...data, situation: e.target.value })}
            autoResize
          />
          <div className="flex flex-col gap-2">
            <Text size="sm" color="muted">
              Categoria
            </Text>
            <CategoryChips
              value={data.category}
              onChange={(category) => setData({ ...data, category })}
            />
          </div>
        </div>
      ) : null}

      {/* Step 2 */}
      {step === 2 ? (
        <div className="flex flex-col gap-6">
          <Heading level={2} size="xl">
            O que você sentiu?
          </Heading>
          <EmotionPicker
            value={data.emotion}
            onChange={(emotion) => setData({ ...data, emotion })}
          />
          <IntensitySlider
            value={data.intensity}
            onChange={(intensity) => setData({ ...data, intensity })}
          />
        </div>
      ) : null}

      {/* Step 3 */}
      {step === 3 ? (
        <div className="flex flex-col gap-6">
          <Heading level={2} size="xl">
            Como você reagiu?
          </Heading>
          <Textarea
            placeholder="Descreva sua reação à situação..."
            rows={5}
            value={data.reaction}
            onChange={(e) => setData({ ...data, reaction: e.target.value })}
            autoResize
          />
          <div className="flex flex-col gap-2">
            <Text size="sm" color="muted">
              Como você avalia sua reação?
            </Text>
            <div className="flex gap-2" role="radiogroup" aria-label="Autopercepção">
              {PERCEPTION_OPTIONS.map((option) => (
                <Chip
                  key={option.value}
                  selected={data.selfPerception === option.value}
                  onSelect={() => setData({ ...data, selfPerception: option.value })}
                >
                  {option.label}
                </Chip>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {/* Navigation */}
      <div className="flex gap-3 pt-2">
        {step > 1 ? (
          <Button variant="ghost" onClick={handleBack} className="flex-1">
            Voltar
          </Button>
        ) : null}
        <Button
          variant="primary"
          onClick={handleNext}
          disabled={!canAdvance()}
          className="flex-1"
        >
          {step === totalSteps ? "Finalizar" : "Próximo"}
        </Button>
      </div>
    </div>
  );
}

export { DailyEntryForm };
