import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Calendar, FileText, Clock } from "lucide-react";

export default async function PatientDashboardPage() {
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

  if (profile?.role !== "patient") {
    redirect("/dashboard");
  }

  // Buscar próximo agendamento
  const { data: nextAppointment } = await supabase
    .from("appointments")
    .select("*, doctors:doctor_id(*, profiles:id(*))")
    .eq("patient_id", user.id)
    .eq("status", "confirmed")
    .gte("scheduled_at", new Date().toISOString())
    .order("scheduled_at", { ascending: true })
    .limit(1)
    .single();

  // Buscar histórico de consultas
  const { data: recentAppointments } = await supabase
    .from("appointments")
    .select("*, doctors:doctor_id(*, profiles:id(*))")
    .eq("patient_id", user.id)
    .order("scheduled_at", { ascending: false })
    .limit(5);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard do Paciente</h1>
        <p className="text-muted-foreground">Bem-vindo, {profile?.full_name}</p>
      </div>

      {nextAppointment && (
        <Card className="mb-8 border-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Próxima Consulta
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-lg font-semibold">
                {new Date(nextAppointment.scheduled_at).toLocaleString("pt-BR", {
                  dateStyle: "full",
                  timeStyle: "short",
                })}
              </p>
              <p className="text-muted-foreground">
                Dr(a).{" "}
                {nextAppointment.doctors?.profiles?.full_name || "Médico"}
              </p>
              <div className="flex gap-2 mt-4">
                <Button asChild>
                  <Link href={`/dashboard/consultations/${nextAppointment.id}`}>
                    Acessar Consulta
                  </Link>
                </Button>
                <Button variant="outline">Reagendar</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Histórico de Consultas</CardTitle>
            <CardDescription>Suas últimas consultas</CardDescription>
          </CardHeader>
          <CardContent>
            {recentAppointments && recentAppointments.length > 0 ? (
              <div className="space-y-4">
                {recentAppointments.map((appointment: any) => (
                  <div
                    key={appointment.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">
                        {new Date(appointment.scheduled_at).toLocaleDateString("pt-BR")}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {appointment.doctors?.profiles?.full_name || "Médico"}
                      </p>
                      <span
                        className={`inline-block mt-1 px-2 py-1 text-xs rounded ${
                          appointment.status === "completed"
                            ? "bg-success/10 text-success"
                            : "bg-warning/10 text-warning"
                        }`}
                      >
                        {appointment.status === "completed" ? "Concluída" : "Agendada"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">
                Nenhuma consulta realizada ainda
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Documentos Disponíveis</CardTitle>
            <CardDescription>Seus documentos médicos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Link href="/dashboard/documents">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="mr-2 h-4 w-4" />
                  Ver Todos os Documentos
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Link href="/dashboard/schedule">
          <Button size="lg" className="w-full md:w-auto">
            <Calendar className="mr-2 h-5 w-5" />
            Agendar Nova Consulta
          </Button>
        </Link>
      </div>
    </div>
  );
}

