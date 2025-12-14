"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Info,
  Users,
  FileText,
  Video,
  Calendar,
  XCircle,
  Download,
  Stethoscope,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Link from "next/link";
import {
  getStatusBadgeClass,
  getStatusLabel,
  getInitials,
  calculateAge,
  formatBytes,
} from "@/lib/consultations-utils";

interface ConsultationDetailsModalProps {
  consultation: {
    id: string;
    scheduled_at: string;
    duration_minutes: number;
    status: string;
    notes?: string;
    video_room_url?: string;
    doctor?: {
      full_name: string;
      specialty?: string;
      crm?: string;
      crm_state?: string;
      avatar_url?: string;
    };
    patient?: {
      full_name: string;
      birth_date?: string;
      avatar_url?: string;
    };
    documents?: Array<{
      id: string;
      file_name: string;
      category: string;
      file_size: number;
      file_path: string;
    }>;
  } | null;
  isOpen: boolean;
  onClose: () => void;
  role: "patient" | "doctor";
}

export function ConsultationDetailsModal({
  consultation,
  isOpen,
  onClose,
  role,
}: ConsultationDetailsModalProps) {
  if (!consultation) return null;

  const scheduledDate = new Date(consultation.scheduled_at);
  const isTodayConsultation =
    scheduledDate.toDateString() === new Date().toDateString();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-2xl font-display font-bold">
                Detalhes da Consulta
              </DialogTitle>
              <p className="text-sm text-gray-500 mt-1">
                ID: #{consultation.id.slice(0, 8)}
              </p>
            </div>
            <Badge className={getStatusBadgeClass(consultation.status)}>
              {getStatusLabel(consultation.status)}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Informações Gerais */}
          <section>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Info className="w-5 h-5 text-primary-600" />
              Informações Gerais
            </h3>
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-500">Data e Hora</label>
                    <p className="text-base font-medium text-gray-900 mt-1">
                      {format(
                        scheduledDate,
                        "dd 'de' MMMM 'de' yyyy 'às' HH:mm",
                        { locale: ptBR }
                      )}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Duração</label>
                    <p className="text-base font-medium text-gray-900 mt-1">
                      {consultation.duration_minutes} minutos
                    </p>
                  </div>
                </div>

                {consultation.notes && (
                  <div>
                    <label className="text-sm text-gray-500">Observações</label>
                    <p className="text-base text-gray-700 mt-1 p-3 bg-gray-50 rounded-lg">
                      {consultation.notes}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </section>

          {/* Participantes */}
          <section>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-primary-600" />
              Participantes
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {/* Card do Médico */}
              {consultation.doctor && (
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-16 h-16">
                        <AvatarImage src={consultation.doctor.avatar_url} />
                        <AvatarFallback className="bg-gradient-to-br from-primary-500 to-secondary-500 text-white text-lg">
                          {getInitials(consultation.doctor.full_name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm text-gray-500">Médico</p>
                        <p className="text-lg font-bold text-gray-900">
                          {consultation.doctor.full_name}
                        </p>
                        {consultation.doctor.specialty && (
                          <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                            <Stethoscope className="w-3 h-3" />
                            {consultation.doctor.specialty}
                          </p>
                        )}
                        {consultation.doctor.crm && (
                          <p className="text-xs text-gray-500 mt-1">
                            CRM {consultation.doctor.crm}
                            {consultation.doctor.crm_state &&
                              `-${consultation.doctor.crm_state}`}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Card do Paciente */}
              {consultation.patient && (
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-16 h-16">
                        <AvatarImage src={consultation.patient.avatar_url} />
                        <AvatarFallback className="bg-gradient-to-br from-secondary-500 to-green-500 text-white text-lg">
                          {getInitials(consultation.patient.full_name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm text-gray-500">Paciente</p>
                        <p className="text-lg font-bold text-gray-900">
                          {consultation.patient.full_name}
                        </p>
                        {consultation.patient.birth_date && (
                          <p className="text-sm text-gray-600 mt-1">
                            {calculateAge(consultation.patient.birth_date)} anos
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </section>

          {/* Documentos Anexados */}
          {consultation.documents && consultation.documents.length > 0 && (
            <section>
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary-600" />
                Documentos
              </h3>
              <div className="space-y-2">
                {consultation.documents.map((doc) => (
                  <Card key={doc.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-primary-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {doc.file_name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {doc.category} • {formatBytes(doc.file_size)}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <a href={doc.file_path} download>
                          <Download className="w-4 h-4" />
                        </a>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Footer com Ações */}
        <DialogFooter className="mt-8">
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            {consultation.status === "confirmed" &&
              isTodayConsultation &&
              consultation.video_room_url && (
                <Button
                  className="bg-secondary-500 hover:bg-secondary-600 flex-1"
                  asChild
                >
                  <Link href={`/dashboard/consultations/${consultation.id}`}>
                    <Video className="w-4 h-4 mr-2" />
                    Entrar na Consulta
                  </Link>
                </Button>
              )}
            {consultation.status === "scheduled" && (
              <>
                <Button variant="outline" className="flex-1">
                  <Calendar className="w-4 h-4 mr-2" />
                  Reagendar
                </Button>
                <Button
                  variant="outline"
                  className="text-red-600 hover:text-red-700"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Cancelar
                </Button>
              </>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

