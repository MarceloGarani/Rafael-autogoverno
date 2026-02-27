'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { useProgress } from '@/hooks/use-progress';
import { Heading, Text, Chip, StreakCounter, Badge } from '@diario/ui';
import { CATEGORY_LABELS, BADGE_LABELS, getIntensityColor } from '@/lib/utils/constants';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
  BarChart, Bar, CartesianGrid, Legend,
} from 'recharts';

const CHART_COLORS = ['#E53935', '#FFC107', '#4CAF50', '#2196F3', '#9C27B0', '#FF9800', '#607D8B'];

export default function ProgressPage() {
  const [period, setPeriod] = useState<'month' | '3months' | 'all'>('month');
  const { data, isLoading } = useProgress(period);

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto py-6 space-y-6">
        <Heading level={1} size="xl">Minha Evolução</Heading>
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-64 bg-neutral-900 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-6 space-y-8">
      <div className="flex items-center justify-between">
        <Heading level={1} size="xl">Minha Evolução</Heading>
        <div className="flex gap-2">
          <Chip selected={period === 'month'} onSelect={() => setPeriod('month')}>Mês</Chip>
          <Chip selected={period === '3months'} onSelect={() => setPeriod('3months')}>3 Meses</Chip>
          <Chip selected={period === 'all'} onSelect={() => setPeriod('all')}>Tudo</Chip>
        </div>
      </div>

      {/* Streak & Stats */}
      <div className="flex items-center gap-6 p-4 bg-neutral-900 rounded-lg border border-neutral-800">
        <StreakCounter count={data?.streak ?? 0} />
        <div className="border-l border-neutral-800 pl-6">
          <Text size="sm" color="muted">Maior streak</Text>
          <Text className="font-bold">{data?.max_streak ?? 0} dias</Text>
        </div>
        <div className="border-l border-neutral-800 pl-6">
          <Text size="sm" color="muted">Total registros</Text>
          <Text className="font-bold">{data?.total_entries ?? 0}</Text>
        </div>
      </div>

      {/* Intensity Chart */}
      <div className="p-4 bg-neutral-900 rounded-lg border border-neutral-800">
        <Heading level={3} size="base" className="mb-4">Intensidade Média por Semana</Heading>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data?.intensity_by_week ?? []}>
            <CartesianGrid strokeDasharray="3 3" stroke="#424242" />
            <XAxis dataKey="week" tick={{ fill: '#9E9E9E', fontSize: 12 }} />
            <YAxis domain={[0, 10]} tick={{ fill: '#9E9E9E', fontSize: 12 }} />
            <Tooltip
              contentStyle={{ backgroundColor: '#212121', border: '1px solid #424242', borderRadius: 8 }}
              labelStyle={{ color: '#fff' }}
            />
            <Line type="monotone" dataKey="avg_intensity" stroke="#E53935" strokeWidth={2} dot={{ fill: '#E53935' }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Category Distribution */}
      <div className="p-4 bg-neutral-900 rounded-lg border border-neutral-800">
        <Heading level={3} size="base" className="mb-4">Categorias mais frequentes</Heading>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={(data?.category_distribution ?? []).map((c: any) => ({
                ...c,
                name: CATEGORY_LABELS[c.category as keyof typeof CATEGORY_LABELS] || c.category,
              }))}
              cx="50%" cy="50%"
              outerRadius={80}
              dataKey="count"
              nameKey="name"
              label={({ name, percentage }) => `${name} ${percentage}%`}
            >
              {(data?.category_distribution ?? []).map((_: any, i: number) => (
                <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ backgroundColor: '#212121', border: '1px solid #424242', borderRadius: 8 }} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Reactive vs Strategic */}
      <div className="p-4 bg-neutral-900 rounded-lg border border-neutral-800">
        <Heading level={3} size="base" className="mb-4">Reativo vs Estratégico</Heading>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data?.reactive_vs_strategic ?? []}>
            <CartesianGrid strokeDasharray="3 3" stroke="#424242" />
            <XAxis dataKey="month" tick={{ fill: '#9E9E9E', fontSize: 12 }} />
            <YAxis tick={{ fill: '#9E9E9E', fontSize: 12 }} />
            <Tooltip contentStyle={{ backgroundColor: '#212121', border: '1px solid #424242', borderRadius: 8 }} />
            <Legend />
            <Bar dataKey="reactive_pct" name="Reativo %" fill="#E53935" stackId="a" />
            <Bar dataKey="strategic_pct" name="Estratégico %" fill="#4CAF50" stackId="a" />
            <Bar dataKey="unsure_pct" name="Não sei %" fill="#FFC107" stackId="a" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Badges */}
      <div className="p-4 bg-neutral-900 rounded-lg border border-neutral-800">
        <Heading level={3} size="base" className="mb-4">Badges Conquistados</Heading>
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(BADGE_LABELS).map(([key, { name, description }]) => {
            const earned = data?.badges?.find((b: any) => b.badge_type === key);
            return (
              <div
                key={key}
                className={`p-3 rounded-lg border ${
                  earned ? 'bg-red-500/10 border-red-500/30' : 'bg-neutral-800/50 border-neutral-800 opacity-50'
                }`}
              >
                <Text className="font-semibold" size="sm">{name}</Text>
                <Text color="muted" size="xs">{description}</Text>
                {earned && (
                  <Badge variant="success" size="sm" className="mt-1">Conquistado</Badge>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
