'use client';

import { useAuth } from '@/hooks/use-auth';
import { Text } from '@diario/ui';

export function Header() {
  const { profile, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-10 bg-black/80 backdrop-blur border-b border-neutral-800">
      <div className="flex items-center justify-between h-14 px-4 max-w-screen-xl mx-auto">
        <Text size="lg" className="font-semibold">Autogoverno</Text>
        <div className="flex items-center gap-3">
          {profile && (
            <>
              <Text size="sm" color="secondary">{profile.name}</Text>
              <button
                onClick={signOut}
                className="text-xs text-neutral-600 hover:text-white transition-colors"
              >
                Sair
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
