import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Upload, Search, Filter } from "lucide-react";
import Link from "next/link";

export default async function DocumentsPage() {
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

  // Buscar documentos do usuário
  const { data: documents } = await supabase
    .from("documents")
    .select("*")
    .eq(profile?.role === "patient" ? "patient_id" : "uploaded_by", user.id)
    .order("created_at", { ascending: false })
    .limit(20);

  const categories = ["Laudo", "Prontuário", "Exame", "Receita", "Atestado"];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Documentos</h1>
          <p className="text-muted-foreground">Gerencie seus documentos médicos</p>
        </div>
        <Button>
          <Upload className="mr-2 h-4 w-4" />
          Upload de Documentos
        </Button>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar documentos..."
              className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background"
            />
          </div>
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filtros
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {documents && documents.length > 0 ? (
          documents.map((doc: any) => (
            <Card key={doc.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <FileText className="h-8 w-8 text-primary" />
                  <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">
                    {doc.category}
                  </span>
                </div>
                <CardTitle className="text-lg">{doc.file_name}</CardTitle>
                <CardDescription>
                  {new Date(doc.created_at).toLocaleDateString("pt-BR")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {doc.ai_summary && (
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {doc.ai_summary}
                  </p>
                )}
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    Visualizar
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">
              Nenhum documento encontrado
            </p>
            <Button>
              <Upload className="mr-2 h-4 w-4" />
              Upload de Documentos
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

