"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Video,
  Sparkles,
  PenTool,
  Smartphone,
  Shield,
  BarChart,
} from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    id: 1,
    icon: Video,
    title: "Videochamadas HD",
    description:
      "Consultas por vídeo com qualidade profissional e conexão estável.",
  },
  {
    id: 2,
    icon: Sparkles,
    title: "Inteligência Artificial",
    description:
      "IA que auxilia na elaboração de prontuários e laudos médicos.",
  },
  {
    id: 3,
    icon: PenTool,
    title: "Assinatura Digital",
    description:
      "Documentos assinados digitalmente com validade jurídica.",
  },
  {
    id: 4,
    icon: Smartphone,
    title: "Acesse de qualquer lugar",
    description:
      "Plataforma web e mobile para consultar quando precisar.",
  },
  {
    id: 5,
    icon: Shield,
    title: "Segurança LGPD",
    description:
      "Seus dados protegidos com criptografia de ponta a ponta.",
  },
  {
    id: 6,
    icon: BarChart,
    title: "Histórico Completo",
    description:
      "Todo seu histórico médico organizado e acessível.",
  },
];

export function Features() {
  return (
    <section
      id="features"
      className="py-20 bg-gradient-to-b from-gray-50 to-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl lg:text-5xl font-display font-bold text-gray-900 mb-4">
            Tudo que você precisa em um só lugar
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="group hover:shadow-xl transition-all hover:-translate-y-1 bg-white/60 backdrop-blur-sm border-gray-200 h-full">
                  <CardContent className="pt-8 pb-6">
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-xl mb-4 group-hover:scale-110 transition-transform">
                      <Icon className="w-7 h-7 text-primary-600" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

