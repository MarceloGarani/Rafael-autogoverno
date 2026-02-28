'use client';

export const dynamic = 'force-dynamic';

import { useRouter } from 'next/navigation';
import { DailyEntryForm } from '@diario/ui';
import type { DailyEntryData } from '@diario/ui';
import { useCreateEntry } from '@/hooks/use-entries';
import { Heading, Text } from '@diario/ui';

export default function NewEntryPage() {
  const router = useRouter();
  const createEntry = useCreateEntry();

  const handleSubmit = async (data: DailyEntryData) => {
    if (!data.category || !data.emotion || !data.selfPerception) return;

    // Map UI types to DB types
    const categoryMap: Record<string, string> = {
      'Audiência': 'audiencia',
      'Negociação': 'negociacao',
      'Cliente': 'cliente',
      'Cobrança': 'cobranca',
      'Equipe': 'equipe',
      'Decisão': 'decisao',
      'Outro': 'outro',
    };

    try {
      const result = await createEntry.mutateAsync({
        date: new Date().toISOString().split('T')[0],
        situation: data.situation,
        category: categoryMap[data.category] || 'outro',
        emotion: data.emotion,
        intensity: data.intensity,
        reaction: data.reaction,
        self_perception: data.selfPerception,
      });

      // Redirect to reflection page
      router.push(`/reflection/${result.id}`);
    } catch {
      // Error handled by mutation
    }
  };

  return (
    <div className="max-w-md mx-auto py-6">
      <div className="mb-6">
        <Heading level={1} size="xl">Novo Registro</Heading>
        <Text color="secondary" size="sm">Registre como foi o seu dia em menos de 5 minutos.</Text>
      </div>

      {createEntry.error && (
        <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
          <Text color="accent" size="sm">
            {createEntry.error.message || 'Erro ao salvar. Tente novamente.'}
          </Text>
        </div>
      )}

      <DailyEntryForm onSubmit={handleSubmit} />
    </div>
  );
}
