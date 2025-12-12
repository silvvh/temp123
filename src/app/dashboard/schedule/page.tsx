"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock } from "lucide-react";

export default function SchedulePage() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Agenda</h1>
        <p className="text-muted-foreground">Gerencie seus agendamentos</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Calendário</CardTitle>
            <CardDescription>Selecione uma data para ver os agendamentos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center min-h-[400px] border-2 border-dashed rounded-lg">
              <div className="text-center">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Calendário será implementado com react-big-calendar ou FullCalendar
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Agendamentos de Hoje</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium">09:00 - Dr. João Silva</p>
                  <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">
                    Confirmado
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">Paciente: Maria Santos</p>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium">14:00 - Dr. Ana Costa</p>
                  <span className="text-xs px-2 py-1 bg-warning/10 text-warning rounded">
                    Pendente
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">Paciente: José Oliveira</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

