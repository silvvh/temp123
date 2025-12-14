"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { motion } from "framer-motion";

const plans = [
  {
    name: "Consulta Avulsa",
    price: "150",
    period: "consulta",
    description: "Até 3 consultas/mês",
    features: [
      "Acesso à plataforma",
      "Videochamada HD",
      "Documentos assinados",
      "Suporte por chat",
    ],
    cta: "Agendar Consulta",
    variant: "outline" as const,
    featured: false,
  },
  {
    name: "Plano Mensal",
    price: "99",
    period: "mês",
    description: "Até 3 consultas/mês",
    features: [
      "Tudo do plano avulso",
      "Até 3 consultas",
      "Descontos em exames",
      "Prioridade no agendamento",
    ],
    cta: "Começar Agora",
    variant: "default" as const,
    featured: true,
  },
  {
    name: "Plano Familiar",
    price: "249",
    period: "mês",
    description: "Até 10 consultas/mês",
    features: [
      "Tudo do plano mensal",
      "Até 5 dependentes",
      "Consultas ilimitadas*",
      "Gestor de saúde dedicado",
    ],
    cta: "Contratar Plano",
    variant: "outline" as const,
    featured: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl lg:text-5xl font-display font-bold text-gray-900 mb-4">
            Planos transparentes e acessíveis
          </h2>
          <p className="text-xl text-gray-600">
            Sem taxas ocultas. Cancele quando quiser.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={plan.featured ? "md:scale-105 relative" : ""}
            >
              <Card
                className={`border-2 hover:shadow-xl transition-all h-full ${
                  plan.featured
                    ? "border-primary-500 shadow-2xl"
                    : "hover:border-primary-200"
                }`}
              >
                {plan.featured && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-500">
                    Mais Popular
                  </Badge>
                )}
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="mb-2">
                    <span className="text-4xl font-bold">R$ {plan.price}</span>
                    <span className="text-gray-500"> / {plan.period}</span>
                  </div>
                  {plan.description && (
                    <p className="text-sm text-gray-500 mb-6">
                      {plan.description}
                    </p>
                  )}
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <Check className="w-5 h-5 text-green-500" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    variant={plan.variant}
                    className={`w-full ${
                      plan.featured
                        ? "bg-primary-600 hover:bg-primary-700"
                        : ""
                    }`}
                    size="lg"
                    asChild
                  >
                    <Link href="/register">{plan.cta}</Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

