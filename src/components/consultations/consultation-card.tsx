"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  Video,
  FileText,
  Stethoscope,
  MapPin,
  XCircle,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Link from "next/link";
import {
  getStatusBadgeClass,
  getStatusLabel,
  getStatusIcon,
  isUpcoming24h,
  isToday,
  getInitials,
} from "@/lib/consultations-utils";

interface ConsultationCardProps {
  consultation: {
    id: string;
    scheduled_at: string;
    duration_minutes: number;
    status: string;
    notes?: string;
    doctor?: {
      full_name: string;
      specialty?: string;
      crm?: string;
      crm_state?: string;
      avatar_url?: string;
    };
    patient?: {
      full_name: string;
      avatar_url?: string;
    };
    video_room_url?: string;
  };
  role: "patient" | "doctor";
  onViewDetails: (id: string) => void;
}

export function ConsultationCard({
  consultation,
  role,
  onViewDetails,
}: ConsultationCardProps) {
  const scheduledDate = new Date(consultation.scheduled_at);
  const otherPerson = role === "patient" ? consultation.doctor : consultation.patient;
  const isUpcoming = isUpcoming24h(consultation.scheduled_at);
  const isTodayConsultation = isToday(scheduledDate);

  return (
    <Card className="group relative overflow-hidden border-2 hover:border-primary-200 hover:shadow-xl transition-all hover:-translate-y-1 bg-white">
      {/* Badge de Status */}
      <div className="absolute top-4 right-4 z-10">
        <Badge className={getStatusBadgeClass(consultation.status)}>
          {getStatusIcon(consultation.status)}
          <span className="ml-1">{getStatusLabel(consultation.status)}</span>
        </Badge>
      </div>

      {/* Alerta de Consulta Próxima */}
      {isUpcoming && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 to-orange-400" />
      )}

      <CardContent className="p-6">
        {/* Data e Hora - Destaque */}
        <div className="mb-6 p-4 bg-gradient-to-br from-primary-50 to-secondary-50 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Data da consulta</p>
              <p className="text-lg font-bold text-gray-900">
                {format(scheduledDate, "dd 'de' MMMM", { locale: ptBR })}
              </p>
              <p className="text-sm font-medium text-primary-600">
                {format(scheduledDate, "HH:mm")} • {consultation.duration_minutes} min
              </p>
            </div>
          </div>
        </div>

        {/* Médico/Paciente Info */}
        {otherPerson && (
          <div className="flex items-center gap-4 mb-6">
            <Avatar className="w-16 h-16 border-2 border-white shadow-lg">
              <AvatarImage src={otherPerson.avatar_url} alt={otherPerson.full_name} />
              <AvatarFallback className="bg-gradient-to-br from-primary-500 to-secondary-500 text-white text-lg">
                {getInitials(otherPerson.full_name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-gray-900 truncate">
                {otherPerson.full_name}
              </h3>
              {consultation.doctor?.specialty && (
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <Stethoscope className="w-4 h-4" />
                  {consultation.doctor.specialty}
                </p>
              )}
              {consultation.doctor?.crm && (
                <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                  <MapPin className="w-3 h-3" />
                  CRM {consultation.doctor.crm}
                  {consultation.doctor.crm_state && `-${consultation.doctor.crm_state}`}
                </p>
              )}
            </div>
          </div>
        )}

        <Separator className="my-4" />

        {/* Quick Actions */}
        <div className="flex flex-col gap-2">
          {consultation.status === "confirmed" &&
            isTodayConsultation &&
            consultation.video_room_url && (
              <Button
                className="w-full bg-secondary-500 hover:bg-secondary-600"
                size="default"
                asChild
              >
                <Link href={`/dashboard/consultations/${consultation.id}`}>
                  <Video className="w-4 h-4 mr-2" />
                  Entrar na Consulta
                </Link>
              </Button>
            )}

          {consultation.status === "scheduled" && (
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm">
                <Calendar className="w-4 h-4 mr-2" />
                Reagendar
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-red-600 hover:text-red-700"
              >
                <XCircle className="w-4 h-4 mr-2" />
                Cancelar
              </Button>
            </div>
          )}

          <Button
            variant="ghost"
            size="sm"
            className="w-full"
            onClick={() => onViewDetails(consultation.id)}
          >
            <FileText className="w-4 h-4 mr-2" />
            Ver Detalhes
          </Button>
        </div>

        {/* Notas do Médico (se houver) */}
        {consultation.notes && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Observações:</p>
            <p className="text-sm text-gray-700 line-clamp-2">
              {consultation.notes}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

