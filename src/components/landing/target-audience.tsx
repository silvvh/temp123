"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Users, Stethoscope, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const patientFeatures = [
  "Consultas sem sair de casa",
  "Especialistas verificados",
  "Preços transparentes",
  "Histórico centralizado",
];

const doctorFeatures = [
  "Atenda de onde estiver",
  "Agenda flexível",
  "IA para otimizar atendimentos",
  "Pagamentos automatizados",
];

export function TargetAudience() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Para Pacientes */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card className="group hover:shadow-2xl transition-all border-2 hover:border-primary-200 h-full">
              <CardContent className="p-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl mb-6">
                  <Users className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-3xl font-bold mb-4">
                  Para você e sua família
                </h3>
                <ul className="space-y-3 mb-8">
                  {patientFeatures.map((item) => (
                    <li key={item} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full bg-secondary-500 hover:bg-secondary-600"
                  size="lg"
                  asChild
                >
                  <Link href="/register">
                    Começar como Paciente
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Para Médicos */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card className="group hover:shadow-2xl transition-all border-2 hover:border-secondary-200 h-full">
              <CardContent className="p-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl mb-6">
                  <Stethoscope className="w-8 h-8 text-secondary-600" />
                </div>
                <h3 className="text-3xl font-bold mb-4">
                  Para profissionais de saúde
                </h3>
                <ul className="space-y-3 mb-8">
                  {doctorFeatures.map((item) => (
                    <li key={item} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full bg-primary-600 hover:bg-primary-700"
                  size="lg"
                  asChild
                >
                  <Link href="/register?role=doctor">
                    Cadastrar-se como Médico
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

