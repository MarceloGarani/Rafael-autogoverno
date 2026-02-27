'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Heading, Text, Button } from '@diario/ui';
import { createClient } from '@/lib/supabase/client';

export default function SettingsPage() {
  const { profile, signOut } = useAuth();
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setReminderEnabled(profile.reminder_enabled ?? true);
    }
  }, [profile]);

  const toggleReminder = async () => {
    setSaving(true);
    const supabase = createClient();
    const newValue = !reminderEnabled;
    await supabase
      .from('users')
      .update({ reminder_enabled: newValue })
      .eq('id', profile?.id);
    setReminderEnabled(newValue);
    setSaving(false);
  };

  return (
    <div className="max-w-md mx-auto py-6 space-y-8">
      <Heading level={1} size="xl">Configurações</Heading>

      <section className="p-4 bg-neutral-900 rounded-lg border border-neutral-800 space-y-4">
        <div>
          <Text className="font-semibold">Perfil</Text>
          <Text color="secondary" size="sm">{profile?.name}</Text>
          <Text color="muted" size="sm">{profile?.email}</Text>
        </div>
      </section>

      <section className="p-4 bg-neutral-900 rounded-lg border border-neutral-800">
        <div className="flex items-center justify-between">
          <div>
            <Text className="font-semibold">Lembrete diário</Text>
            <Text color="muted" size="sm">Receber email às 20h se não registrou</Text>
          </div>
          <button
            onClick={toggleReminder}
            disabled={saving}
            className={`relative w-12 h-6 rounded-full transition-colors ${
              reminderEnabled ? 'bg-red-500' : 'bg-neutral-700'
            }`}
          >
            <span
              className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                reminderEnabled ? 'left-7' : 'left-1'
              }`}
            />
          </button>
        </div>
      </section>

      <Button variant="secondary" className="w-full" onClick={signOut}>
        Sair da conta
      </Button>
    </div>
  );
}
