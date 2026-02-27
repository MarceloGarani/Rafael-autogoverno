"use client";

import * as React from "react";
import { cn } from "@ui/lib/utils";
import { Chip } from "@ui/atoms/Chip";
import { Icon } from "@ui/atoms/Icon";
import { Badge } from "@ui/atoms/Badge";
import { Text } from "@ui/atoms/Text";

export interface EntryCardData {
  id: string;
  date: string;
  category: string;
  emotion: string;
  intensity: number;
  situation: string;
  reaction: string;
  selfPerception: "reactive" | "strategic" | "unsure";
  aiReflectionSummary?: string;
}

export interface EntryCardProps {
  entry: EntryCardData;
  className?: string;
}

function getIntensityVariant(intensity: number): "success" | "warning" | "danger" {
  if (intensity <= 3) return "success";
  if (intensity <= 6) return "warning";
  return "danger";
}

function EntryCard({ entry, className }: EntryCardProps) {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <div
      className={cn(
        "bg-neutral-900 border border-neutral-800 rounded-lg transition-colors duration-normal",
        className
      )}
    >
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 p-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-lg"
        aria-expanded={expanded}
      >
        <Text size="sm" color="muted" as="span" className="shrink-0 w-16">
          {entry.date}
        </Text>
        <Chip state="default" className="pointer-events-none text-xs px-2 py-0.5">
          {entry.category}
        </Chip>
        <Text size="sm" color="secondary" as="span" className="flex-1 truncate">
          {entry.emotion}
        </Text>
        <Badge variant={getIntensityVariant(entry.intensity)} size="sm">
          {entry.intensity}
        </Badge>
        <Icon
          name={expanded ? "ChevronUp" : "ChevronDown"}
          size="sm"
          className="text-neutral-600"
        />
      </button>

      {expanded ? (
        <div className="px-4 pb-4 flex flex-col gap-3 border-t border-neutral-800 pt-3">
          <div>
            <Text size="xs" color="muted" variant="overline" as="span">
              Situação
            </Text>
            <Text size="sm" color="primary">
              {entry.situation}
            </Text>
          </div>
          <div>
            <Text size="xs" color="muted" variant="overline" as="span">
              Reação
            </Text>
            <Text size="sm" color="primary">
              {entry.reaction}
            </Text>
          </div>
          <div className="flex items-center gap-2">
            <Text size="xs" color="muted" variant="overline" as="span">
              Autopercepção:
            </Text>
            <Chip state="default" className="pointer-events-none text-xs px-2 py-0.5">
              {entry.selfPerception === "reactive"
                ? "Reativa"
                : entry.selfPerception === "strategic"
                  ? "Estratégica"
                  : "Não sei"}
            </Chip>
          </div>
          {entry.aiReflectionSummary ? (
            <div className="bg-neutral-800/50 rounded-md p-3">
              <Text size="xs" color="muted" variant="overline" as="span">
                Reflexão IA
              </Text>
              <Text size="sm" color="secondary">
                {entry.aiReflectionSummary}
              </Text>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export { EntryCard };
