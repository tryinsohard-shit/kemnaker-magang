"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { ChevronDown } from "lucide-react"

interface ProgramStudi {
  id: string
  title: string
}

interface ProvinceOption {
  kode: string
  nama: string
}

interface VacancyFiltersProps {
  majors: ProgramStudi[]
  selectedMajors: string[]
  onMajorsChange: (majors: string[]) => void
  jenjang: string[]
  selectedJenjang: string[]
  onJenjangChange: (jenjang: string[]) => void
  provinces: ProvinceOption[]
  selectedProvinces: string[]
  onProvincesChange: (provinces: string[]) => void
  limit: number
  onLimitChange: (limit: number) => void
  orderBy: string
  onOrderByChange: (orderBy: string) => void
  orderDirection: "ASC" | "DESC"
  onOrderDirectionChange: (direction: "ASC" | "DESC") => void
}

export default function VacancyFilters({
  majors,
  selectedMajors,
  onMajorsChange,
  jenjang,
  selectedJenjang,
  onJenjangChange,
  provinces,
  selectedProvinces,
  onProvincesChange,
  limit,
  onLimitChange,
  orderBy,
  onOrderByChange,
  orderDirection,
  onOrderDirectionChange,
}: VacancyFiltersProps) {
  const [expandedMajors, setExpandedMajors] = useState(true)
  const [expandedProvinces, setExpandedProvinces] = useState(true)
  const [expandedJenjang, setExpandedJenjang] = useState(true)
  const [expandedSorting, setExpandedSorting] = useState(true)

  const handleMajorChange = (majorId: string, checked: boolean) => {
    if (checked) {
      onMajorsChange([...selectedMajors, majorId])
    } else {
      onMajorsChange(selectedMajors.filter((id) => id !== majorId))
    }
  }

  const handleJenjangChange = (jenjangValue: string, checked: boolean) => {
    if (checked) {
      onJenjangChange([...selectedJenjang, jenjangValue])
    } else {
      onJenjangChange(selectedJenjang.filter((j) => j !== jenjangValue))
    }
  }

  const handleProvinceChange = (provinceKode: string, checked: boolean) => {
    if (checked) {
      onProvincesChange([provinceKode])
    } else {
      onProvincesChange([])
    }
  }

  const handleClearAll = () => {
    onMajorsChange([])
    onProvincesChange([])
    onJenjangChange([])
  }

  const activeFilters = selectedMajors.length + selectedProvinces.length + selectedJenjang.length

  const FilterSection = ({
    title,
    expanded,
    onToggle,
    children,
  }: {
    title: string
    expanded: boolean
    onToggle: () => void
    children: React.ReactNode
  }) => (
    <Card>
      <CardHeader className="pb-3 cursor-pointer lg:cursor-auto" onClick={() => onToggle()}>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{title}</CardTitle>
          <ChevronDown className={`w-5 h-5 lg:hidden transition-transform ${expanded ? "rotate-180" : ""}`} />
        </div>
      </CardHeader>

      {expanded && <CardContent className="space-y-3">{children}</CardContent>}
    </Card>
  )

  return (
    <div className="w-full space-y-4">
      {/* Data Per Halaman */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Data Per Halaman</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-3 gap-2">
            {[20, 50, 100].map((value) => (
              <button
                key={value}
                onClick={() => onLimitChange(value)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  limit === value
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {value}
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">Pilih jumlah lowongan per halaman</p>
        </CardContent>
      </Card>

      {/* Clear All Button */}
      {activeFilters > 0 && (
        <Button variant="outline" size="sm" className="w-full text-xs bg-transparent" onClick={handleClearAll}>
          Hapus Semua Filter ({activeFilters})
        </Button>
      )}

      {/* Sorting Section */}
      <FilterSection title="Urutkan" expanded={expandedSorting} onToggle={() => setExpandedSorting(!expandedSorting)}>
        <div className="space-y-3">
          <div>
            <Label className="text-sm font-medium mb-2 block">Sortir Berdasarkan</Label>
            <select
              value={orderBy}
              onChange={(e) => onOrderByChange(e.target.value)}
              className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
            >
              <option value="jumlah_kuota">Jumlah Kuota</option>
              <option value="jumlah_terdaftar">Jumlah Pendaftar</option>
              <option value="nama_perusahaan">Nama Perusahaan</option>
              <option value="created_at">Tanggal Posting Terbaru</option>
              <option value="posisi">Nama Posisi</option>
            </select>
          </div>

          <div>
            <Label className="text-sm font-medium mb-2 block">Urutan</Label>
            <div className="flex gap-2">
              <button
                onClick={() => onOrderDirectionChange("DESC")}
                className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  orderDirection === "DESC"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                Terbesar/Terbaru
              </button>
              <button
                onClick={() => onOrderDirectionChange("ASC")}
                className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  orderDirection === "ASC"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                Terkecil/Terlama
              </button>
            </div>
          </div>
        </div>
      </FilterSection>

      {/* Jenjang Filter */}
      <FilterSection
        title="Filter Jenjang Pendidikan"
        expanded={expandedJenjang}
        onToggle={() => setExpandedJenjang(!expandedJenjang)}
      >
        <div className="max-h-96 overflow-y-auto space-y-2">
          {jenjang.length > 0 ? (
            jenjang.map((jen) => (
              <div key={jen} className="flex items-center space-x-2">
                <Checkbox
                  id={`jenjang-${jen}`}
                  checked={selectedJenjang.includes(jen)}
                  onCheckedChange={(checked) => handleJenjangChange(jen, checked as boolean)}
                />
                <Label htmlFor={`jenjang-${jen}`} className="text-sm font-normal cursor-pointer flex-1">
                  {jen}
                </Label>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">Tidak ada jenjang pendidikan</p>
          )}
        </div>
      </FilterSection>

      {/* Majors Filter */}
      <FilterSection
        title="Filter Jurusan"
        expanded={expandedMajors}
        onToggle={() => setExpandedMajors(!expandedMajors)}
      >
        <div className="max-h-96 overflow-y-auto space-y-2">
          {majors.length > 0 ? (
            majors.map((major) => (
              <div key={major.id} className="flex items-center space-x-2">
                <Checkbox
                  id={major.id}
                  checked={selectedMajors.includes(major.id)}
                  onCheckedChange={(checked) => handleMajorChange(major.id, checked as boolean)}
                />
                <Label htmlFor={major.id} className="text-sm font-normal cursor-pointer flex-1">
                  {major.title}
                </Label>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">Tidak ada jurusan</p>
          )}
        </div>
      </FilterSection>

      {/* Provinces Filter */}
      <FilterSection
        title="Filter Provinsi"
        expanded={expandedProvinces}
        onToggle={() => setExpandedProvinces(!expandedProvinces)}
      >
        <div className="max-h-40 overflow-y-auto space-y-2">
          {provinces.length > 0 ? (
            provinces.map((province) => (
              <div key={province.kode} className="flex items-center space-x-2">
                <Checkbox
                  id={`province-${province.kode}`}
                  checked={selectedProvinces.includes(province.kode)}
                  onCheckedChange={(checked) => handleProvinceChange(province.kode, checked as boolean)}
                />
                <Label htmlFor={`province-${province.kode}`} className="text-sm font-normal cursor-pointer flex-1">
                  {province.nama}
                </Label>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">Tidak ada provinsi</p>
          )}
        </div>
      </FilterSection>
    </div>
  )
}
