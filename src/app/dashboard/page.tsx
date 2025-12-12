import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Buscar perfil do usuário
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  // Redirecionar para dashboard específico baseado na role
  if (profile?.role === "doctor") {
    redirect("/dashboard/doctor");
  } else if (profile?.role === "patient") {
    redirect("/dashboard/patient");
  } else if (profile?.role === "admin") {
    redirect("/dashboard/admin");
  } else if (profile?.role === "attendant") {
    redirect("/dashboard/attendant");
  }

  // Se não tiver role definida, redirecionar para onboarding
  redirect("/onboarding");
}

