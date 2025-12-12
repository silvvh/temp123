import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createDailyRoom } from "@/lib/video/daily";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { appointmentId, participants } = await request.json();

    if (!appointmentId) {
      return NextResponse.json(
        { error: "ID do agendamento é obrigatório" },
        { status: 400 }
      );
    }

    const room = await createDailyRoom(appointmentId, participants || []);

    // Atualizar agendamento com URL da sala
    const { error } = await supabase
      .from("appointments")
      .update({ video_room_url: room.url })
      .eq("id", appointmentId);

    if (error) throw error;

    return NextResponse.json({ room });
  } catch (error: any) {
    console.error("Erro ao criar sala:", error);
    return NextResponse.json(
      { error: error.message || "Erro ao criar sala de vídeo" },
      { status: 500 }
    );
  }
}

