"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, ChevronLeft, ChevronRight, AlertCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import HeroSection from "@/components/hero-section"
import VacancyFilters from "@/components/vacancy-filters"
import VacancyCard from "@/components/vacancy-card"
import SearchBar from "@/components/search-bar"
import Footer from "@/components/footer"

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
  const [showWelcomeDialog, setShowWelcomeDialog] = useState(false)

  // Show popup on first load
  useEffect(() => {
    const hasSeenPopup = sessionStorage.getItem("hasSeenPopup")
    if (!hasSeenPopup) {
      // Delay to show after splash screen
      const timer = setTimeout(() => {
        setShowWelcomeDialog(true)
        sessionStorage.setItem("hasSeenPopup", "true")
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [])

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
    setCurrentPage(1)
    try {
      const baseUrl = "https://maganghub.kemnaker.go.id/be/v1/api/list/vacancies-aktif"
      const params = new URLSearchParams()

      if (searchQuery.trim()) {
        params.append("keyword", searchQuery.trim())
      }

      if (selectedProvinces.length > 0) {
        params.append("kode_provinsi", selectedProvinces[0])
      }

      params.append("order_by", orderBy)
      params.append("order_direction", orderDirection)
      params.append("page", "1")
      params.append("limit", "1000")

      const url = `${baseUrl}?${params.toString()}`

      const response = await fetch(url, { signal })
      const data: any = await response.json()

      const vacancies = Array.isArray(data) ? data : data.data || []
      const total = data.total || data.length || vacancies.length

      if (vacancies && vacancies.length > 0) {
        let results = vacancies

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

        setTotalVacancies(results.length)
        setAllFilteredVacancies(results)
        const startIdx = 0
        const endIdx = limit
        setDisplayVacancies(results.slice(startIdx, endIdx))
      }
    } catch (error) {
      if (error instanceof Error && error.name !== "AbortError") {
        console.error("[v0] Error fetching vacancies:", error)
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
    <div className="min-h-screen bg-background flex flex-col">
      <Dialog open={showWelcomeDialog} onOpenChange={setShowWelcomeDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-500" />
              Pemberitahuan
            </DialogTitle>
            <DialogDescription className="text-left pt-4">
              Better gunakan filter search atau fitur filter jurusan dan lokasi karena yang tampil ketika pertama buka masih error, males benerin dah
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end">
            <Button onClick={() => setShowWelcomeDialog(false)}>
              Oke, Paham
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <main className="flex-1">
      <HeroSection />

      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="mb-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Lowongan Magang</h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Platform alternatif untuk menemukan kesempatan magang berdasarkan jurusan Anda dengan informasi lengkap
            </p>
          </div>
          <SearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
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
                setCurrentPage(1)
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
                <div className="mb-4 bg-card border rounded-lg p-3">
                  <p className="text-base font-semibold text-foreground">
                    Ditemukan <span className="text-primary">{allFilteredVacancies.length}</span> lowongan
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Menampilkan {startNum}-{endNum} dari {allFilteredVacancies.length} hasil
                  </p>
                </div>

                <div className="space-y-3">
                  {displayVacancies.length > 0 ? (
                    <>
                      {displayVacancies.map((vacancy) => (
                        <VacancyCard key={vacancy.id_posisi} vacancy={vacancy} />
                      ))}

                      {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-1 pt-6">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                            className="text-xs"
                          >
                            <ChevronLeft className="w-3 h-3" />
                            Prev
                          </Button>

                          <div className="flex gap-1">
                            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                              const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                              return (
                                <button
                                  key={pageNum}
                                  onClick={() => setCurrentPage(pageNum)}
                                  className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                                    currentPage === pageNum
                                      ? "bg-primary text-primary-foreground"
                                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
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
                            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                            className="text-xs"
                          >
                            Next
                            <ChevronRight className="w-3 h-3" />
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
      <Footer />
    </div>
  )
}
