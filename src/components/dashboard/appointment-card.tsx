"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Video, Calendar, Clock } from "lucide-react";
import Link from "next/link";

interface AppointmentCardProps {
  doctor: string;
  specialty: string;
  date: string;
  time: string;
  avatar?: string;
  status: "confirmed" | "pending" | "completed";
  appointmentId?: string;
}

export function AppointmentCard({
  doctor,
  specialty,
  date,
  time,
  avatar,
  status,
  appointmentId,
}: AppointmentCardProps) {
  const initials = doctor
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-all">
      <div className="flex items-start gap-4">
        <Avatar className="w-12 h-12">
          <AvatarImage src={avatar} />
          <AvatarFallback className="bg-primary-100 text-primary-600">
            {initials}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-semibold">{doctor}</h3>
              <p className="text-sm text-gray-500">{specialty}</p>
            </div>
            <Badge
              variant={status === "confirmed" ? "default" : "secondary"}
              className={
                status === "confirmed"
                  ? "bg-green-100 text-green-700 border-green-200"
                  : status === "completed"
                  ? "bg-gray-100 text-gray-700 border-gray-200"
                  : ""
              }
            >
              {status === "confirmed"
                ? "Confirmado"
                : status === "completed"
                ? "Concluída"
                : "Pendente"}
            </Badge>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              <span>{date}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              <span>{time}</span>
            </div>
          </div>

          <div className="flex gap-2">
            {status === "confirmed" && appointmentId && (
              <Button
                size="sm"
                className="bg-secondary-500 hover:bg-secondary-600"
                asChild
              >
                <Link href={`/dashboard/consultations/${appointmentId}`}>
                  <Video className="w-4 h-4 mr-2" />
                  Entrar na Consulta
                </Link>
              </Button>
            )}
            {appointmentId && (
              <Button size="sm" variant="outline" asChild>
                <Link href={`/dashboard/consultations/${appointmentId}`}>
                  Detalhes
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

