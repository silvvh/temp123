"use client";

import { useState, useEffect } from "react";
import {
  format,
  addDays,
  isBefore,
  startOfDay,
  setHours,
  setMinutes,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon, Info } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface CalendarViewProps {
  doctorId: string;
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
}

export default function CalendarView({
  doctorId,
  selectedDate,
  onDateSelect,
}: CalendarViewProps) {
  const [bookedDates, setBookedDates] = useState<Date[]>([]);
  const supabase = createClient();

  useEffect(() => {
    async function fetchBookedDates() {
      try {
        // Buscar próximos 60 dias
        const startDate = startOfDay(new Date());
        const endDate = addDays(startDate, 60);

        // Buscar appointments do médico
        const { data, error } = await supabase
          .from("appointments")
          .select("scheduled_at")
          .eq("doctor_id", doctorId)
          .gte("scheduled_at", startDate.toISOString())
          .lte("scheduled_at", endDate.toISOString())
          .neq("status", "cancelled");

        if (error) throw error;

        // Converter para array de datas
        const dates = (data || []).map((apt) => {
          const date = new Date(apt.scheduled_at);
          return startOfDay(date);
        });

        setBookedDates(dates);
      } catch (error) {
        console.error("Error fetching booked dates:", error);
      }
    }

    if (doctorId) {
      fetchBookedDates();
    }
  }, [doctorId, supabase]);

  // Desabilitar datas passadas e domingos
  const disabledDays = [
    { before: new Date() }, // Dias passados
    { dayOfWeek: [0] }, // Domingos
  ];

  // Verificar se uma data está totalmente ocupada (todos os slots)
  const isDateFullyBooked = (date: Date) => {
    const dateStr = startOfDay(date).toISOString();
    // Contar quantos appointments existem neste dia
    const count = bookedDates.filter(
      (d) => startOfDay(d).toISOString() === dateStr
    ).length;
    // Se tiver mais de 20 appointments (8h-18h com intervalos de 30min = 20 slots), está ocupado
    return count >= 20;
  };

  return (
    <Card className="border-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-primary-600" />
            Escolha a data
          </CardTitle>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Info className="w-4 h-4" />
            <span>Clique em um dia disponível</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Legend */}
        <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-primary-600 rounded" />
            <span className="text-sm text-gray-700">Selecionado</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-white border-2 border-primary-200 rounded" />
            <span className="text-sm text-gray-700">Disponível</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-100 rounded" />
            <span className="text-sm text-gray-700">Indisponível</span>
          </div>
        </div>
        {/* Calendar */}
        <div className="flex justify-center">
          <Calendar
            mode="single"
            selected={selectedDate || undefined}
            onSelect={(date) => {
              if (date && !isDateFullyBooked(date)) {
                onDateSelect(date);
              }
            }}
            disabled={[
              ...disabledDays,
              // Desabilitar datas totalmente ocupadas
              (date: Date) => isDateFullyBooked(date),
            ]}
            fromDate={new Date()}
            toDate={addDays(new Date(), 60)}
            locale={ptBR}
            className="rounded-md border"
          />
        </div>
      </CardContent>
    </Card>
  );
}
