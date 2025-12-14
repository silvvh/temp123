'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Loader2, Video, Clock, User } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';

interface WaitingRoomProps {
  appointment: {
    id: string;
    scheduled_at: string;
    doctor: {
      full_name: string;
      specialty: string;
      avatar_url?: string | null;
    };
    patient: {
      full_name: string;
      avatar_url?: string | null;
    };
  };
  userRole: 'doctor' | 'patient';
  onJoin: () => void;
  onCancel: () => void;
}

export default function WaitingRoom({
  appointment,
  userRole,
  onJoin,
  onCancel,
}: WaitingRoomProps) {
  const [timeUntilAppointment, setTimeUntilAppointment] = useState<string>('');
  const [canJoin, setCanJoin] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const scheduledTime = new Date(appointment.scheduled_at);
      const now = new Date();
      const diff = scheduledTime.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeUntilAppointment('A consulta já começou');
        setCanJoin(true);
      } else {
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;

        if (hours > 0) {
          setTimeUntilAppointment(`${hours}h ${mins}min até a consulta`);
        } else {
          setTimeUntilAppointment(`${mins}min até a consulta`);
        }

        // Permitir entrar 5 minutos antes
        setCanJoin(minutes <= 5);
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, [appointment.scheduled_at]);

  const otherParticipant =
    userRole === 'doctor' ? appointment.patient : appointment.doctor;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardContent className="p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Video className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Sala de Espera
              </h1>
              <p className="text-gray-300">
                Aguardando início da consulta
              </p>
            </div>

            {/* Appointment Info */}
            <div className="bg-white/5 rounded-lg p-6 mb-6">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-gray-400" />
                <span className="text-gray-300 font-medium">
                  {format(new Date(appointment.scheduled_at), "EEEE, d 'de' MMMM 'às' HH:mm", {
                    locale: ptBR,
                  })}
                </span>
              </div>

              <div className="text-center text-sm text-gray-400 mb-4">
                {timeUntilAppointment}
              </div>

              {!canJoin && (
                <div className="text-center">
                  <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-300">
                    Você poderá entrar 5 minutos antes do horário agendado
                  </Badge>
                </div>
              )}
            </div>

            {/* Participant Info */}
            <div className="bg-white/5 rounded-lg p-6 mb-6">
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16 border-2 border-primary-500">
                  <AvatarImage src={otherParticipant.avatar_url || undefined} />
                  <AvatarFallback className="bg-primary-500 text-white text-xl">
                    {otherParticipant.full_name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <User className="w-4 h-4 text-gray-400" />
                    <h3 className="text-white font-semibold text-lg">
                      {otherParticipant.full_name}
                    </h3>
                  </div>
                  {userRole === 'patient' && 'specialty' in appointment.doctor && (
                    <p className="text-gray-400 text-sm">
                      {appointment.doctor.specialty}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="flex-1 bg-primary-600 hover:bg-primary-700"
                onClick={onJoin}
                disabled={!canJoin}
              >
                {canJoin ? (
                  <>
                    <Video className="w-5 h-5 mr-2" />
                    Entrar na Consulta
                  </>
                ) : (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Aguardando...
                  </>
                )}
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
                onClick={onCancel}
              >
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

