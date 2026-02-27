'use client';

export const dynamic = 'force-dynamic';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useBriefingHistory, useMenteeProfile, useGenerateBriefing } from '@/hooks/use-dashboard';
import { Heading, Text, Button, Badge } from '@diario/ui';
import type { SessionBriefing } from '@/types/database';

export default function BriefingPage() {
  const params = useParams();
  const menteeId = params.menteeId as string;
  const { data: profile } = useMenteeProfile(menteeId);
  const { data: briefings, isLoading } = useBriefingHistory(menteeId);
  const generateBriefing = useGenerateBriefing();

  const latestBriefing: SessionBriefing | null = briefings?.[0] ?? null;

  if (isLoading) {
    return <div className="h-96 bg-neutral-900 rounded-lg animate-pulse" />;
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <Link href={`/dashboard/mentees/${menteeId}`} className="text-sm text-neutral-500 hover:text-white mb-2 block">
          ← {profile?.name || 'Mentorado'}
        </Link>
        <div className="flex items-center justify-between">
          <Heading level={1} size="xl">Briefing de Sessão</Heading>
          <Button
            variant="primary"
            onClick={() => generateBriefing.mutate(menteeId)}
            loading={generateBriefing.isPending}
          >
            Gerar novo briefing
          </Button>
        </div>
      </div>

      {latestBriefing ? (
        <div className="space-y-6 print:space-y-4">
          <Text color="muted" size="sm">
            Gerado em: {new Date(latestBriefing.generated_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </Text>

          <section className="p-4 bg-neutral-900 rounded-lg border border-neutral-800 print:bg-white print:text-black print:border-gray-300">
            <Heading level={2} size="base" className="mb-3 text-red-500 print:text-red-700">Resumo</Heading>
            <Text color="secondary" className="print:text-gray-700">{latestBriefing.summary}</Text>
          </section>

          {latestBriefing.patterns?.length > 0 && (
            <section className="p-4 bg-neutral-900 rounded-lg border border-neutral-800 print:bg-white print:text-black">
              <Heading level={2} size="base" className="mb-3 text-red-500">Padrões Emocionais</Heading>
              {latestBriefing.patterns.map((p, i) => (
                <div key={i} className="mb-3">
                  <Text size="sm" className="font-semibold">{p.description}</Text>
                  <Text size="xs" color="muted">Conexão A.D.V.: {p.adv_connection}</Text>
                </div>
              ))}
            </section>
          )}

          {latestBriefing.suggested_topics?.length > 0 && (
            <section className="p-4 bg-neutral-900 rounded-lg border border-neutral-800 print:bg-white print:text-black">
              <Heading level={2} size="base" className="mb-3 text-red-500">Sugestões de Temas</Heading>
              <ul className="space-y-2">
                {latestBriefing.suggested_topics.map((t, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Badge variant="default">{i + 1}</Badge>
                    <Text size="sm" color="secondary">{t}</Text>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {latestBriefing.suggested_questions?.length > 0 && (
            <section className="p-4 bg-neutral-900 rounded-lg border border-neutral-800 print:bg-white print:text-black">
              <Heading level={2} size="base" className="mb-3 text-red-500">Perguntas Sugeridas</Heading>
              <ul className="space-y-2">
                {latestBriefing.suggested_questions.map((q, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">→</span>
                    <Text size="sm" color="secondary">{q}</Text>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {latestBriefing.mentor_previous_notes && (
            <section className="p-4 bg-neutral-800/50 rounded-lg border border-neutral-800 print:bg-gray-100">
              <Heading level={2} size="base" className="mb-3">Notas Anteriores</Heading>
              <Text size="sm" color="muted">{latestBriefing.mentor_previous_notes}</Text>
            </section>
          )}

          <Button variant="secondary" onClick={() => window.print()} className="print:hidden">
            Imprimir briefing
          </Button>
        </div>
      ) : (
        <div className="text-center py-12">
          <Text color="secondary">Nenhum briefing gerado ainda para este mentorado.</Text>
          <Text color="muted" size="sm" className="mt-2">
            Clique em &quot;Gerar novo briefing&quot; para preparar sua sessão.
          </Text>
        </div>
      )}

      {/* Briefing History */}
      {briefings && briefings.length > 1 && (
        <section>
          <Heading level={2} size="base" className="mb-3">Histórico de Briefings</Heading>
          <div className="space-y-2">
            {briefings.slice(1).map((b: SessionBriefing) => (
              <div key={b.id} className="p-3 bg-neutral-900 rounded-lg border border-neutral-800">
                <Text size="sm" className="font-semibold">
                  {new Date(b.generated_at).toLocaleDateString('pt-BR')}
                </Text>
                <Text size="xs" color="muted" className="line-clamp-1">{b.summary}</Text>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
