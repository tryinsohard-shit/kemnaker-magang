/* eslint-disable @next/next/no-img-element */
"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, MapPin, Building2, ExternalLink, BookOpen, AlertCircle, Calendar } from "lucide-react"
import { useState } from "react"

interface ProgramStudi {
  id: string
  title: string
}

interface Company {
  nama_perusahaan: string
  alamat: string
  logo: string
  id_desa?: string
}

interface Vacancy {
  id_posisi: string
  posisi: string
  deskripsi_posisi: string
  jumlah_kuota: number
  jumlah_terdaftar: number
  program_studi: ProgramStudi[] | string
  jenjang: string[] | string
  perusahaan: Company
  syarat_khusus?: string | null
  usia_minimal?: number | null
  usia_maksimal?: number | null
  kode_kbji?: string | null
  ref_status_posisi?: { nama_status_posisi: string }
  created_at?: string
}

export default function VacancyCard({ vacancy }: { vacancy: Vacancy }) {
  const [showDescription, setShowDescription] = useState(false)

  const programs = Array.isArray(vacancy.program_studi)
    ? vacancy.program_studi
    : typeof vacancy.program_studi === "string"
      ? JSON.parse(vacancy.program_studi)
      : []

  const jenjang = Array.isArray(vacancy.jenjang)
    ? vacancy.jenjang
    : typeof vacancy.jenjang === "string"
      ? JSON.parse(vacancy.jenjang)
      : []

  const quotaPercentage = (vacancy.jumlah_terdaftar / vacancy.jumlah_kuota) * 100

  const specialRequirements = vacancy.syarat_khusus
    ? typeof vacancy.syarat_khusus === "string"
      ? JSON.parse(vacancy.syarat_khusus)
      : vacancy.syarat_khusus
    : null

  return (
    <Card className="hover:shadow-md transition-all duration-200 hover:border-primary/20 overflow-hidden">
      <CardHeader className="pb-2 bg-card border-b p-4">
        <div className="flex items-start gap-3">
          {/* Company Logo */}
          {vacancy.perusahaan.logo && (
            <div className="flex-shrink-0">
              <img
                src={vacancy.perusahaan.logo}
                alt={vacancy.perusahaan.nama_perusahaan}
                className="w-12 h-12 rounded-md object-cover border bg-white"
                onError={(e) => {
                  e.currentTarget.style.display = "none"
                }}
              />
            </div>
          )}
          
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-foreground line-clamp-2 leading-tight">{vacancy.posisi}</h3>
            <div className="space-y-1 mt-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Building2 className="w-4 h-4 flex-shrink-0" />
                <span className="line-clamp-1">{vacancy.perusahaan.nama_perusahaan}</span>
              </div>
              {vacancy.perusahaan.alamat && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 flex-shrink-0" />
                  <span className="line-clamp-1">{vacancy.perusahaan.alamat}</span>
                </div>
              )}
            </div>
          </div>
          
          {vacancy.ref_status_posisi && (
            <div className="flex-shrink-0">
              <Badge className="bg-green-100 text-green-800 hover:bg-green-200 text-xs">
                {vacancy.ref_status_posisi.nama_status_posisi}
              </Badge>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-3 pt-3 p-4">
        {/* Quota Info */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            <Users className="w-3 h-3" />
            <span>Informasi Kuota</span>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-blue-50 dark:bg-blue-950/30 p-2 rounded-md text-center">
              <p className="text-xs text-blue-600 dark:text-blue-400 mb-1">Total Kuota</p>
              <p className="text-xl font-bold text-blue-700 dark:text-blue-300">{vacancy.jumlah_kuota}</p>
            </div>
            <div className="bg-green-50 dark:bg-green-950/30 p-2 rounded-md text-center">
              <p className="text-xs text-green-600 dark:text-green-400 mb-1">Terdaftar</p>
              <p className="text-xl font-bold text-green-700 dark:text-green-300">{vacancy.jumlah_terdaftar}</p>
            </div>
          </div>

          <div className="bg-secondary/50 p-2 rounded-md">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-foreground">Sisa Kuota</span>
              <span className="text-xs font-bold text-foreground">
                {vacancy.jumlah_kuota - vacancy.jumlah_terdaftar} slot tersisa
              </span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
              <div
                className={`h-2 rounded-full transition-all ${
                  quotaPercentage >= 100 ? "bg-red-500" : quotaPercentage >= 80 ? "bg-orange-500" : "bg-green-500"
                }`}
                style={{ width: `${Math.min(quotaPercentage, 100)}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {quotaPercentage >= 100 ? "Kuota penuh" : `${Math.round(quotaPercentage)}% terisi`}
            </p>
          </div>
        </div>

        {/* Degree Level & Majors */}
        <div className="grid grid-cols-1 gap-2">
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1">
              <BookOpen className="w-3 h-3" />
              Jenjang
            </p>
            <div className="flex flex-wrap gap-1">
              {jenjang.map((level: string, idx: number) => (
                <Badge key={idx} variant="secondary" className="text-xs py-0 px-2">
                  {level}
                </Badge>
              ))}
            </div>
          </div>

          {programs.length > 0 && (
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">Program Studi</p>
              <div className="flex flex-wrap gap-1">
                {programs.slice(0, 3).map((program: ProgramStudi) => (
                  <Badge key={program.id} variant="outline" className="text-xs py-0 px-2">
                    {program.title}
                  </Badge>
                ))}
                {programs.length > 3 && (
                  <Badge variant="outline" className="text-xs py-0 px-2">
                    +{programs.length - 3}
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Age Requirements & KBJI */}
        {((vacancy.usia_minimal || vacancy.usia_maksimal) || vacancy.kode_kbji) && (
          <div className="text-xs bg-secondary/30 p-2 rounded-md space-y-1">
            {(vacancy.usia_minimal || vacancy.usia_maksimal) && (
              <p className="text-muted-foreground">
                <span className="font-medium">Usia:</span>{" "}
                {vacancy.usia_minimal ? `${vacancy.usia_minimal}` : ""}
                {vacancy.usia_minimal && vacancy.usia_maksimal ? "-" : ""}
                {vacancy.usia_maksimal ? `${vacancy.usia_maksimal}` : ""} tahun
              </p>
            )}
            {vacancy.kode_kbji && (
              <p className="text-muted-foreground">
                <span className="font-medium">KBJI:</span> <span className="font-mono">{vacancy.kode_kbji}</span>
              </p>
            )}
          </div>
        )}

        {/* Description Toggle */}
        <div className="border-t pt-3">
          <button
            onClick={() => setShowDescription(!showDescription)}
            className="w-full flex items-center justify-between p-2 hover:bg-secondary/50 rounded-md transition-colors text-sm"
          >
            <span className="font-medium text-foreground text-xs">Deskripsi Posisi</span>
            <span className="text-xs text-primary">{showDescription ? "Tutup" : "Lihat"}</span>
          </button>

          {showDescription && (
            <div className="mt-2 p-2 bg-secondary/30 rounded-md text-xs text-foreground max-h-48 overflow-y-auto">
              <p className="whitespace-pre-wrap break-words leading-relaxed">{vacancy.deskripsi_posisi}</p>
            </div>
          )}
        </div>

        {/* Special Requirements */}
        {specialRequirements && (
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 p-2 rounded-md">
            <p className="text-xs font-medium text-amber-900 dark:text-amber-100 flex items-center gap-1 mb-1">
              <AlertCircle className="w-3 h-3" />
              Syarat Khusus
            </p>
            <p className="text-xs text-amber-800 dark:text-amber-100">{specialRequirements}</p>
          </div>
        )}

        {/* Posted Date */}
        {vacancy.created_at && (
          <div className="text-xs text-muted-foreground flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {new Date(vacancy.created_at).toLocaleDateString("id-ID")}
          </div>
        )}

        {/* CTA Button */}
        <div className="pt-2">
          <Button
            className="w-full text-sm font-semibold shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            size="sm"
            onClick={() => window.open(`https://maganghub.kemnaker.go.id/lowongan/view/${vacancy.id_posisi}`, "_blank")}
          >
            Daftar di MagangHub
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
