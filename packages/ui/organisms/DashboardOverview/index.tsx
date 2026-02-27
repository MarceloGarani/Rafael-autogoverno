"use client";

import * as React from "react";
import { cn } from "@ui/lib/utils";
import { Heading } from "@ui/atoms/Heading";
import { Text } from "@ui/atoms/Text";
import { Icon } from "@ui/atoms/Icon";
import { Badge } from "@ui/atoms/Badge";
import { SummaryCard, type SummaryCardProps } from "@ui/molecules/SummaryCard";

export interface AlertItem {
  id: string;
  menteeName: string;
  daysInactive: number;
}

export interface ActivityItem {
  id: string;
  date: string;
  menteeName: string;
  category: string;
  emotion: string;
  intensity: number;
}

export interface DashboardOverviewProps {
  summaryCards: SummaryCardProps[];
  alerts: AlertItem[];
  recentActivity: ActivityItem[];
  className?: string;
}

function getStatusVariant(days: number): "warning" | "danger" {
  return days >= 5 ? "danger" : "warning";
}

function getIntensityVariant(intensity: number): "success" | "warning" | "danger" {
  if (intensity <= 3) return "success";
  if (intensity <= 6) return "warning";
  return "danger";
}

function DashboardOverview({ summaryCards, alerts, recentActivity, className }: DashboardOverviewProps) {
  return (
    <div className={cn("flex flex-col gap-8", className)}>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {summaryCards.map((card, i) => (
          <SummaryCard key={i} {...card} />
        ))}
      </div>

      {/* Alerts */}
      {alerts.length > 0 ? (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Icon name="AlertTriangle" size="md" className="text-yellow-500" />
            <Heading level={3} size="lg">
              Alertas de Inatividade
            </Heading>
          </div>
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg divide-y divide-neutral-800">
            {alerts.map((alert) => (
              <div key={alert.id} className="flex items-center justify-between px-4 py-3">
                <Text size="sm" color="primary">
                  {alert.menteeName}
                </Text>
                <Badge variant={getStatusVariant(alert.daysInactive)} size="sm">
                  {alert.daysInactive} dias sem registro
                </Badge>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* Recent Activity */}
      <div className="flex flex-col gap-3">
        <Heading level={3} size="lg">
          Atividade Recente
        </Heading>
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-800">
                <th className="text-left px-4 py-3 text-neutral-500 font-medium">Data</th>
                <th className="text-left px-4 py-3 text-neutral-500 font-medium">Mentorado</th>
                <th className="text-left px-4 py-3 text-neutral-500 font-medium">Categoria</th>
                <th className="text-left px-4 py-3 text-neutral-500 font-medium">Emoção</th>
                <th className="text-left px-4 py-3 text-neutral-500 font-medium">Intensidade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {recentActivity.map((activity) => (
                <tr key={activity.id} className="hover:bg-neutral-800/50 transition-colors">
                  <td className="px-4 py-3 text-neutral-500">{activity.date}</td>
                  <td className="px-4 py-3 text-white">{activity.menteeName}</td>
                  <td className="px-4 py-3 text-neutral-500">{activity.category}</td>
                  <td className="px-4 py-3 text-neutral-500">{activity.emotion}</td>
                  <td className="px-4 py-3">
                    <Badge variant={getIntensityVariant(activity.intensity)} size="sm">
                      {activity.intensity}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export { DashboardOverview };
