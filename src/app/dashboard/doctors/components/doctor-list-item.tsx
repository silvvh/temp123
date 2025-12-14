'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, MapPin, Calendar, TrendingUp, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

interface DoctorListItemProps {
  doctor: any;
}

export default function DoctorListItem({ doctor }: DoctorListItemProps) {
  const initials = doctor.profile?.full_name
    ?.split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'DR';

  return (
    <Card className="group border-2 hover:border-primary-300 hover:shadow-xl transition-all bg-white">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left: Avatar and Basic Info */}
          <div className="flex items-start gap-4 lg:w-2/5">
            <div className="relative flex-shrink-0">
              <Avatar className="w-20 h-20 lg:w-24 lg:h-24 border-4 border-white shadow-lg ring-2 ring-primary-100">
                <AvatarImage src={doctor.profile?.avatar_url} alt={doctor.profile?.full_name} />
                <AvatarFallback className="bg-gradient-to-br from-primary-500 to-secondary-500 text-white text-xl">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 border-4 border-white rounded-full" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start gap-2 mb-2">
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                  Dr. {doctor.profile?.full_name || 'Médico'}
                </h3>
                {doctor.featured && (
                  <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white border-0">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    Destaque
                  </Badge>
                )}
              </div>
              <p className="text-sm text-gray-600 mb-2">{doctor.specialty}</p>
              <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
                <MapPin className="w-3 h-3" />
                CRM {doctor.crm}-{doctor.crm_state}
              </div>
              {/* Stats Row */}
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="font-medium">{doctor.rating || '5.0'}</span>
                  <span className="text-gray-400">({doctor.total_reviews || 0})</span>
                </div>
                <div className="text-gray-400">•</div>
                <div className="text-gray-600">
                  <span className="font-medium">{doctor.total_consultations || 0}+</span> consultas
                </div>
              </div>
            </div>
          </div>

          {/* Middle: Bio and Highlights */}
          <div className="lg:w-2/5 lg:border-l lg:border-gray-200 lg:pl-6">
            {doctor.bio && (
              <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                {doctor.bio}
              </p>
            )}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span>Responde em até 2 horas</span>
              </div>
              {doctor.accepts_insurance && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span>Atende convênios</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span>Teleconsulta disponível</span>
              </div>
            </div>
          </div>

          {/* Right: Price and Actions */}
          <div className="lg:w-1/5 lg:border-l lg:border-gray-200 lg:pl-6 flex flex-col justify-between">
            <div className="mb-4">
              <p className="text-xs text-gray-500 mb-1">Consulta a partir de</p>
              <p className="text-3xl font-bold text-primary-600">
                R$ {parseFloat(doctor.consultation_price || 0).toFixed(2)}
              </p>
            </div>
            <div className="space-y-2">
              <Button className="w-full bg-secondary-500 hover:bg-secondary-600" size="lg" asChild>
                <Link href={`/dashboard/schedule?doctor=${doctor.id}`}>
                  <Calendar className="w-4 h-4 mr-2" />
                  Agendar
                </Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href={`/dashboard/doctors/${doctor.id}`}>Ver Perfil</Link>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

