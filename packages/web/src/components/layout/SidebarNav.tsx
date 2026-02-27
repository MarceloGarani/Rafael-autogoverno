'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@diario/ui';
import { LayoutDashboard, Users, BarChart3, BookOpen, type LucideIcon } from 'lucide-react';

const MAIN_ITEMS: { label: string; icon: LucideIcon; href: string }[] = [
  { label: 'Visão Geral', icon: LayoutDashboard, href: '/dashboard' },
  { label: 'Mentorados', icon: Users, href: '/dashboard/mentees' },
  { label: 'Insights', icon: BarChart3, href: '/dashboard/insights' },
];

const SECONDARY_ITEMS: { label: string; icon: LucideIcon; href: string }[] = [
  { label: 'Meu Diário', icon: BookOpen, href: '/' },
];

export function SidebarNav({ userName }: { userName: string }) {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-60 bg-neutral-950 border-r border-neutral-800 flex flex-col z-20">
      <div className="p-6">
        <h1 className="text-lg font-bold text-white">Autogoverno</h1>
      </div>

      <nav className="flex-1 px-3">
        <ul className="space-y-1">
          {MAIN_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors',
                    isActive
                      ? 'bg-neutral-900 text-white'
                      : 'text-neutral-500 hover:text-white hover:bg-neutral-900/50'
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="my-4 border-t border-neutral-800" />

        <ul className="space-y-1">
          {SECONDARY_ITEMS.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-neutral-500 hover:text-white hover:bg-neutral-900/50 transition-colors"
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-neutral-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white text-sm font-bold">
            {userName?.charAt(0).toUpperCase() || 'R'}
          </div>
          <span className="text-sm text-neutral-400 truncate">{userName}</span>
        </div>
      </div>
    </aside>
  );
}
