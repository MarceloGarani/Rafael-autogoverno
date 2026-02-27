'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@diario/ui';
import { Home, FileText, TrendingUp, User, type LucideIcon } from 'lucide-react';

const NAV_ITEMS: { label: string; icon: LucideIcon; href: string }[] = [
  { label: 'Home', icon: Home, href: '/' },
  { label: 'Histórico', icon: FileText, href: '/history' },
  { label: 'Progresso', icon: TrendingUp, href: '/progress' },
  { label: 'Perfil', icon: User, href: '/settings' },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20 bg-neutral-900 border-t border-neutral-800 md:hidden">
      <div className="flex items-center justify-around h-16">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center gap-1 px-3 py-2 transition-colors',
                isActive ? 'text-red-500' : 'text-neutral-500 hover:text-white'
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
