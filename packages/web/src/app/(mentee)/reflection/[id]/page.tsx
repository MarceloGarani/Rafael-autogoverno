'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { AIReflectionView } from '@diario/ui';
import type { ReflectionQuestion } from '@diario/ui';
import { useStreak } from '@/hooks/use-streak';
import { Heading, Text, Button, StreakCounter } from '@diario/ui';

export default function ReflectionPage() {
  const params = useParams();
  const router = useRouter();
  const entryId = params.id as string;
  const { data: streak } = useStreak();

  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<ReflectionQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [reflectionId, setReflectionId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const generateReflection = async () => {
      try {
        const res = await fetch('/api/reflections', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ entry_id: entryId }),
        });

        if (!res.ok) throw new Error();

        const data = await res.json();
        setReflectionId(data.id);
        setQuestions(
          data.questions.map((q: string, i: number) => ({
            id: String(i),
            question: q,
          }))
        );
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    generateReflection();
  }, [entryId]);

  const handleSave = async () => {
    if (!reflectionId) {
      setCompleted(true);
      return;
    }

    setSaving(true);
    try {
      const answersArray = questions.map((q) => answers[q.id] || null);
      await fetch(`/api/reflections/${reflectionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: answersArray }),
      });
    } catch {
      // Continue to confirmation even on save error
    }
    setSaving(false);
    setCompleted(true);
  };

  if (completed) {
    return (
      <div className="max-w-md mx-auto py-12 text-center space-y-6">
        <div className="w-16 h-16 mx-auto rounded-full bg-green-500/10 border-2 border-green-500 flex items-center justify-center">
          <span className="text-green-500 text-2xl">✓</span>
        </div>
        <Heading level={1} size="xl">Registro salvo.</Heading>
        <Text color="secondary">Mais um dia de autogoverno.</Text>
        {streak && <StreakCounter count={streak.current_streak} />}
        <Button
          variant="primary"
          size="lg"
          className="w-full"
          onClick={() => router.push('/')}
        >
          Voltar ao início
        </Button>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto py-12 text-center space-y-6">
        <Text color="secondary">
          Não foi possível gerar reflexões agora, mas seu registro foi salvo.
        </Text>
        <Button
          variant="primary"
          size="lg"
          className="w-full"
          onClick={() => setCompleted(true)}
        >
          Continuar
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto py-6">
      <AIReflectionView
        loading={loading}
        questions={questions}
        answers={answers}
        onAnswerChange={(qId, answer) =>
          setAnswers((prev) => ({ ...prev, [qId]: answer }))
        }
        onSave={handleSave}
        onSkip={() => setCompleted(true)}
        saving={saving}
      />
    </div>
  );
}
