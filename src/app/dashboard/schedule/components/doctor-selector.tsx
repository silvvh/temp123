"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Star,
  MapPin,
  Clock,
  Search,
  TrendingUp,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import type { Doctor } from "@/lib/calendar/types";

interface DoctorSelectorProps {
  specialty: string | null;
  onSelect: (doctor: Doctor) => void;
}

const ITEMS_PER_PAGE = 9;

export default function DoctorSelector({
  specialty,
  onSelect,
}: DoctorSelectorProps) {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [priceFilter, setPriceFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    async function fetchDoctors() {
      setLoading(true);
      try {
        const supabase = createClient();

        // Buscar médicos da especialidade
        const { data: doctorsData, error: doctorsError } = await supabase
          .from("doctors")
          .select(
            `
            id,
            specialty,
            crm,
            crm_state,
            bio,
            consultation_price,
            rating,
            total_reviews,
            total_consultations,
            featured
          `
          )
          .eq("specialty", specialty || "")
          .eq("is_approved", true);

        if (doctorsError) throw doctorsError;

        if (!doctorsData || doctorsData.length === 0) {
          setDoctors([]);
          return;
        }

        // Buscar profiles separadamente
        const doctorIds = doctorsData.map((d) => d.id);
        const { data: profilesData, error: profilesError } = await supabase
          .from("profiles")
          .select("id, full_name, avatar_url")
          .in("id", doctorIds);

        if (profilesError) {
          console.error("Error fetching profiles:", profilesError);
        }

        // Log para debug
        console.log("Doctors data:", doctorsData.length);
        console.log("Profiles data:", profilesData?.length || 0);
        if (profilesData) {
          profilesData.forEach((p) => {
            if (!p.full_name || p.full_name.trim() === "") {
              console.warn(`Profile sem nome para ID: ${p.id}`);
            }
          });
        }

        // Combinar dados
        const profilesMap = new Map((profilesData || []).map((p) => [p.id, p]));

        const formattedDoctors: Doctor[] = doctorsData.map((doc: any) => {
          const profile = profilesMap.get(doc.id);
          const fullName = profile?.full_name?.trim() || "";

          // Log se não encontrar profile ou nome vazio
          if (!profile) {
            console.warn(`Profile não encontrado para médico ID: ${doc.id}`);
          } else if (!fullName) {
            console.warn(
              `Nome vazio para médico ID: ${doc.id}, CRM: ${doc.crm}`
            );
          }

          return {
            id: doc.id,
            full_name: fullName,
            specialty: doc.specialty,
            crm: doc.crm,
            crm_state: doc.crm_state,
            avatar_url: profile?.avatar_url || null,
            rating: doc.rating || 4.5,
            reviews: doc.total_reviews || 0,
            consultations: doc.total_consultations || 0,
            consultation_price: doc.consultation_price?.toString() || "200",
            bio:
              doc.bio ||
              `Especialista em ${doc.specialty} com experiência comprovada.`,
            featured: doc.featured || false,
          };
        });

        setDoctors(formattedDoctors);
      } catch (error) {
        console.error("Error fetching doctors:", error);
        setDoctors([]);
      } finally {
        setLoading(false);
      }
    }

    if (specialty) {
      fetchDoctors();
    }
  }, [specialty]);

  // Filtrar e ordenar médicos
  useEffect(() => {
    let result = [...doctors];

    // Filtro de busca
    if (searchQuery) {
      result = result.filter((doctor) =>
        doctor.full_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filtro de preço
    if (priceFilter !== "all") {
      result = result.filter((doctor) => {
        const price = parseFloat(doctor.consultation_price || "0");
        if (priceFilter === "0-100") return price <= 100;
        if (priceFilter === "100-200") return price > 100 && price <= 200;
        if (priceFilter === "200+") return price > 200;
        return true;
      });
    }

    // Ordenação
    result.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return (a.full_name || "").localeCompare(b.full_name || "");
        case "price_asc":
          return (
            parseFloat(a.consultation_price || "0") -
            parseFloat(b.consultation_price || "0")
          );
        case "price_desc":
          return (
            parseFloat(b.consultation_price || "0") -
            parseFloat(a.consultation_price || "0")
          );
        default:
          return 0;
      }
    });

    setFilteredDoctors(result);
    setCurrentPage(1); // Reset para primeira página quando filtros mudarem
  }, [doctors, searchQuery, priceFilter, sortBy]);

  // Calcular paginação
  const totalPages = Math.ceil(filteredDoctors.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedDoctors = filteredDoctors.slice(startIndex, endIndex);

  if (loading) {
    return <DoctorSelectorSkeleton />;
  }

  return (
    <div>
      {/* Filtros e Busca - Sticky */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-0 z-10 shadow-sm mb-6">
        <div className="space-y-4">
          {/* Linha 1: Busca */}
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Buscar por nome do médico..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10 h-11"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setCurrentPage(1);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Linha 2: Filtros */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Filtro de Preço */}
            <div className="flex-1">
              <Label className="text-xs text-gray-600 mb-1 block">
                Faixa de Preço
              </Label>
              <Select
                value={priceFilter}
                onValueChange={(value) => {
                  setPriceFilter(value);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os preços</SelectItem>
                  <SelectItem value="0-100">Até R$ 100</SelectItem>
                  <SelectItem value="100-200">R$ 100 - R$ 200</SelectItem>
                  <SelectItem value="200+">Acima de R$ 200</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Ordenação */}
            <div className="flex-1">
              <Label className="text-xs text-gray-600 mb-1 block">
                Ordenar por
              </Label>
              <Select
                value={sortBy}
                onValueChange={(value) => {
                  setSortBy(value);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Nome (A-Z)</SelectItem>
                  <SelectItem value="price_asc">Menor preço</SelectItem>
                  <SelectItem value="price_desc">Maior preço</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Botão Limpar Filtros */}
            {(searchQuery || priceFilter !== "all" || sortBy !== "name") && (
              <div className="flex items-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchQuery("");
                    setPriceFilter("all");
                    setSortBy("name");
                    setCurrentPage(1);
                  }}
                  className="h-10"
                >
                  <X className="w-4 h-4 mr-2" />
                  Limpar
                </Button>
              </div>
            )}
          </div>

          {/* Info dos resultados */}
          <div className="flex items-center justify-between pt-3 border-t">
            {searchQuery && (
              <p className="text-sm text-gray-500">
                Buscando por: <strong>{searchQuery}</strong>
              </p>
            )}
            <p className="text-sm text-gray-600 ml-auto">
              {filteredDoctors.length} resultado
              {filteredDoctors.length !== 1 ? "s" : ""} encontrado
              {filteredDoctors.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
      </div>

      {/* Lista de Médicos com Scroll */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-48" />
            ))}
          </div>
        ) : filteredDoctors.length > 0 ? (
          <>
            {/* Container com Scroll */}
            <div className="max-h-[calc(100vh-400px)] overflow-y-auto custom-scrollbar">
              <div className="p-6 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedDoctors.map((doctor) => (
                  <Card
                    key={doctor.id}
                    className="group cursor-pointer border-2 hover:border-primary-300 hover:shadow-xl transition-all hover:-translate-y-1 h-full"
                    onClick={() => onSelect(doctor)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        {/* Avatar */}
                        <Avatar className="w-20 h-20 border-4 border-white shadow-lg">
                          <AvatarImage
                            src={doctor.avatar_url}
                            alt={doctor.full_name}
                          />
                          <AvatarFallback className="bg-gradient-to-br from-primary-500 to-secondary-500 text-white text-xl">
                            {doctor.full_name
                              .split(" ")
                              .map((n: string) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                                {doctor.full_name
                                  ? `Dr. ${doctor.full_name}`
                                  : "Médico"}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {doctor.specialty}
                              </p>
                            </div>
                            {doctor.featured && (
                              <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200">
                                <TrendingUp className="w-3 h-3 mr-1" />
                                Destaque
                              </Badge>
                            )}
                          </div>
                          {/* CRM */}
                          <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                            <MapPin className="w-4 h-4" />
                            CRM {doctor.crm}-{doctor.crm_state}
                          </div>
                          {/* Stats */}
                          <div className="flex items-center gap-4 mb-4">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                              <span className="text-sm font-medium">
                                {doctor.rating?.toFixed(1)}
                              </span>
                              <span className="text-xs text-gray-500">
                                ({doctor.reviews})
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <Clock className="w-4 h-4" />
                              {doctor.consultations}+ consultas
                            </div>
                          </div>
                          {/* Bio */}
                          <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                            {doctor.bio}
                          </p>
                          {/* Price & CTA */}
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-2xl font-bold text-gray-900">
                                R$ {doctor.consultation_price}
                              </span>
                              <span className="text-sm text-gray-500 ml-1">
                                / consulta
                              </span>
                            </div>
                            <Button
                              size="sm"
                              className="bg-secondary-500 hover:bg-secondary-600"
                              onClick={(e) => {
                                e.stopPropagation();
                                onSelect(doctor);
                              }}
                            >
                              Selecionar
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Paginação */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t bg-gray-50 flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  Página {currentPage} de {totalPages}
                </p>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => {
                      setCurrentPage((p) => p - 1);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Anterior
                  </Button>

                  {/* Números de página */}
                  <div className="hidden sm:flex items-center gap-1">
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <button
                          key={i}
                          onClick={() => {
                            setCurrentPage(pageNum);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          className={`w-9 h-9 rounded-lg text-sm font-medium transition ${
                            currentPage === pageNum
                              ? "bg-primary-600 text-white shadow-sm"
                              : "bg-white border border-gray-200 hover:bg-gray-50"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === totalPages}
                    onClick={() => {
                      setCurrentPage((p) => p + 1);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  >
                    Próxima
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">
              {searchQuery || priceFilter !== "all"
                ? "Nenhum médico encontrado com os filtros aplicados."
                : "Nenhum médico encontrado para esta especialidade."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function DoctorSelectorSkeleton() {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i}>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <Skeleton className="w-20 h-20 rounded-full" />
              <div className="flex-1 space-y-3">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
