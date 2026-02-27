"use client";

import * as React from "react";
import { cn } from "@ui/lib/utils";
import { Heading } from "@ui/atoms/Heading";
import { Text } from "@ui/atoms/Text";
import { Button } from "@ui/atoms/Button";
import { StreakCounter } from "@ui/molecules/StreakCounter";

export interface WeeklyDay {
  day: string;
  intensity: number | null;
}

export interface MenteeHomeProps {
  userName: string;
  streak: number;
  weeklyData: WeeklyDay[];
  onStartEntry: () => void;
  className?: string;
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
}

function getIntensityColor(intensity: number | null): string {
  if (intensity === null) return "bg-neutral-800";
  if (intensity <= 3) return "bg-green-500";
  if (intensity <= 6) return "bg-yellow-500";
  return "bg-red-500";
}

function MenteeHome({ userName, streak, weeklyData, onStartEntry, className }: MenteeHomeProps) {
  return (
    <div className={cn("flex flex-col gap-8 px-4 py-6 max-w-md mx-auto", className)}>
      {/* Greeting */}
      <div className="flex flex-col gap-1">
        <Heading level={1} size="2xl">
          {getGreeting()}, {userName}
        </Heading>
        <Text color="secondary">
          Como foi o seu dia hoje?
        </Text>
      </div>

      {/* Streak */}
      <StreakCounter count={streak} />

      {/* CTA */}
      <Button variant="primary" size="lg" onClick={onStartEntry} className="w-full">
        Registrar o dia
      </Button>

      {/* Weekly Mini Summary */}
      <div className="flex flex-col gap-3">
        <Text size="sm" color="muted">
          Sua semana
        </Text>
        <div className="flex gap-2 justify-between">
          {weeklyData.map((day) => (
            <div key={day.day} className="flex flex-col items-center gap-1.5">
              <div className="h-12 w-6 bg-neutral-800 rounded-sm overflow-hidden flex flex-col justify-end">
                {day.intensity !== null ? (
                  <div
                    className={cn("w-full rounded-sm transition-all", getIntensityColor(day.intensity))}
                    style={{ height: `${(day.intensity / 10) * 100}%` }}
                  />
                ) : null}
              </div>
              <Text size="xs" color="muted" as="span">
                {day.day}
              </Text>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export { MenteeHome };
