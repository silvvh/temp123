import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateMedicalRecord } from "@/lib/ai/openai";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    // Verificar se é médico
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "doctor") {
      return NextResponse.json(
        { error: "Apenas médicos podem gerar prontuários" },
        { status: 403 }
      );
    }

    const { consultationNotes, patientName, patientAge, chiefComplaint } =
      await request.json();

    if (!consultationNotes) {
      return NextResponse.json(
        { error: "Anotações da consulta são obrigatórias" },
        { status: 400 }
      );
    }

    const record = await generateMedicalRecord({
      consultationNotes,
      patientName: patientName || "Paciente",
      patientAge: patientAge || "Não informado",
      chiefComplaint: chiefComplaint || "Não informado",
    });

    return NextResponse.json({ record });
  } catch (error: any) {
    console.error("Erro ao processar prontuário:", error);
    return NextResponse.json(
      { error: error.message || "Erro ao gerar prontuário" },
      { status: 500 }
    );
  }
}

