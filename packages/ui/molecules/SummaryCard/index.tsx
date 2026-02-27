import * as React from "react";
import { cn } from "@ui/lib/utils";
import { Heading } from "@ui/atoms/Heading";
import { Text } from "@ui/atoms/Text";
import { Icon } from "@ui/atoms/Icon";

export interface SummaryCardProps {
  label: string;
  value: string | number;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  className?: string;
}

function SummaryCard({ label, value, trend, trendValue, className }: SummaryCardProps) {
  return (
    <div
      className={cn(
        "bg-neutral-900 border border-neutral-800 rounded-lg p-6 flex flex-col gap-2",
        className
      )}
    >
      <Text size="sm" color="muted">
        {label}
      </Text>
      <Heading level={3} size="3xl">
        {value}
      </Heading>
      {trend && trendValue ? (
        <div className="flex items-center gap-1">
          <Icon
            name={trend === "up" ? "TrendingUp" : trend === "down" ? "TrendingDown" : "Minus"}
            size="sm"
            className={cn(
              trend === "up" && "text-green-500",
              trend === "down" && "text-red-500",
              trend === "neutral" && "text-neutral-500"
            )}
          />
          <Text size="xs" color="secondary" as="span">
            {trendValue}
          </Text>
        </div>
      ) : null}
    </div>
  );
}

export { SummaryCard };
