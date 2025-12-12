import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const token_hash = requestUrl.searchParams.get("token_hash");
  const type = requestUrl.searchParams.get("type");
  const next = requestUrl.searchParams.get("next") ?? "/dashboard";

  const supabase = await createClient();

  // Se houver código, usar exchangeCodeForSession (formato mais comum)
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(new URL(next, requestUrl.origin));
    }
  }
  // Se houver token_hash e type, usar verifyOtp (para links diretos)
  else if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({
      type: type as "email",
      token_hash,
    });

    if (!error) {
      return NextResponse.redirect(new URL(next, requestUrl.origin));
    }
  }

  // Se houver erro ou parâmetros inválidos, redirecionar para login com mensagem de erro
  return NextResponse.redirect(
    new URL(`/login?error=Token de confirmação inválido ou expirado`, requestUrl.origin)
  );
}

