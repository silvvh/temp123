import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateMedicalReport } from "@/lib/ai/openai";

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
        { error: "Apenas médicos podem gerar laudos" },
        { status: 403 }
      );
    }

    const { examType, examData, preliminaryFindings } = await request.json();

    if (!examType || !examData) {
      return NextResponse.json(
        { error: "Tipo de exame e dados são obrigatórios" },
        { status: 400 }
      );
    }

    const report = await generateMedicalReport({
      examType,
      examData,
      preliminaryFindings: preliminaryFindings || "",
    });

    return NextResponse.json({ report });
  } catch (error: any) {
    console.error("Erro ao processar laudo:", error);
    return NextResponse.json(
      { error: error.message || "Erro ao gerar laudo" },
      { status: 500 }
    );
  }
}

