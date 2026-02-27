"use client";

import * as React from "react";
import { cn } from "@ui/lib/utils";
import { Icon } from "@ui/atoms/Icon";
import { Text } from "@ui/atoms/Text";
export interface NavItem {
  id: string;
  label: string;
  icon: string;
  href: string;
}

export interface MentorSidebarProps {
  activeItem: string;
  onNavigate: (href: string) => void;
  userName: string;
  showBackToDashboard?: boolean;
  onBackToDashboard?: () => void;
  className?: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: "overview", label: "Visão Geral", icon: "LayoutDashboard", href: "/mentor" },
  { id: "mentees", label: "Mentorados", icon: "Users", href: "/mentor/mentees" },
  { id: "insights", label: "Insights", icon: "BarChart3", href: "/mentor/insights" },
  { id: "diary", label: "Meu Diário", icon: "BookOpen", href: "/mentor/diary" },
];

function MentorSidebar({
  activeItem,
  onNavigate,
  userName,
  showBackToDashboard,
  onBackToDashboard,
  className,
}: MentorSidebarProps) {
  return (
    <aside
      className={cn(
        "w-60 h-screen bg-neutral-950 border-r border-neutral-800 flex flex-col",
        className
      )}
    >
      {/* Back to Dashboard (shown in "Meu Diário" mode) */}
      {showBackToDashboard ? (
        <button
          type="button"
          onClick={onBackToDashboard}
          className="flex items-center gap-2 px-4 py-3 text-neutral-500 hover:text-white transition-colors border-b border-neutral-800"
        >
          <Icon name="ArrowLeft" size="sm" />
          <Text size="sm" color="secondary" as="span">
            Voltar ao Dashboard
          </Text>
        </button>
      ) : null}

      {/* Logo */}
      <div className="px-6 py-6 border-b border-neutral-800">
        <Text size="lg" className="font-bold text-white">
          Autogoverno
        </Text>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4">
        <ul className="flex flex-col gap-1 px-3">
          {NAV_ITEMS.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => onNavigate(item.href)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                  activeItem === item.id
                    ? "bg-neutral-900 text-white"
                    : "text-neutral-500 hover:text-white hover:bg-neutral-900/50"
                )}
              >
                <Icon name={item.icon} size="md" />
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Divider + User */}
      <div className="border-t border-neutral-800 px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-red-500 flex items-center justify-center text-white text-sm font-bold">
            {userName.charAt(0).toUpperCase()}
          </div>
          <Text size="sm" color="secondary">
            {userName}
          </Text>
        </div>
      </div>
    </aside>
  );
}

export { MentorSidebar, NAV_ITEMS };
