import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateDocumentSummary } from "@/lib/ai/openai";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { documentText } = await request.json();

    if (!documentText) {
      return NextResponse.json(
        { error: "Texto do documento é obrigatório" },
        { status: 400 }
      );
    }

    const summary = await generateDocumentSummary(documentText);

    return NextResponse.json({ summary });
  } catch (error: any) {
    console.error("Erro ao processar resumo:", error);
    return NextResponse.json(
      { error: error.message || "Erro ao gerar resumo" },
      { status: 500 }
    );
  }
}

