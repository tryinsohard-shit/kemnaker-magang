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
    <Card className="hover:shadow-md transition-shadow overflow-hidden">
      <CardHeader className="pb-3 bg-card border-b">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-foreground line-clamp-2">{vacancy.posisi}</h3>
            <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
              <Building2 className="w-4 h-4 flex-shrink-0" />
              <span className="line-clamp-1">{vacancy.perusahaan.nama_perusahaan}</span>
            </div>
            {vacancy.perusahaan.alamat && (
              <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span className="line-clamp-1">{vacancy.perusahaan.alamat}</span>
              </div>
            )}
          </div>
          {vacancy.ref_status_posisi && (
            <div>
              <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                {vacancy.ref_status_posisi.nama_status_posisi}
              </Badge>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-4">
        {/* Quota Info */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground flex items-center gap-2">
              <Users className="w-4 h-4" />
              Kuota Tersedia
            </span>
            <span className="font-semibold text-foreground">
              {vacancy.jumlah_kuota - vacancy.jumlah_terdaftar} / {vacancy.jumlah_kuota}
            </span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
            <div
              className="bg-primary h-2 rounded-full transition-all"
              style={{ width: `${Math.min(quotaPercentage, 100)}%` }}
            />
          </div>
          <div className="text-xs text-muted-foreground">
            {Math.round(quotaPercentage)}% kuota terpenuhi ({vacancy.jumlah_terdaftar} pendaftar)
          </div>
        </div>

        {/* Degree Level */}
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-2">Jenjang Pendidikan</p>
          <div className="flex flex-wrap gap-2">
            {jenjang.map((level: string, idx: number) => (
              <Badge key={idx} variant="secondary" className="text-xs">
                {level}
              </Badge>
            ))}
          </div>
        </div>

        {/* Majors */}
        {programs.length > 0 && (
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">Program Studi yang Dibutuhkan</p>
            <div className="flex flex-wrap gap-2">
              {programs.map((program: ProgramStudi) => (
                <Badge key={program.id} variant="outline" className="text-xs">
                  {program.title}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Age Requirements */}
        {(vacancy.usia_minimal || vacancy.usia_maksimal) && (
          <div className="text-sm bg-secondary/50 p-3 rounded-md">
            <p className="text-xs font-medium text-muted-foreground mb-1">Batasan Usia</p>
            <p className="text-sm text-foreground">
              {vacancy.usia_minimal ? `Minimal ${vacancy.usia_minimal} tahun` : ""}
              {vacancy.usia_minimal && vacancy.usia_maksimal ? " - " : ""}
              {vacancy.usia_maksimal ? `Maksimal ${vacancy.usia_maksimal} tahun` : ""}
            </p>
          </div>
        )}

        {/* KBJI Code */}
        {vacancy.kode_kbji && (
          <div className="text-xs">
            <p className="text-muted-foreground">
              Kode KBJI: <span className="font-mono text-foreground">{vacancy.kode_kbji}</span>
            </p>
          </div>
        )}

        {/* Description Toggle */}
        <div className="border-t pt-4">
          <button
            onClick={() => setShowDescription(!showDescription)}
            className="w-full flex items-center justify-between p-3 hover:bg-secondary/50 rounded-md transition-colors text-sm"
          >
            <span className="font-medium text-foreground flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Deskripsi Posisi
            </span>
            <span className="text-xs text-muted-foreground">{showDescription ? "Tutup" : "Buka"}</span>
          </button>

          {showDescription && (
            <div className="mt-2 p-3 bg-secondary/30 rounded-md text-sm text-foreground max-h-60 overflow-y-auto">
              <p className="whitespace-pre-wrap break-words">{vacancy.deskripsi_posisi}</p>
            </div>
          )}
        </div>

        {/* Special Requirements */}
        {specialRequirements && (
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 p-3 rounded-md">
            <p className="text-xs font-medium text-amber-900 dark:text-amber-100 flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4" />
              Syarat Khusus
            </p>
            <p className="text-sm text-amber-800 dark:text-amber-100">{specialRequirements}</p>
          </div>
        )}

        {/* Posted Date */}
        {vacancy.created_at && (
          <div className="text-xs text-muted-foreground flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Diposting: {new Date(vacancy.created_at).toLocaleDateString("id-ID")}
          </div>
        )}

        {/* CTA Button */}
        <div className="pt-2">
          <Button
            className="w-full"
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
