import { LandingHeader } from "@/components/landing/header";
import { HeroSection } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Features } from "@/components/landing/features";
import { TargetAudience } from "@/components/landing/target-audience";
import { Pricing } from "@/components/landing/pricing";
import { FAQ } from "@/components/landing/faq";
import { CTA } from "@/components/landing/cta";
import { Footer } from "@/components/landing/footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MediConnect - Telemedicina Moderna e Segura",
  description:
    "Agende consultas médicas online com especialistas certificados. Videochamadas HD, laudos assinados digitalmente e seu histórico médico sempre à mão.",
  keywords:
    "telemedicina, consulta online, médico online, teleconsulta, saúde digital",
  openGraph: {
    title: "MediConnect - Telemedicina Moderna e Segura",
    description:
      "Consultas médicas onde você estiver. Seguro, prático e certificado.",
    type: "website",
  },
};

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <LandingHeader />
      <main>
        <HeroSection />
        <HowItWorks />
        <Features />
        <TargetAudience />
        <Pricing />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
