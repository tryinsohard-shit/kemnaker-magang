"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react"
import VacancyFilters from "@/components/vacancy-filters"
import VacancyCard from "@/components/vacancy-card"
import SearchBar from "@/components/search-bar"

interface ProgramStudi {
  id: string
  title: string
}

interface Company {
  nama_perusahaan: string
  alamat: string
  logo: string
  kode_provinsi?: string
  nama_provinsi?: string
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
  id_status_posisi?: number
  ref_status_posisi?: { nama_status_posisi: string }
  created_at?: string
  updated_at?: string
}

interface ProvinceOption {
  kode: string
  nama: string
}

interface ApiResponse {
  data: Vacancy[]
  total?: number
  page?: number
  limit?: number
}

const parsePrograms = (program_studi: ProgramStudi[] | string): ProgramStudi[] => {
  if (Array.isArray(program_studi)) return program_studi
  try {
    return JSON.parse(program_studi)
  } catch {
    return []
  }
}

export default function Home() {
  const [allFilteredVacancies, setAllFilteredVacancies] = useState<Vacancy[]>([]) // All results after filter
  const [displayVacancies, setDisplayVacancies] = useState<Vacancy[]>([]) // Current page results
  const [totalVacancies, setTotalVacancies] = useState(0) // Total count from API
  const [loading, setLoading] = useState(true)
  const [selectedMajors, setSelectedMajors] = useState<string[]>([])
  const [selectedProvinces, setSelectedProvinces] = useState<string[]>([])
  const [selectedJenjang, setSelectedJenjang] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [allMajors, setAllMajors] = useState<ProgramStudi[]>([])
  const [allJenjang, setAllJenjang] = useState<string[]>([])
  const [allProvinces, setAllProvinces] = useState<ProvinceOption[]>([])
  const [limit, setLimit] = useState(20)
  const [currentPage, setCurrentPage] = useState(1) // Add page state for pagination
  const [orderBy, setOrderBy] = useState("jumlah_kuota")
  const [orderDirection, setOrderDirection] = useState<"ASC" | "DESC">("DESC")
  const abortControllerRef = useRef<AbortController | null>(null)

  useEffect(() => {
    const fetchOptionsData = async () => {
      try {
        const [vacanciesRes, provincesRes] = await Promise.all([
          fetch(
            "https://maganghub.kemnaker.go.id/be/v1/api/list/vacancies-aktif?order_by=jumlah_kuota&order_direction=DESC&page=1&limit=500",
          ),
          fetch(
            "https://maganghub.kemnaker.go.id/be/v1/api/list/provinces?order_by=nama_propinsi&order_direction=ASC&page=1&limit=40",
          ),
        ])

        const vacanciesData: ApiResponse = await vacanciesRes.json()
        const provincesData = await provincesRes.json()

        if (vacanciesData.data) {
          const majorsMap = new Map<string, ProgramStudi>()
          const jenjangSet = new Set<string>()

          vacanciesData.data.forEach((vacancy: Vacancy) => {
            const programs = parsePrograms(vacancy.program_studi)
            programs.forEach((program: ProgramStudi) => {
              if (!majorsMap.has(program.id)) {
                majorsMap.set(program.id, program)
              }
            })

            const jenjangList = Array.isArray(vacancy.jenjang) ? vacancy.jenjang : JSON.parse(vacancy.jenjang || "[]")
            jenjangList.forEach((j: string) => jenjangSet.add(j))
          })

          setAllMajors(Array.from(majorsMap.values()).sort((a, b) => a.title.localeCompare(b.title)))
          setAllJenjang(Array.from(jenjangSet).sort())
          setTotalVacancies(vacanciesData.total || vacanciesData.data.length)
        }

        if (provincesData.data) {
          const provinces = provincesData.data.map((p: any) => ({
            kode: p.kode_propinsi,
            nama: p.nama_propinsi,
          }))
          setAllProvinces(provinces)
        }
      } catch (error) {
        console.error("Error fetching options data:", error)
      }
    }

    fetchOptionsData()
  }, [])

  const fetchFilteredVacancies = async (signal: AbortSignal) => {
    setLoading(true)
    setCurrentPage(1) // Reset to page 1 when filters change
    try {
      const params = new URLSearchParams()

      if (searchQuery.trim()) {
        params.append("keyword", encodeURIComponent(searchQuery.trim()))
        params.append("page", "1")
        params.append("limit", "1000") // Fetch all search results
      } else {
        // Normal pagination for browse mode
        params.append("page", "1")
        params.append("limit", "1000") // Fetch 1000 to get all for client-side pagination
      }

      params.append("order_by", orderBy)
      params.append("order_direction", orderDirection)

      if (selectedProvinces.length > 0) {
        params.append("kode_provinsi", selectedProvinces[0])
      }

      const url = `https://maganghub.kemnaker.go.id/be/v1/api/list/vacancies-aktif?${params.toString()}`

      const response = await fetch(url, { signal })
      const data: ApiResponse = await response.json()

      if (data.data) {
        let results = data.data

        // Apply client-side filters for major and jenjang
        if (selectedMajors.length > 0) {
          results = results.filter((vacancy: Vacancy) => {
            const programs = parsePrograms(vacancy.program_studi)
            return programs.some((p) => selectedMajors.includes(p.id))
          })
        }

        if (selectedJenjang.length > 0) {
          results = results.filter((vacancy: Vacancy) => {
            const jenjangList = Array.isArray(vacancy.jenjang) ? vacancy.jenjang : JSON.parse(vacancy.jenjang || "[]")
            return jenjangList.some((j: string) => selectedJenjang.includes(j))
          })
        }

        setAllFilteredVacancies(results)

        const startIdx = 0
        const endIdx = limit
        setDisplayVacancies(results.slice(startIdx, endIdx))
      }
    } catch (error) {
      if (error instanceof Error && error.name !== "AbortError") {
        console.error("Error fetching vacancies:", error)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }

      const newAbortController = new AbortController()
      abortControllerRef.current = newAbortController

      fetchFilteredVacancies(newAbortController.signal)
    }, 500)

    return () => {
      clearTimeout(debounceTimer)
    }
  }, [searchQuery, selectedMajors, selectedJenjang, selectedProvinces, orderBy, orderDirection])

  useEffect(() => {
    const startIdx = (currentPage - 1) * limit
    const endIdx = startIdx + limit
    setDisplayVacancies(allFilteredVacancies.slice(startIdx, endIdx))
  }, [currentPage, limit, allFilteredVacancies])

  const totalPages = Math.ceil(allFilteredVacancies.length / limit)
  const startNum = (currentPage - 1) * limit + 1
  const endNum = Math.min(currentPage * limit, allFilteredVacancies.length)

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-4">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground">Lowongan Magang</h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-2">
              Platform alternatif untuk menemukan kesempatan magang berdasarkan jurusan Anda dengan informasi lengkap
            </p>
          </div>
          <SearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <aside className="lg:col-span-1">
            <VacancyFilters
              majors={allMajors}
              selectedMajors={selectedMajors}
              onMajorsChange={setSelectedMajors}
              jenjang={allJenjang}
              selectedJenjang={selectedJenjang}
              onJenjangChange={setSelectedJenjang}
              provinces={allProvinces}
              selectedProvinces={selectedProvinces}
              onProvincesChange={setSelectedProvinces}
              limit={limit}
              onLimitChange={(newLimit) => {
                setLimit(newLimit)
                setCurrentPage(1) // Reset to page 1 when limit changes
              }}
              orderBy={orderBy}
              onOrderByChange={setOrderBy}
              orderDirection={orderDirection}
              onOrderDirectionChange={setOrderDirection}
            />
          </aside>

          <section className="lg:col-span-3">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <p className="text-lg font-semibold text-foreground">
                    Ditemukan <span className="text-primary">{allFilteredVacancies.length}</span> lowongan
                  </p>
                </div>

                <div className="space-y-4">
                  {displayVacancies.length > 0 ? (
                    <>
                      {displayVacancies.map((vacancy) => (
                        <VacancyCard key={vacancy.id_posisi} vacancy={vacancy} />
                      ))}

                      {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 pt-8">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                          >
                            <ChevronLeft className="w-4 h-4" />
                            Sebelumnya
                          </Button>

                          <div className="flex gap-1">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                              <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                                  currentPage === page
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                                }`}
                              >
                                {page}
                              </button>
                            ))}
                          </div>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                          >
                            Selanjutnya
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </>
                  ) : (
                    <Card className="border-dashed">
                      <CardContent className="py-12 text-center">
                        <p className="text-muted-foreground">Tidak ada lowongan yang sesuai dengan filter Anda</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </>
            )}
          </section>
        </div>
      </div>
    </main>
  )
}
