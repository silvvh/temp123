"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

function OnboardingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = (searchParams.get("role") as "patient" | "doctor") || "patient";
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Dados do paciente
  const [cpf, setCpf] = useState("");
  const [birthDate, setBirthDate] = useState("");

  // Dados do médico
  const [crm, setCrm] = useState("");
  const [crmState, setCrmState] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [bio, setBio] = useState("");

  const specialties = [
    "Cardiologia",
    "Dermatologia",
    "Endocrinologia",
    "Ginecologia",
    "Neurologia",
    "Oftalmologia",
    "Ortopedia",
    "Pediatria",
    "Psiquiatria",
    "Clínica Geral",
    "Outra",
  ];

  const states = [
    "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA",
    "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN",
    "RS", "RO", "RR", "SC", "SP", "SE", "TO",
  ];

  const handlePatientSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const { error } = await supabase.from("patients").upsert({
        id: user.id,
        cpf: cpf.replace(/\D/g, ""),
        birth_date: birthDate,
      });

      if (error) throw error;

      router.push("/dashboard");
    } catch (err: any) {
      alert(err.message || "Erro ao salvar dados");
    } finally {
      setLoading(false);
    }
  };

  const handleDoctorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const { error } = await supabase.from("doctors").insert({
        id: user.id,
        crm,
        crm_state: crmState,
        specialty,
        bio: bio || null,
        is_approved: false, // Requer aprovação manual
      });

      if (error) throw error;

      alert(
        "Cadastro enviado! Aguarde aprovação de um administrador antes de usar a plataforma."
      );
      router.push("/dashboard");
    } catch (err: any) {
      alert(err.message || "Erro ao salvar dados");
    } finally {
      setLoading(false);
    }
  };

  if (role === "patient") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-medical-bg p-4">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader>
            <CardTitle>Complete seu Perfil</CardTitle>
            <CardDescription>
              Preencha suas informações para começar a usar a plataforma
            </CardDescription>
          </CardHeader>
          <form onSubmit={handlePatientSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cpf">CPF</Label>
                <Input
                  id="cpf"
                  type="text"
                  placeholder="000.000.000-00"
                  value={cpf}
                  onChange={(e) => setCpf(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="birthDate">Data de Nascimento</Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </CardContent>
            <CardContent>
              <Button type="submit" className="w-full" loading={loading}>
                Concluir Cadastro
              </Button>
            </CardContent>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-medical-bg p-4">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader>
          <CardTitle>Complete seu Perfil Médico</CardTitle>
          <CardDescription>
            Preencha suas informações profissionais para começar a atender
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleDoctorSubmit}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="crm">CRM</Label>
                <Input
                  id="crm"
                  type="text"
                  placeholder="000000"
                  value={crm}
                  onChange={(e) => setCrm(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="crmState">Estado do CRM</Label>
                <select
                  id="crmState"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={crmState}
                  onChange={(e) => setCrmState(e.target.value)}
                  required
                  disabled={loading}
                >
                  <option value="">Selecione</option>
                  {states.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="specialty">Especialidade</Label>
              <select
                id="specialty"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                required
                disabled={loading}
              >
                <option value="">Selecione</option>
                {specialties.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Biografia (Opcional)</Label>
              <textarea
                id="bio"
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder="Conte um pouco sobre você e sua experiência..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                disabled={loading}
              />
            </div>
          </CardContent>
          <CardContent>
            <Button type="submit" className="w-full" loading={loading}>
              Enviar para Aprovação
            </Button>
            <p className="text-xs text-muted-foreground text-center mt-4">
              Seu cadastro será revisado por um administrador antes da aprovação
            </p>
          </CardContent>
        </form>
      </Card>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <OnboardingContent />
    </Suspense>
  );
}

