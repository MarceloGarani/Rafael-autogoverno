'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  useMenteeProfile,
  useMenteeEntries,
  useMenteePatterns,
  useMentorNote,
  useUpdateMentorNote,
  useGenerateBriefing,
  useBriefingHistory,
} from '@/hooks/use-dashboard';
import { useProgress } from '@/hooks/use-progress';
import { Heading, Text, Button, Chip, Textarea, EntryCard, Badge, StreakCounter } from '@diario/ui';
import { CATEGORY_LABELS, EMOTION_LABELS } from '@/lib/utils/constants';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
  BarChart, Bar, CartesianGrid, Legend,
} from 'recharts';

type Tab = 'records' | 'evolution' | 'reports' | 'patterns';
const CHART_COLORS = ['#E53935', '#FFC107', '#4CAF50', '#2196F3', '#9C27B0', '#FF9800', '#607D8B'];

export default function MenteeProfilePage() {
  const params = useParams();
  const menteeId = params.id as string;
  const [activeTab, setActiveTab] = useState<Tab>('records');
  const [noteContent, setNoteContent] = useState('');

  const { data: profile, isLoading: profileLoading } = useMenteeProfile(menteeId);
  const { data: entriesData } = useMenteeEntries(menteeId);
  const { data: patterns } = useMenteePatterns(menteeId);
  const { data: mentorNote } = useMentorNote(menteeId);
  const updateNote = useUpdateMentorNote();
  const generateBriefing = useGenerateBriefing();
  const { data: briefings } = useBriefingHistory(menteeId);

  useEffect(() => {
    if (mentorNote?.content !== undefined) {
      setNoteContent(mentorNote.content);
    }
  }, [mentorNote]);

  // Debounced autosave
  useEffect(() => {
    if (noteContent === mentorNote?.content) return;
    const timeout = setTimeout(() => {
      updateNote.mutate({ menteeId, content: noteContent });
    }, 500);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [noteContent, menteeId]);

  // Fetch progress data for this mentee
  const { data: progressData } = useProgress('month');

  if (profileLoading) {
    return <div className="h-96 bg-neutral-900 rounded-lg animate-pulse" />;
  }

  if (!profile) {
    return <Text color="secondary">Mentorado não encontrado.</Text>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link href="/dashboard/mentees" className="text-sm text-neutral-500 hover:text-white mb-2 block">
          ← Mentorados
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <Heading level={1} size="xl">{profile.name}</Heading>
            <Text color="muted" size="sm">
              Desde: {new Date(profile.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
              {' · '}<StreakCounter count={profile.streak} />
              {' · '}{profile.total_entries} registros
            </Text>
          </div>
          <Button
            variant="primary"
            onClick={() => generateBriefing.mutate(menteeId)}
            loading={generateBriefing.isPending}
          >
            Gerar briefing de sessão
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-neutral-800 pb-2">
        {(['records', 'evolution', 'reports', 'patterns'] as Tab[]).map((tab) => (
          <Chip key={tab} selected={activeTab === tab} onSelect={() => setActiveTab(tab)}>
            {tab === 'records' ? 'Registros' : tab === 'evolution' ? 'Evolução' : tab === 'reports' ? 'Relatórios' : 'Padrões IA'}
          </Chip>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'records' && (
        <div className="space-y-3">
          {(entriesData?.entries ?? []).map((entry: any) => (
            <EntryCard
              key={entry.id}
              entry={{
                id: entry.id,
                date: new Date(entry.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }),
                category: CATEGORY_LABELS[entry.category as keyof typeof CATEGORY_LABELS] || entry.category,
                emotion: EMOTION_LABELS[entry.emotion as keyof typeof EMOTION_LABELS] || entry.emotion,
                intensity: entry.intensity,
                situation: entry.situation,
                reaction: entry.reaction,
                selfPerception: entry.self_perception,
                aiReflectionSummary: entry.ai_reflections?.questions?.[0],
              }}
            />
          ))}
          {(!entriesData?.entries || entriesData.entries.length === 0) && (
            <Text color="secondary">Nenhum registro encontrado.</Text>
          )}
        </div>
      )}

      {activeTab === 'evolution' && (
        <div className="space-y-6">
          <div className="p-4 bg-neutral-900 rounded-lg border border-neutral-800">
            <Heading level={3} size="base" className="mb-4">Intensidade por Semana</Heading>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={progressData?.intensity_by_week ?? []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#424242" />
                <XAxis dataKey="week" tick={{ fill: '#9E9E9E', fontSize: 12 }} />
                <YAxis domain={[0, 10]} tick={{ fill: '#9E9E9E', fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: '#212121', border: '1px solid #424242', borderRadius: 8 }} />
                <Line type="monotone" dataKey="avg_intensity" stroke="#E53935" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="p-4 bg-neutral-900 rounded-lg border border-neutral-800">
            <Heading level={3} size="base" className="mb-4">Categorias</Heading>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={(progressData?.category_distribution ?? []).map((c: any) => ({
                    ...c,
                    name: CATEGORY_LABELS[c.category as keyof typeof CATEGORY_LABELS] || c.category,
                  }))}
                  cx="50%" cy="50%" outerRadius={80} dataKey="count" nameKey="name"
                  label={({ name, percentage }) => `${name} ${percentage}%`}
                >
                  {(progressData?.category_distribution ?? []).map((_: any, i: number) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#212121', border: '1px solid #424242', borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {activeTab === 'reports' && (
        <div className="space-y-3">
          {briefings?.map((b: any) => (
            <Link
              key={b.id}
              href={`/dashboard/briefing/${menteeId}`}
              className="block p-4 bg-neutral-900 rounded-lg border border-neutral-800 hover:border-neutral-700"
            >
              <Text className="font-semibold">
                Briefing — {new Date(b.generated_at).toLocaleDateString('pt-BR')}
              </Text>
              <Text color="secondary" size="sm" className="mt-1 line-clamp-2">{b.summary}</Text>
            </Link>
          ))}
          {(!briefings || briefings.length === 0) && (
            <Text color="secondary">Nenhum briefing gerado ainda.</Text>
          )}
        </div>
      )}

      {activeTab === 'patterns' && (
        <div className="space-y-3">
          {patterns?.patterns?.map((p: any, i: number) => (
            <div key={i} className="p-4 bg-neutral-900 rounded-lg border border-neutral-800">
              <div className="flex items-start gap-2">
                <Badge variant={p.severity === 'critical' ? 'danger' : p.severity === 'attention' ? 'warning' : 'success'}>
                  {p.severity === 'critical' ? 'Crítico' : p.severity === 'attention' ? 'Atenção' : 'Positivo'}
                </Badge>
                <Text size="sm">{p.description}</Text>
              </div>
              {p.adv_pillar && (
                <Text size="xs" color="muted" className="mt-2">Pilar A.D.V.: {p.adv_pillar}</Text>
              )}
            </div>
          ))}
          {(!patterns?.patterns || patterns.patterns.length === 0) && (
            <Text color="secondary">Sem padrões identificados ainda. Continue acompanhando.</Text>
          )}
        </div>
      )}

      {/* Mentor Notepad */}
      <div className="p-4 bg-neutral-900 rounded-lg border border-neutral-800">
        <div className="flex items-center justify-between mb-3">
          <Heading level={3} size="base">Notas do Mentor</Heading>
          {updateNote.isPending && <Text size="xs" color="muted">Salvando...</Text>}
          {!updateNote.isPending && noteContent !== (mentorNote?.content ?? '') && (
            <Text size="xs" color="muted">Salvo</Text>
          )}
        </div>
        <Textarea
          placeholder="Suas observações sobre este mentorado..."
          value={noteContent}
          onChange={(e) => setNoteContent(e.target.value)}
          rows={5}
        />
      </div>
    </div>
  );
}
