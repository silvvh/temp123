import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Video, Clock, User } from "lucide-react";

export default async function ConsultationsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // Buscar consultas baseado na role
  const appointmentsQuery = profile?.role === "doctor"
    ? supabase
        .from("appointments")
        .select("*, patients:patient_id(*, profiles:id(*))")
        .eq("doctor_id", user.id)
    : supabase
        .from("appointments")
        .select("*, doctors:doctor_id(*, profiles:id(*))")
        .eq("patient_id", user.id);

  const { data: appointments } = await appointmentsQuery
    .order("scheduled_at", { ascending: false })
    .limit(20);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Consultas</h1>
        <p className="text-muted-foreground">Gerencie suas consultas e teleconsultas</p>
      </div>

      <div className="grid gap-4">
        {appointments && appointments.length > 0 ? (
          appointments.map((appointment: any) => {
            const otherUser = profile?.role === "doctor"
              ? appointment.patients?.profiles
              : appointment.doctors?.profiles;

            return (
              <Card key={appointment.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <h3 className="text-lg font-semibold">
                          {new Date(appointment.scheduled_at).toLocaleString("pt-BR", {
                            dateStyle: "full",
                            timeStyle: "short",
                          })}
                        </h3>
                        <span
                          className={`px-2 py-1 text-xs rounded ${
                            appointment.status === "completed"
                              ? "bg-success/10 text-success"
                              : appointment.status === "confirmed"
                              ? "bg-primary/10 text-primary"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {appointment.status === "completed"
                            ? "Concluída"
                            : appointment.status === "confirmed"
                            ? "Confirmada"
                            : appointment.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        {profile?.role === "doctor" ? (
                          <>
                            <User className="h-4 w-4" />
                            <span>Paciente: {otherUser?.full_name || "N/A"}</span>
                          </>
                        ) : (
                          <>
                            <User className="h-4 w-4" />
                            <span>Médico: {otherUser?.full_name || "N/A"}</span>
                          </>
                        )}
                        <Clock className="h-4 w-4 ml-4" />
                        <span>{appointment.duration_minutes} minutos</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {appointment.status === "confirmed" && appointment.video_room_url && (
                        <Link href={`/dashboard/consultations/${appointment.id}`}>
                          <Button>
                            <Video className="mr-2 h-4 w-4" />
                            Iniciar Consulta
                          </Button>
                        </Link>
                      )}
                      {appointment.status === "completed" && (
                        <Link href={`/dashboard/consultations/${appointment.id}/record`}>
                          <Button variant="outline">Ver Prontuário</Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">
                Nenhuma consulta encontrada
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

