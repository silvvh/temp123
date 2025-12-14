"use client";

import Link from "next/link";
import { Calendar, FileText, Users, CreditCard } from "lucide-react";
import { motion } from "framer-motion";

const actions = [
  {
    icon: Calendar,
    label: "Agendar Consulta",
    href: "/dashboard/schedule",
    color: "blue",
  },
  {
    icon: FileText,
    label: "Ver Documentos",
    href: "/dashboard/documents",
    color: "green",
  },
  {
    icon: Users,
    label: "Buscar Médicos",
    href: "/dashboard/doctors",
    color: "purple",
  },
  {
    icon: CreditCard,
    label: "Meus Planos",
    href: "/dashboard/billing",
    color: "orange",
  },
];

const colorClasses = {
  blue: "bg-blue-50 text-blue-600",
  green: "bg-green-50 text-green-600",
  purple: "bg-purple-50 text-purple-600",
  orange: "bg-orange-50 text-orange-600",
};

export function QuickActions() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {actions.map((action, index) => {
        const Icon = action.icon;
        return (
          <motion.div
            key={action.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link
              href={action.href}
              className="block p-6 bg-white rounded-xl border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all text-left group"
            >
              <div
                className={`w-12 h-12 ${colorClasses[action.color as keyof typeof colorClasses]} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}
              >
                <Icon className="w-6 h-6" />
              </div>
              <p className="font-medium">{action.label}</p>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}

