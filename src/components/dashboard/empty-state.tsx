"use client";

import { Button } from "@/components/ui/button";
import { FileQuestion, Calendar, FileText } from "lucide-react";
import Link from "next/link";

interface EmptyStateProps {
  iconName?: "calendar" | "file" | "default";
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}

const iconMap = {
  calendar: Calendar,
  file: FileText,
  default: FileQuestion,
};

export function EmptyState({
  iconName = "default",
  title,
  description,
  actionLabel,
  actionHref,
}: EmptyStateProps) {
  const Icon = iconMap[iconName] || iconMap.default;

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-500 text-center mb-6 max-w-sm">{description}</p>
      {actionLabel && actionHref && (
        <Button asChild>
          <Link href={actionHref}>{actionLabel}</Link>
        </Button>
      )}
    </div>
  );
}

