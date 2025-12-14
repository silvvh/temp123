"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, AlertCircle, CheckCircle2 } from "lucide-react";
import { format, startOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { createClient } from "@/lib/supabase/client";
import type { TimeSlot } from "@/lib/calendar/types";

interface TimeSlotPickerProps {
  doctorId: string;
  selectedDate: Date | null;
  selectedTimeSlot: string | null;
  onTimeSlotSelect: (timeSlot: string) => void;
}

export default function TimeSlotPicker({
  doctorId,
  selectedDate,
  selectedTimeSlot,
  onTimeSlotSelect,
}: TimeSlotPickerProps) {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedDate) {
      setTimeSlots([]);
      return;
    }

    async function fetchTimeSlots() {
      if (!selectedDate) return;
      setLoading(true);
      try {
        const supabase = createClient();

        // Gerar slots de horário (8h às 18h, intervalos de 30min)
        const slots: TimeSlot[] = [];
        const today = startOfDay(new Date());
        const selectedDay = startOfDay(selectedDate);
        const isToday = selectedDay.getTime() === today.getTime();
        const currentHour = new Date().getHours();
        const currentMinute = new Date().getMinutes();

        // Buscar appointments existentes para esta data
        const startOfSelectedDay = startOfDay(selectedDate);
        const endOfSelectedDay = new Date(startOfSelectedDay);
        endOfSelectedDay.setHours(23, 59, 59, 999);

        const { data: existingAppointments } = await supabase
          .from("appointments")
          .select("scheduled_at")
          .eq("doctor_id", doctorId)
          .gte("scheduled_at", startOfSelectedDay.toISOString())
          .lte("scheduled_at", endOfSelectedDay.toISOString())
          .neq("status", "cancelled");

        const bookedTimes = new Set(
          (existingAppointments || []).map((apt) => {
            const date = new Date(apt.scheduled_at);
            return `${date.getHours().toString().padStart(2, "0")}:${date
              .getMinutes()
              .toString()
              .padStart(2, "0")}`;
          })
        );

        for (let hour = 8; hour < 18; hour++) {
          for (let minute of [0, 30]) {
            const timeString = `${hour.toString().padStart(2, "0")}:${minute
              .toString()
              .padStart(2, "0")}`;

            // Se for hoje, só mostrar horários futuros
            let available = true;
            if (isToday) {
              if (
                hour < currentHour ||
                (hour === currentHour && minute <= currentMinute)
              ) {
                available = false;
              }
            }

            // Verificar se já tem consulta agendada neste horário
            if (available && bookedTimes.has(timeString)) {
              available = false;
            }

            slots.push({
              id: `${hour}-${minute}`,
              start_time: timeString,
              end_time: `${hour.toString().padStart(2, "0")}:${(minute + 30)
                .toString()
                .padStart(2, "0")}`,
              is_available: available,
            });
          }
        }

        setTimeSlots(slots);
      } catch (error) {
        console.error("Error fetching time slots:", error);
        setTimeSlots([]);
      } finally {
        setLoading(false);
      }
    }

    fetchTimeSlots();
  }, [doctorId, selectedDate]);

  if (!selectedDate) {
    return (
      <Card className="border-2">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <Clock className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-600">
            Selecione uma data no calendário para ver os horários disponíveis
          </p>
        </CardContent>
      </Card>
    );
  }

  const morningSlots = timeSlots.filter(
    (slot) => parseInt(slot.start_time.split(":")[0]) < 12
  );
  const afternoonSlots = timeSlots.filter(
    (slot) => parseInt(slot.start_time.split(":")[0]) >= 12
  );

  return (
    <Card className="border-2 sticky top-32">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary-600" />
          Horários disponíveis
        </CardTitle>
        <p className="text-sm text-gray-600">
          {format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}
        </p>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : timeSlots.length === 0 ? (
          <div className="text-center py-8">
            <AlertCircle className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p className="text-gray-600">
              Nenhum horário disponível para esta data
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Morning Slots */}
            {morningSlots.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full" />
                  Manhã
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {morningSlots.map((slot) => (
                    <Button
                      key={slot.id}
                      variant={
                        selectedTimeSlot === slot.start_time
                          ? "default"
                          : "outline"
                      }
                      className={`
                        h-12 transition-all
                        ${
                          selectedTimeSlot === slot.start_time
                            ? "bg-primary-600 hover:bg-primary-700"
                            : ""
                        }
                        ${
                          !slot.is_available
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }
                      `}
                      onClick={() =>
                        slot.is_available && onTimeSlotSelect(slot.start_time)
                      }
                      disabled={!slot.is_available}
                    >
                      {selectedTimeSlot === slot.start_time && (
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                      )}
                      {slot.start_time}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Afternoon Slots */}
            {afternoonSlots.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full" />
                  Tarde
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {afternoonSlots.map((slot) => (
                    <Button
                      key={slot.id}
                      variant={
                        selectedTimeSlot === slot.start_time
                          ? "default"
                          : "outline"
                      }
                      className={`
                        h-12 transition-all
                        ${
                          selectedTimeSlot === slot.start_time
                            ? "bg-primary-600 hover:bg-primary-700"
                            : ""
                        }
                        ${
                          !slot.is_available
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }
                      `}
                      onClick={() =>
                        slot.is_available && onTimeSlotSelect(slot.start_time)
                      }
                      disabled={!slot.is_available}
                    >
                      {selectedTimeSlot === slot.start_time && (
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                      )}
                      {slot.start_time}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Legend */}
            <div className="pt-4 border-t space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-4 h-4 border-2 border-primary-200 rounded" />
                <span>Disponível</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-4 h-4 bg-gray-200 rounded" />
                <span>Indisponível</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
