'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { useGroupInsights } from '@/hooks/use-dashboard';
import { Heading, Text, Chip, SummaryCard } from '@diario/ui';
import { EMOTION_LABELS, CATEGORY_LABELS } from '@/lib/utils/constants';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell,
} from 'recharts';

const COLORS = ['#E53935', '#FFC107', '#4CAF50', '#2196F3', '#9C27B0'];

export default function InsightsPage() {
  const [period, setPeriod] = useState<'week' | 'month'>('week');
  const { data, isLoading } = useGroupInsights(period);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Heading level={1} size="xl">Insights do Grupo</Heading>
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-48 bg-neutral-900 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Heading level={1} size="xl">Insights do Grupo</Heading>
        <div className="flex gap-2">
          <Chip selected={period === 'week'} onSelect={() => setPeriod('week')}>Última Semana</Chip>
          <Chip selected={period === 'month'} onSelect={() => setPeriod('month')}>Último Mês</Chip>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SummaryCard
          label="Intensidade Média"
          value={data?.avg_intensity_current?.toFixed(1) ?? '0'}
          trend={data?.avg_intensity_current < data?.avg_intensity_previous ? 'down' : 'up'}
          trendValue={`${data?.avg_intensity_previous?.toFixed(1) ?? 0} anterior`}
        />
        <SummaryCard
          label="Total de Registros"
          value={data?.total_entries ?? 0}
        />
        <SummaryCard
          label="Estratégico"
          value={`${data?.reactive_vs_strategic?.strategic ?? 0}%`}
          trend={data?.reactive_vs_strategic?.strategic > 50 ? 'up' : 'down'}
          trendValue={`Reativo: ${data?.reactive_vs_strategic?.reactive ?? 0}%`}
        />
      </div>

      {/* Top Emotions */}
      <div className="p-4 bg-neutral-900 rounded-lg border border-neutral-800">
        <Heading level={3} size="base" className="mb-4">Top 3 Emoções</Heading>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart
            data={(data?.top_emotions ?? []).map((e: any) => ({
              ...e,
              name: EMOTION_LABELS[e.emotion as keyof typeof EMOTION_LABELS] || e.emotion,
            }))}
            layout="vertical"
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#424242" />
            <XAxis type="number" tick={{ fill: '#9E9E9E', fontSize: 12 }} />
            <YAxis dataKey="name" type="category" width={100} tick={{ fill: '#9E9E9E', fontSize: 12 }} />
            <Tooltip contentStyle={{ backgroundColor: '#212121', border: '1px solid #424242', borderRadius: 8 }} />
            <Bar dataKey="count" fill="#E53935" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Top Category */}
      {data?.top_category && (
        <div className="p-4 bg-neutral-900 rounded-lg border border-neutral-800">
          <Heading level={3} size="base" className="mb-2">Categoria Mais Desafiadora</Heading>
          <Text className="text-2xl font-bold text-red-500">
            {CATEGORY_LABELS[data.top_category.category as keyof typeof CATEGORY_LABELS] || data.top_category.category}
          </Text>
          <Text color="muted" size="sm">
            {data.top_category.percentage}% dos registros ({data.top_category.count} ocorrências)
          </Text>
        </div>
      )}

      {/* Reactive vs Strategic */}
      <div className="p-4 bg-neutral-900 rounded-lg border border-neutral-800">
        <Heading level={3} size="base" className="mb-4">Reativo vs Estratégico do Grupo</Heading>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={[
                { name: 'Reativo', value: data?.reactive_vs_strategic?.reactive ?? 0 },
                { name: 'Estratégico', value: data?.reactive_vs_strategic?.strategic ?? 0 },
                { name: 'Não sei', value: data?.reactive_vs_strategic?.unsure ?? 0 },
              ]}
              cx="50%" cy="50%" outerRadius={70} dataKey="value"
              label={({ name, value }) => `${name}: ${value}%`}
            >
              <Cell fill="#E53935" />
              <Cell fill="#4CAF50" />
              <Cell fill="#FFC107" />
            </Pie>
            <Tooltip contentStyle={{ backgroundColor: '#212121', border: '1px solid #424242', borderRadius: 8 }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
