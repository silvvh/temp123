'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PageHeader } from '@/components/dashboard/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Star,
  MapPin,
  Calendar,
  ArrowLeft,
  CheckCircle2,
  Award,
  GraduationCap,
  Languages,
  Clock,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function DoctorProfilePage() {
  const params = useParams();
  const router = useRouter();
  const doctorId = params.id as string;

  const [doctor, setDoctor] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    async function fetchDoctorProfile() {
      setLoading(true);
      try {
        // Buscar dados do médico
        const { data: doctorData, error: doctorError } = await supabase
          .from('doctors')
          .select('*')
          .eq('id', doctorId)
          .single();

        if (doctorError) throw doctorError;

        // Buscar profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('full_name, avatar_url, phone')
          .eq('id', doctorId)
          .single();

        setDoctor({
          ...doctorData,
          profile: profileData || { full_name: 'Médico', avatar_url: null, phone: null }
        });

        // Buscar avaliações através dos appointments
        const { data: appointmentsData } = await supabase
          .from('appointments')
          .select('id')
          .eq('doctor_id', doctorId)
          .limit(20);

        const appointmentIds = (appointmentsData || []).map(a => a.id);
        
        if (appointmentIds.length > 0) {
          const { data: reviewsData } = await supabase
            .from('consultation_reviews')
            .select('*')
            .in('appointment_id', appointmentIds)
            .limit(10)
            .order('created_at', { ascending: false });
          
          setReviews(reviewsData || []);
        } else {
          setReviews([]);
        }
      } catch (error) {
        console.error('Error fetching doctor profile:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchDoctorProfile();
  }, [doctorId, supabase]);

  if (loading) {
    return (
      <div className="h-full bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="h-full bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Médico não encontrado</h2>
          <Button onClick={() => router.push('/dashboard/doctors')}>
            Voltar para Médicos
          </Button>
        </div>
      </div>
    );
  }

  const initials = doctor.profile?.full_name
    ?.split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'DR';

  return (
    <div className="h-full bg-gray-50 overflow-y-auto">
      <PageHeader
        title="Perfil do Médico"
        actions={
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        }
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Card */}
        <Card className="border-2 mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Left: Avatar and Basic Info */}
              <div className="flex flex-col items-center lg:items-start">
                <div className="relative">
                  <Avatar className="w-32 h-32 border-4 border-white shadow-2xl ring-4 ring-primary-100">
                    <AvatarImage src={doctor.profile?.avatar_url} alt={doctor.profile?.full_name} />
                    <AvatarFallback className="bg-gradient-to-br from-primary-500 to-secondary-500 text-white text-4xl">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 border-4 border-white rounded-full" />
                </div>

                {doctor.featured && (
                  <Badge className="mt-4 bg-gradient-to-r from-yellow-400 to-orange-400 text-white border-0">
                    Médico em Destaque
                  </Badge>
                )}
              </div>

              {/* Middle: Details */}
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Dr. {doctor.profile?.full_name || 'Médico'}
                </h1>
                <p className="text-xl text-gray-600 mb-4">{doctor.specialty}</p>

                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    <span className="font-bold text-lg">{doctor.rating || '5.0'}</span>
                    <span className="text-gray-500">({doctor.total_reviews || 0} avaliações)</span>
                  </div>
                  <div className="text-gray-400">•</div>
                  <div className="text-gray-600">
                    <span className="font-semibold">{doctor.total_consultations || 0}+</span> consultas realizadas
                  </div>
                  <div className="text-gray-400">•</div>
                  <div className="flex items-center gap-1 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    CRM {doctor.crm}-{doctor.crm_state}
                  </div>
                </div>

                {/* Bio */}
                {doctor.bio && (
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    {doctor.bio}
                  </p>
                )}

                {/* Features */}
                <div className="flex flex-wrap gap-3">
                  {doctor.accepts_insurance && (
                    <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                      <CheckCircle2 className="w-4 h-4 mr-1" />
                      Aceita convênio
                    </Badge>
                  )}
                  {doctor.home_visit && (
                    <Badge variant="secondary" className="bg-purple-50 text-purple-700">
                      <CheckCircle2 className="w-4 h-4 mr-1" />
                      Atende em casa
                    </Badge>
                  )}
                  {doctor.emergency_service && (
                    <Badge variant="secondary" className="bg-red-50 text-red-700">
                      <CheckCircle2 className="w-4 h-4 mr-1" />
                      Atendimento urgente
                    </Badge>
                  )}
                  <Badge variant="secondary" className="bg-green-50 text-green-700">
                    <CheckCircle2 className="w-4 h-4 mr-1" />
                    Teleconsulta
                  </Badge>
                </div>
              </div>

              {/* Right: Price and Action */}
              <div className="lg:w-64 flex flex-col gap-4">
                <Card className="bg-primary-50 border-primary-200">
                  <CardContent className="p-6 text-center">
                    <p className="text-sm text-gray-600 mb-2">Consulta a partir de</p>
                    <p className="text-4xl font-bold text-primary-600 mb-4">
                      R$ {parseFloat(doctor.consultation_price || 0).toFixed(2)}
                    </p>
                    <Button className="w-full bg-secondary-500 hover:bg-secondary-600" size="lg" asChild>
                      <a href={`/dashboard/schedule?doctor=${doctor.id}`}>
                        <Calendar className="w-5 h-5 mr-2" />
                        Agendar Consulta
                      </a>
                    </Button>
                  </CardContent>
                </Card>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary-500" />
                    <span>Responde em até 2 horas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span>Perfil verificado</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="about" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-flex">
            <TabsTrigger value="about">Sobre</TabsTrigger>
            <TabsTrigger value="education">Formação</TabsTrigger>
            <TabsTrigger value="reviews">Avaliações</TabsTrigger>
          </TabsList>

          {/* About Tab */}
          <TabsContent value="about" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Languages className="w-5 h-5 text-primary-600" />
                  Idiomas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {doctor.languages?.map((lang: string) => (
                    <Badge key={lang} variant="secondary">
                      {lang}
                    </Badge>
                  )) || <p className="text-gray-500">Não informado</p>}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Áreas de Atuação</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-semibold text-gray-900">{doctor.specialty}</p>
                      <p className="text-sm text-gray-600">Especialidade principal</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Education Tab */}
          <TabsContent value="education" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-primary-600" />
                  Formação Acadêmica
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {doctor.education?.map((edu: string, index: number) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary-500 rounded-full mt-2" />
                      <p className="text-gray-700">{edu}</p>
                    </div>
                  )) || <p className="text-gray-500">Não informado</p>}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-primary-600" />
                  Certificações
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {doctor.certifications?.map((cert: string, index: number) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                      <p className="text-gray-700">{cert}</p>
                    </div>
                  )) || <p className="text-gray-500">Não informado</p>}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Avaliações de Pacientes</CardTitle>
                <div className="flex items-center gap-4 mt-4">
                  <div className="text-center">
                    <p className="text-5xl font-bold text-primary-600">{doctor.rating || '5.0'}</p>
                    <div className="flex items-center justify-center gap-1 mt-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-5 h-5 ${
                            star <= Math.round(doctor.rating || 5)
                              ? 'text-yellow-500 fill-yellow-500'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {doctor.total_reviews || 0} avaliações
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {reviews.length > 0 ? (
                    reviews.map((review) => (
                      <div key={review.id} className="border-b border-gray-200 last:border-0 pb-6 last:pb-0">
                        <div className="flex items-start gap-4">
                          <Avatar className="w-12 h-12">
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                              P
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="flex">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`w-4 h-4 ${
                                      star <= review.rating
                                        ? 'text-yellow-500 fill-yellow-500'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-gray-500">
                                {new Date(review.created_at).toLocaleDateString('pt-BR')}
                              </span>
                            </div>
                            <p className="text-gray-700">{review.feedback}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-8">
                      Ainda não há avaliações para este médico.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

