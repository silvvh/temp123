"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Video, FileText } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    icon: Calendar,
    title: "1. Agende sua consulta",
    description:
      "Escolha o especialista, dia e horário que melhor se encaixa na sua rotina.",
    gradient: "from-primary-500 to-primary-600",
  },
  {
    icon: Video,
    title: "2. Realize a teleconsulta",
    description:
      "Converse por vídeo com o médico de forma privada e segura, direto do seu dispositivo.",
    gradient: "from-secondary-500 to-secondary-600",
  },
  {
    icon: FileText,
    title: "3. Receba seus documentos",
    description:
      "Laudos, receitas e prontuários assinados digitalmente chegam direto na plataforma.",
    gradient: "from-green-500 to-green-600",
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl lg:text-5xl font-display font-bold text-gray-900 mb-4">
            Simples, rápido e seguro
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Em apenas 3 passos você tem acesso a cuidados médicos profissionais
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={index}
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="border-2 hover:border-primary-200 transition-all hover:shadow-lg h-full">
                  <CardContent className="pt-12 pb-8 text-center">
                    <div
                      className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${step.gradient} rounded-2xl mb-6`}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </CardContent>
                </Card>
                {/* Connector Line (desktop only) */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 border-t-2 border-dashed border-gray-300" />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

