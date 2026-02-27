import * as React from "react";
import { cn } from "@ui/lib/utils";

export interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "onChange"> {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
  showGradient?: boolean;
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ className, value, min = 1, max = 10, onChange, showGradient = true, ...props }, ref) => {
    const percentage = ((value - min) / (max - min)) * 100;

    const gradientStyle = showGradient
      ? {
          background: `linear-gradient(to right, #4CAF50 0%, #FFC107 50%, #E53935 100%)`,
          backgroundSize: "100% 100%",
        }
      : undefined;

    return (
      <div className={cn("relative w-full", className)}>
        <div className="relative h-2 rounded-full bg-neutral-800 overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 rounded-full"
            style={{
              width: `${percentage}%`,
              ...(showGradient
                ? { background: `linear-gradient(to right, #4CAF50, #FFC107, #E53935)` }
                : { backgroundColor: "#E53935" }),
            }}
          />
        </div>
        <input
          ref={ref}
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full h-2 opacity-0 cursor-pointer"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          {...props}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 h-5 w-5 rounded-full bg-white border-2 border-neutral-800 shadow-md pointer-events-none"
          style={{ left: `calc(${percentage}% - 10px)` }}
        />
      </div>
    );
  }
);
Slider.displayName = "Slider";

export { Slider };
