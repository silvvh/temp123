"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Calendar, TrendingUp } from "lucide-react";
import Link from "next/link";

interface DoctorCardProps {
  doctor: any;
}

export default function DoctorCard({ doctor }: DoctorCardProps) {
  console.log(doctor);
  const initials =
    doctor.profile?.full_name
      ?.split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "DR";

  return (
    <Card className="group relative overflow-hidden border-2 hover:border-primary-300 hover:shadow-2xl transition-all hover:-translate-y-2 bg-white">
      {/* Featured Badge */}
      {doctor.featured && (
        <div className="absolute top-4 right-4 z-10">
          <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white border-0">
            <TrendingUp className="w-3 h-3 mr-1" />
            Destaque
          </Badge>
        </div>
      )}

      <CardContent className="p-6 text-center">
        {/* Avatar */}
        <div className="relative inline-block mb-4">
          <Avatar className="w-24 h-24 border-4 border-white shadow-xl ring-2 ring-primary-100 group-hover:ring-primary-300 transition-all">
            <AvatarImage
              src={doctor.profile?.avatar_url}
              alt={doctor.profile?.full_name}
            />
            <AvatarFallback className="bg-gradient-to-br from-primary-500 to-secondary-500 text-white text-2xl">
              {initials}
            </AvatarFallback>
          </Avatar>
          {/* Online Indicator */}
          <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-4 border-white rounded-full" />
        </div>

        {/* Name */}
        <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-primary-600 transition-colors">
          Dr. {doctor.profile?.full_name || "Médico"}
        </h3>

        {/* Specialty */}
        <p className="text-sm text-gray-600 mb-3">{doctor.specialty}</p>

        {/* CRM */}
        <div className="flex items-center justify-center gap-1 text-xs text-gray-500 mb-4">
          <MapPin className="w-3 h-3" />
          CRM {doctor.crm}-{doctor.crm_state}
        </div>

        {/* Stats */}
        <div className="flex items-center justify-center gap-4 mb-4 text-sm">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span className="font-medium">{doctor.rating || "5.0"}</span>
            <span className="text-gray-400">({doctor.total_reviews || 0})</span>
          </div>
          <div className="text-gray-400">•</div>
          <div className="text-gray-600">
            {doctor.total_consultations || 0}+ consultas
          </div>
        </div>

        {/* Price */}
        <div className="mb-4 p-3 bg-primary-50 rounded-lg">
          <p className="text-xs text-gray-600 mb-1">Consulta a partir de</p>
          <p className="text-2xl font-bold text-primary-600">
            R$ {parseFloat(doctor.consultation_price || 0).toFixed(2)}
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <Button
            className="w-full bg-secondary-500 hover:bg-secondary-600"
            asChild
          >
            <Link href={`/dashboard/schedule?doctor=${doctor.id}`}>
              <Calendar className="w-4 h-4 mr-2" />
              Agendar Consulta
            </Link>
          </Button>
          <Button variant="outline" className="w-full" asChild>
            <Link href={`/dashboard/doctors/${doctor.id}`}>Ver Perfil</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
