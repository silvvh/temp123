"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Search, Plus } from "lucide-react";
import Link from "next/link";

export function DashboardHeader() {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Buscar consultas, documentos..."
            className="pl-10 h-10 bg-gray-50 border-0 focus:bg-white focus:ring-2 focus:ring-primary-200"
          />
        </div>
      </div>
    </header>
  );
}
