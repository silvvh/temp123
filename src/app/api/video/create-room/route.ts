import { NextRequest, NextResponse } from "next/server";
import { dailyClient } from "@/lib/video/daily-client";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const { appointmentId } = await request.json();

    // Validar usuário autenticado
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Buscar appointment
    const { data: appointment, error: appointmentError } = await supabase
      .from("appointments")
      .select("id, patient_id, doctor_id, scheduled_at, status, video_room_url")
      .eq("id", appointmentId)
      .single();

    if (appointmentError || !appointment) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 }
      );
    }

    // Verificar se usuário tem permissão (paciente ou médico da consulta)
    if (
      appointment.patient_id !== user.id &&
      appointment.doctor_id !== user.id
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Verificar se já existe video_room_url
    let roomUrl = appointment.video_room_url;
    let roomName = "";

    if (!roomUrl) {
      // Criar nova sala
      const room = await dailyClient.createRoom({
        appointmentId,
        doctorId: appointment.doctor_id,
        patientId: appointment.patient_id,
        scheduledAt: new Date(appointment.scheduled_at),
      });

      roomUrl = room.url;
      roomName = room.roomName;

      // Salvar URL da sala no appointment e atualizar status
      await supabase
        .from("appointments")
        .update({
          video_room_url: roomUrl,
          status: "in_progress",
        })
        .eq("id", appointmentId);
    } else {
      // Extrair room name da URL existente
      roomName = roomUrl.split("/").pop() || "";

      // Atualizar status se ainda não estiver em progresso
      if (appointment.status !== "in_progress") {
        await supabase
          .from("appointments")
          .update({ status: "in_progress" })
          .eq("id", appointmentId);
      }
    }

    return NextResponse.json({
      roomUrl,
      roomName,
    });
  } catch (error: any) {
    console.error("Error creating room:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE: Deletar sala após consulta
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const roomName = searchParams.get("roomName");

    if (!roomName) {
      return NextResponse.json(
        { error: "Room name required" },
        { status: 400 }
      );
    }

    await dailyClient.deleteRoom(roomName);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting room:", error);
    return NextResponse.json(
      { error: "Failed to delete room" },
      { status: 500 }
    );
  }
}
