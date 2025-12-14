"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Check,
  Star,
  Users,
  Video,
  Play,
} from "lucide-react";
import { motion } from "framer-motion";

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-white to-green-50 overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-100 rounded-full opacity-20 blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-secondary-100 rounded-full opacity-20 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Badge */}
            <Badge className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100">
              <span className="mr-1">🏥</span> Telemedicina certificada CFM
            </Badge>

            {/* Headline */}
            <h1 className="text-5xl lg:text-6xl font-display font-bold text-gray-900 leading-tight">
              Consultas médicas
              <span className="block text-primary-600">onde você estiver</span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl text-gray-600 leading-relaxed">
              Agende consultas com especialistas, receba laudos assinados
              digitalmente e tenha seu histórico médico sempre à mão. Tudo
              online, seguro e prático.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-secondary-500 hover:bg-secondary-600 text-lg"
                asChild
              >
                <Link href="/register">
                  Agendar Consulta Grátis
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg">
                <Play className="mr-2 w-5 h-5" />
                Ver Como Funciona
              </Button>
            </div>

            {/* Social Proof */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                <span>+10.000 consultas realizadas</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                <span>4.8/5 avaliação</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary-500" />
                <span>200+ médicos</span>
              </div>
            </div>
          </motion.div>

          {/* Right Image */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
              {/* Placeholder para imagem/ilustração */}
              <div className="aspect-square bg-gradient-to-br from-primary-50 to-secondary-50 rounded-xl flex items-center justify-center">
                <Video className="w-24 h-24 text-primary-500" />
              </div>

              {/* Floating Card */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-4 border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Check className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Consulta agendada</p>
                    <p className="text-xs text-gray-500">Dr. Silva - 14:00</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

