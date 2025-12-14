"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  Video,
  CreditCard,
  Edit2,
  CheckCircle2,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState } from "react";
import type { Doctor } from "@/lib/calendar/types";

interface AppointmentSummaryProps {
  doctor: Doctor;
  date: Date | null;
  timeSlot: string | null;
  onConfirm: () => Promise<void>;
  onEdit: () => void;
}

export default function AppointmentSummary({
  doctor,
  date,
  timeSlot,
  onConfirm,
  onEdit,
}: AppointmentSummaryProps) {
  const [isConfirming, setIsConfirming] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"credit_card" | "pix">(
    "credit_card"
  );

  const handleConfirm = async () => {
    setIsConfirming(true);
    try {
      await onConfirm();
      // TODO: Redirecionar para página de sucesso ou consultas
    } catch (error) {
      console.error("Error confirming appointment:", error);
    } finally {
      setIsConfirming(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Summary Card */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-secondary-500" />
                Confirme os dados da consulta
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Doctor Info */}
              <div>
                <label className="text-sm font-medium text-gray-500 mb-3 block">
                  Médico
                </label>
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={doctor.avatar_url} />
                    <AvatarFallback className="bg-gradient-to-br from-primary-500 to-secondary-500 text-white">
                      {doctor.full_name
                        ? doctor.full_name
                            .split(" ")
                            .map((n: string) => n[0])
                            .join("")
                        : "MD"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">
                      {doctor.full_name ? `Dr. ${doctor.full_name}` : "Médico"}
                    </h3>
                    <p className="text-sm text-gray-600">{doctor.specialty}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      CRM {doctor.crm}-{doctor.crm_state}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={onEdit}>
                    <Edit2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <Separator />
              {/* Date & Time */}
              <div>
                <label className="text-sm font-medium text-gray-500 mb-3 block">
                  Data e Horário
                </label>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <Calendar className="w-5 h-5 text-primary-600" />
                    <div>
                      <p className="text-sm text-gray-600">Data</p>
                      <p className="font-semibold text-gray-900">
                        {date && format(date, "dd 'de' MMMM", { locale: ptBR })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <Clock className="w-5 h-5 text-primary-600" />
                    <div>
                      <p className="text-sm text-gray-600">Horário</p>
                      <p className="font-semibold text-gray-900">{timeSlot}</p>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-3"
                  onClick={onEdit}
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  Alterar data/horário
                </Button>
              </div>
              <Separator />
              {/* Consultation Type */}
              <div>
                <label className="text-sm font-medium text-gray-500 mb-3 block">
                  Tipo de Consulta
                </label>
                <div className="flex items-center gap-3 p-4 bg-primary-50 border-2 border-primary-200 rounded-lg">
                  <Video className="w-5 h-5 text-primary-600" />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">
                      Teleconsulta por Vídeo
                    </p>
                    <p className="text-sm text-gray-600">Duração: 60 minutos</p>
                  </div>
                  <Badge className="bg-secondary-500">Online</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary-600" />
                Forma de Pagamento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <button
                  className={`
                    w-full p-4 rounded-lg border-2 transition-all text-left
                    ${
                      paymentMethod === "credit_card"
                        ? "border-primary-500 bg-primary-50"
                        : "border-gray-200 hover:border-gray-300"
                    }
                  `}
                  onClick={() => setPaymentMethod("credit_card")}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`
                      w-5 h-5 rounded-full border-2 flex items-center justify-center
                      ${
                        paymentMethod === "credit_card"
                          ? "border-primary-500"
                          : "border-gray-300"
                      }
                    `}
                    >
                      {paymentMethod === "credit_card" && (
                        <div className="w-3 h-3 rounded-full bg-primary-500" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">
                        Cartão de Crédito
                      </p>
                      <p className="text-sm text-gray-600">
                        Pagamento seguro via Stripe
                      </p>
                    </div>
                  </div>
                </button>
                <button
                  className={`
                    w-full p-4 rounded-lg border-2 transition-all text-left
                    ${
                      paymentMethod === "pix"
                        ? "border-primary-500 bg-primary-50"
                        : "border-gray-200 hover:border-gray-300"
                    }
                  `}
                  onClick={() => setPaymentMethod("pix")}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`
                      w-5 h-5 rounded-full border-2 flex items-center justify-center
                      ${
                        paymentMethod === "pix"
                          ? "border-primary-500"
                          : "border-gray-300"
                      }
                    `}
                    >
                      {paymentMethod === "pix" && (
                        <div className="w-3 h-3 rounded-full bg-primary-500" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">PIX</p>
                      <p className="text-sm text-gray-600">
                        Aprovação instantânea
                      </p>
                    </div>
                  </div>
                </button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Price Summary - Sticky */}
        <div>
          <Card className="border-2 sticky top-32">
            <CardHeader>
              <CardTitle>Resumo do Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Consulta</span>
                  <span className="font-medium">
                    R$ {doctor.consultation_price}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Taxa de plataforma</span>
                  <span className="font-medium">R$ 0,00</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="font-bold text-lg">Total</span>
                  <span className="font-bold text-2xl text-primary-600">
                    R$ {doctor.consultation_price}
                  </span>
                </div>
              </div>
              <Button
                size="lg"
                className="w-full bg-secondary-500 hover:bg-secondary-600 text-lg h-14"
                onClick={handleConfirm}
                disabled={isConfirming}
              >
                {isConfirming ? (
                  <>Processando...</>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                    Confirmar Agendamento
                  </>
                )}
              </Button>
              <p className="text-xs text-center text-gray-500">
                Ao confirmar, você concorda com nossos{" "}
                <a href="/terms" className="text-primary-600 hover:underline">
                  Termos de Uso
                </a>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
