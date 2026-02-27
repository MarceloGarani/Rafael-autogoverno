import * as React from "react";
import { cn } from "@ui/lib/utils";
import { Icon } from "@ui/atoms/Icon";
import { Text } from "@ui/atoms/Text";

export interface StreakCounterProps {
  count: number;
  className?: string;
}

function StreakCounter({ count, className }: StreakCounterProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Icon name="Flame" size="lg" className="text-yellow-500" />
      <div className="flex items-baseline gap-1">
        <Text as="span" size="lg" className="font-bold text-white">
          {count}
        </Text>
        <Text as="span" size="sm" color="secondary">
          {count === 1 ? "dia" : "dias"}
        </Text>
      </div>
    </div>
  );
}

export { StreakCounter };
