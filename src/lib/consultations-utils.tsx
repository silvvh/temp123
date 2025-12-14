import * as React from "react";
import {
  Clock,
  CheckCircle2,
  Video,
  Check,
  XCircle,
  AlertCircle,
} from "lucide-react";

export type ConsultationStatus =
  | "scheduled"
  | "confirmed"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "no_show";

export function getStatusBadgeClass(status: string): string {
  const classes: Record<string, string> = {
    scheduled: "bg-blue-50 text-blue-700 border-blue-200",
    confirmed: "bg-green-50 text-green-700 border-green-200",
    in_progress: "bg-purple-50 text-purple-700 border-purple-200",
    completed: "bg-gray-100 text-gray-700 border-gray-200",
    cancelled: "bg-red-50 text-red-700 border-red-200",
    no_show: "bg-orange-50 text-orange-700 border-orange-200",
  };
  return classes[status] || classes.scheduled;
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    scheduled: "Agendada",
    confirmed: "Confirmada",
    in_progress: "Em Andamento",
    completed: "Concluída",
    cancelled: "Cancelada",
    no_show: "Não Compareceu",
  };
  return labels[status] || status;
}

export function getStatusIcon(status: string): React.ReactElement | null {
  const icons: Record<string, React.ReactElement> = {
    scheduled: <Clock className="w-3 h-3" />,
    confirmed: <CheckCircle2 className="w-3 h-3" />,
    in_progress: <Video className="w-3 h-3" />,
    completed: <Check className="w-3 h-3" />,
    cancelled: <XCircle className="w-3 h-3" />,
    no_show: <AlertCircle className="w-3 h-3" />,
  };
  return icons[status] || null;
}

export function isUpcoming24h(scheduledAt: string): boolean {
  const consultationDate = new Date(scheduledAt);
  const now = new Date();
  const diffHours =
    (consultationDate.getTime() - now.getTime()) / (1000 * 60 * 60);
  return diffHours > 0 && diffHours <= 24;
}

export function isToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

export function calculateAge(birthDate: string): number {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birth.getDate())
  ) {
    age--;
  }
  return age;
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

