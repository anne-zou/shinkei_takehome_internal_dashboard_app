// ─── Raw CSV row ────────────────────────────────────────────────────────────
export interface FishRecord {
  fish_id: string
  price: number
  stage: 'HARVESTED' | 'PROCESSED' | 'EXPIRED'
  species_name: string
  harvest_weight_kg: number
  harvest_date: string          // "M/D/YYYY"
  harvest_region: string
  harvest_img_url: string
  shelf_life: string            // "M/D/YYYY" | ""
  quality_score: number | null
  optimal_consumption_date: string // "M/D/YYYY" | ""
  processed_img_url: string
}

// ─── API response shapes ─────────────────────────────────────────────────────
export interface TimeSeriesPoint {
  timestamp: string   // ISO 8601
  value: number
}

export interface ScatterPoint {
  timestamp: string   // ISO 8601 harvest date
  value: number
  species: string
}

export interface BreakdownEntry {
  label: string
  count: number
}

export interface DashboardSummaryData {
  num_harvested:    TimeSeriesPoint[]
  num_expired:      TimeSeriesPoint[]
  avg_quality:      ScatterPoint[]
  avg_price:        ScatterPoint[]
  total_count:      number
  count_by_stage:   BreakdownEntry[]
  count_by_species: BreakdownEntry[]
  count_by_region:  BreakdownEntry[]
}

export interface DashboardSummaryResponse {
  data: DashboardSummaryData
}

// ─── Query params ─────────────────────────────────────────────────────────────
export interface DashboardSummaryParams {
  startDate: string   // ISO date string "YYYY-MM-DD"
  endDate:   string
}
