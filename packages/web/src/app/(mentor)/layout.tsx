'use client';

import { useAuth } from '@/hooks/use-auth';
import { SidebarNav } from '@/components/layout/SidebarNav';

export default function MentorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profile, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-black">
      <SidebarNav userName={profile?.name || 'Rafael'} />
      <main className="ml-60 min-h-screen">
        <header className="sticky top-0 z-10 bg-black/80 backdrop-blur border-b border-neutral-800">
          <div className="flex items-center justify-end h-14 px-6">
            <button
              onClick={signOut}
              className="text-xs text-neutral-600 hover:text-white transition-colors"
            >
              Sair
            </button>
          </div>
        </header>
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
