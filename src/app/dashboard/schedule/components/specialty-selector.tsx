"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Heart,
  Brain,
  Eye,
  Bone,
  Baby,
  Stethoscope,
  Pill,
  Activity,
  User,
} from "lucide-react";

// Mapeamento de especialidades para ícones e cores
const SPECIALTY_CONFIG: Record<
  string,
  { icon: any; color: string }
> = {
  Cardiologia: { icon: Heart, color: "from-red-500 to-pink-500" },
  Neurologia: { icon: Brain, color: "from-purple-500 to-indigo-500" },
  Oftalmologia: { icon: Eye, color: "from-blue-500 to-cyan-500" },
  Ortopedia: { icon: Bone, color: "from-gray-500 to-slate-500" },
  Pediatria: { icon: Baby, color: "from-pink-400 to-rose-400" },
  "Clínica Geral": { icon: Stethoscope, color: "from-green-500 to-emerald-500" },
  Dermatologia: { icon: Activity, color: "from-orange-500 to-amber-500" },
  Psiquiatria: { icon: Pill, color: "from-teal-500 to-cyan-500" },
  Ginecologia: { icon: User, color: "from-rose-500 to-pink-500" },
  Urologia: { icon: User, color: "from-blue-600 to-indigo-600" },
  Endocrinologia: { icon: Activity, color: "from-yellow-500 to-orange-500" },
};

interface Specialty {
  name: string;
  count: number;
}

interface SpecialtySelectorProps {
  onSelect: (specialty: string) => void;
}

export default function SpecialtySelector({
  onSelect,
}: SpecialtySelectorProps) {
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSpecialties() {
      setLoading(true);
      try {
        const supabase = createClient();

        // Buscar todas as especialidades únicas com contagem de médicos aprovados
        const { data, error } = await supabase
          .from("doctors")
          .select("specialty")
          .eq("is_approved", true);

        if (error) throw error;

        // Contar médicos por especialidade
        const specialtyCounts = new Map<string, number>();
        (data || []).forEach((doctor) => {
          if (doctor.specialty) {
            const count = specialtyCounts.get(doctor.specialty) || 0;
            specialtyCounts.set(doctor.specialty, count + 1);
          }
        });

        // Converter para array e ordenar por nome
        const specialtiesArray: Specialty[] = Array.from(
          specialtyCounts.entries()
        )
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => a.name.localeCompare(b.name));

        setSpecialties(specialtiesArray);
      } catch (error) {
        console.error("Error fetching specialties:", error);
        setSpecialties([]);
      } finally {
        setLoading(false);
      }
    }

    fetchSpecialties();
  }, []);
  if (loading) {
    return (
      <div className="w-full h-full flex flex-col">
        <div className="text-center max-w-4xl mx-auto px-8 pt-12 pb-4 shrink-0">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 whitespace-normal break-words">
            Qual especialidade você precisa?
          </h2>
          <p className="text-gray-600 text-base">
            Selecione a área médica para encontrar o especialista ideal
          </p>
        </div>
        <div className="flex-1 overflow-y-auto scroll-smooth specialty-selector-scroll">
          <div className="py-2 px-8 max-w-7xl mx-auto">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <Card key={i}>
                  <CardContent className="p-6 text-center">
                    <Skeleton className="w-20 h-20 mx-auto mb-4 rounded-2xl" />
                    <Skeleton className="h-5 w-3/4 mx-auto mb-3" />
                    <Skeleton className="h-6 w-32 mx-auto" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      {/* Header Section - Fixed */}
      <div className="text-center max-w-4xl mx-auto px-8 pt-12 pb-4 shrink-0">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 whitespace-normal break-words">
          Qual especialidade você precisa?
        </h2>
        <p className="text-gray-600 text-base">
          Selecione a área médica para encontrar o especialista ideal
        </p>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto scroll-smooth specialty-selector-scroll">
        <div className="py-2 px-8 max-w-7xl mx-auto">
          {specialties.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">
                Nenhuma especialidade disponível no momento.
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {specialties.map((specialty) => {
                const config =
                  SPECIALTY_CONFIG[specialty.name] ||
                  SPECIALTY_CONFIG["Clínica Geral"]; // Fallback
                const Icon = config.icon;
                return (
                  <Card
                    key={specialty.name}
                    className="group cursor-pointer border-2 hover:border-primary-300 hover:shadow-xl transition-all hover:-translate-y-2"
                    onClick={() => onSelect(specialty.name)}
                  >
                    <CardContent className="p-6 text-center">
                      <div
                        className={`
                      w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${config.color}
                      flex items-center justify-center
                      group-hover:scale-110 transition-transform
                    `}
                      >
                        <Icon className="w-10 h-10 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-3">
                        {specialty.name}
                      </h3>
                      <Badge
                        variant="secondary"
                        className="bg-primary-50 text-primary-700"
                      >
                        {specialty.count}{" "}
                        {specialty.count === 1
                          ? "médico disponível"
                          : "médicos disponíveis"}
                      </Badge>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx global>{`
        .specialty-selector-scroll {
          max-height: calc(100vh - 400px);
          scroll-behavior: smooth;
        }

        .specialty-selector-scroll::-webkit-scrollbar {
          width: 8px;
        }

        .specialty-selector-scroll::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 4px;
        }

        .specialty-selector-scroll::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }

        .specialty-selector-scroll::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }

        /* Firefox */
        .specialty-selector-scroll {
          scrollbar-width: thin;
          scrollbar-color: #cbd5e1 #f1f5f9;
        }

        @media (max-height: 800px) {
          .specialty-selector-scroll {
            max-height: calc(100vh - 300px);
          }
        }

        @media (max-height: 600px) {
          .specialty-selector-scroll {
            max-height: calc(100vh - 250px);
          }
        }
      `}</style>
    </div>
  );
}
