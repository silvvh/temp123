'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle2, FileText, Star, Home } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface CallEndedProps {
  appointment: any;
}

export default function CallEnded({ appointment }: CallEndedProps) {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmitFeedback = async () => {
    // TODO: Salvar avaliação no banco
    console.log('Rating:', rating, 'Feedback:', feedback);
    setSubmitted(true);
  };

  const onGoToConsultations = () => {
    router.push('/dashboard/consultations');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardContent className="p-12 text-center">
            {/* Success Icon */}
            <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-12 h-12 text-white" />
            </div>

            <h2 className="text-3xl font-bold text-white mb-3">
              Consulta Finalizada
            </h2>
            <p className="text-gray-300 mb-8">
              Sua consulta com Dr. {appointment?.doctor?.full_name || 'médico'} foi concluída com sucesso.
            </p>

            {!submitted ? (
              <>
                {/* Rating */}
                <div className="mb-8">
                  <p className="text-white font-medium mb-4">
                    Como foi sua experiência?
                  </p>
                  <div className="flex justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setRating(star)}
                        className="transition-transform hover:scale-110"
                      >
                        <Star
                          className={`w-10 h-10 ${
                            star <= rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-500'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Feedback */}
                {rating > 0 && (
                  <div className="mb-8">
                    <Textarea
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder="Conte-nos mais sobre sua experiência (opcional)"
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                      rows={4}
                    />
                  </div>
                )}

                {/* Submit Button */}
                {rating > 0 && (
                  <Button
                    size="lg"
                    className="bg-secondary-500 hover:bg-secondary-600 mb-4"
                    onClick={handleSubmitFeedback}
                  >
                    Enviar Avaliação
                  </Button>
                )}
              </>
            ) : (
              <div className="mb-8">
                <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-3" />
                <p className="text-white">Obrigado pelo seu feedback!</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="outline"
                size="lg"
                className="border-white/20 text-white hover:bg-white/10"
              >
                <FileText className="w-5 h-5 mr-2" />
                Ver Prontuário
              </Button>
              <Button
                size="lg"
                className="bg-primary-600 hover:bg-primary-700"
                onClick={onGoToConsultations}
              >
                <Home className="w-5 h-5 mr-2" />
                Voltar para Consultas
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

