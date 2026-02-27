import * as React from "react";
import { cn } from "@ui/lib/utils";
import { Label } from "@ui/atoms/Label";
import { Slider } from "@ui/atoms/Slider";
import { Badge } from "@ui/atoms/Badge";

export interface IntensitySliderProps {
  value: number;
  onChange: (value: number) => void;
  className?: string;
}

function getIntensityVariant(value: number): "success" | "warning" | "danger" {
  if (value <= 3) return "success";
  if (value <= 6) return "warning";
  return "danger";
}

function IntensitySlider({ value, onChange, className }: IntensitySliderProps) {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="flex items-center justify-between">
        <Label>Intensidade</Label>
        <Badge variant={getIntensityVariant(value)} size="md">
          {value}
        </Badge>
      </div>
      <Slider
        value={value}
        min={1}
        max={10}
        onChange={onChange}
        showGradient
        aria-label="Intensidade da emoção"
      />
      <div className="flex justify-between">
        <span className="text-xs text-green-500">Baixa</span>
        <span className="text-xs text-yellow-500">Média</span>
        <span className="text-xs text-red-500">Alta</span>
      </div>
    </div>
  );
}

export { IntensitySlider };
