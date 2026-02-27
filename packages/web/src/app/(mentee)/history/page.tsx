'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { useEntries } from '@/hooks/use-entries';
import { EntryCard, Heading, Text, Button, Chip } from '@diario/ui';
import type { EntryCategory, EntryEmotion } from '@/types/database';
import { CATEGORY_LABELS, EMOTION_LABELS, SELF_PERCEPTION_LABELS } from '@/lib/utils/constants';
import Link from 'next/link';

type Period = 'week' | 'month' | undefined;

export default function HistoryPage() {
  const [period, setPeriod] = useState<Period>(undefined);
  const [category, setCategory] = useState<EntryCategory | undefined>();
  const [emotion, setEmotion] = useState<EntryEmotion | undefined>();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useEntries({
    period,
    category,
    emotion,
  });

  const entries = data?.pages.flatMap((p) => p.entries) ?? [];

  return (
    <div className="max-w-2xl mx-auto py-6">
      <Heading level={1} size="xl" className="mb-6">Meu Histórico</Heading>

      {/* Filters */}
      <div className="space-y-3 mb-6">
        <div className="flex flex-wrap gap-2">
          <Chip selected={!period} onSelect={() => setPeriod(undefined)}>Todos</Chip>
          <Chip selected={period === 'week'} onSelect={() => setPeriod('week')}>Semana</Chip>
          <Chip selected={period === 'month'} onSelect={() => setPeriod('month')}>Mês</Chip>
        </div>
        <div className="flex flex-wrap gap-2">
          <Chip selected={!category} onSelect={() => setCategory(undefined)}>
            Todas categorias
          </Chip>
          {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
            <Chip
              key={key}
              selected={category === key}
              onSelect={() => setCategory(category === key ? undefined : key as EntryCategory)}
            >
              {label}
            </Chip>
          ))}
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-neutral-900 rounded-lg animate-pulse" />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && entries.length === 0 && (
        <div className="text-center py-12 space-y-4">
          <Text color="secondary">Nenhum registro encontrado.</Text>
          <Link href="/entry/new">
            <Button variant="primary">Fazer meu primeiro registro</Button>
          </Link>
        </div>
      )}

      {/* Entries */}
      <div className="space-y-3">
        {entries.map((entry: any) => (
          <EntryCard
            key={entry.id}
            entry={{
              id: entry.id,
              date: new Date(entry.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }),
              category: CATEGORY_LABELS[entry.category as EntryCategory] || entry.category,
              emotion: EMOTION_LABELS[entry.emotion as EntryEmotion] || entry.emotion,
              intensity: entry.intensity,
              situation: entry.situation,
              reaction: entry.reaction,
              selfPerception: entry.self_perception,
              aiReflectionSummary: entry.ai_reflections?.questions?.[0],
            }}
          />
        ))}
      </div>

      {/* Load more */}
      {hasNextPage && (
        <div className="mt-6 text-center">
          <Button
            variant="secondary"
            onClick={() => fetchNextPage()}
            loading={isFetchingNextPage}
          >
            Carregar mais
          </Button>
        </div>
      )}
    </div>
  );
}
