"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";

const faqs = [
  {
    question: "Como funciona a primeira consulta?",
    answer:
      "Após o cadastro, você escolhe o especialista, agenda um horário e recebe um link para a videochamada. A consulta acontece diretamente na plataforma, de forma segura e privada.",
  },
  {
    question: "Os médicos são certificados?",
    answer:
      "Sim, todos os médicos são verificados e possuem registro ativo no CRM. Realizamos validação completa de documentos antes de aprovar cada profissional.",
  },
  {
    question: "Os documentos têm validade legal?",
    answer:
      "Sim, todos os documentos são assinados digitalmente com certificado ICP-Brasil, tendo plena validade jurídica em todo território nacional.",
  },
  {
    question: "Como cancelo meu plano?",
    answer:
      "Você pode cancelar seu plano a qualquer momento diretamente nas configurações da sua conta. Não há multas ou taxas de cancelamento.",
  },
  {
    question: "A plataforma é segura?",
    answer:
      "Sim, utilizamos criptografia de ponta a ponta, estamos em conformidade com a LGPD e seguimos todas as normas do CFM para telemedicina.",
  },
  {
    question: "Funciona em qualquer dispositivo?",
    answer:
      "Sim, a plataforma funciona em computadores, tablets e smartphones, tanto em navegadores quanto em nossos aplicativos nativos.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl lg:text-5xl font-display font-bold text-gray-900 mb-4">
            Perguntas Frequentes
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border rounded-lg px-6"
              >
                <AccordionTrigger className="text-left font-semibold hover:text-primary-600">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}

