/**
 * MockServerApi
 *
 * Simulates the backend REST API using local CSV data.
 * Endpoint: GET /dashboard/summary?startDate=&endDate=
 */

import Papa from 'papaparse'
import type {
  FishRecord,
  DashboardSummaryParams,
  DashboardSummaryResponse,
  TimeSeriesPoint,
  ScatterPoint,
  BreakdownEntry,
} from '@/types'

// Vite asset import for the CSV
import csvUrl from '@/data/shinkei_takehome_mock_data.csv?url'

// ─── CSV loader (singleton cache) ────────────────────────────────────────────
let _cache: FishRecord[] | null = null

async function loadRecords(): Promise<FishRecord[]> {
  if (_cache) return _cache

  const response = await fetch(csvUrl)
  const text = await response.text()

  const { data } = Papa.parse<Record<string, string>>(text, {
    header: true,
    skipEmptyLines: true,
  })

  _cache = data.map((row) => ({
    fish_id:                  row['fish_id'],
    price:                    parseFloat(row['price']) || 0,
    stage:                    row['stage'] as FishRecord['stage'],
    species_name:             row['species_name'],
    harvest_weight_kg:        parseFloat(row['harvest_weight_kg']) || 0,
    harvest_date:             row['harvest_date'],
    harvest_region:           row['harvest_region'],
    harvest_img_url:          row['harvest_img_url'],
    shelf_life:               row['shelf_life'] || '',
    quality_score:            row['quality_score'] ? parseFloat(row['quality_score']) : null,
    optimal_consumption_date: row['optimal_consumption_date'] || '',
    processed_img_url:        row['processed_img_url'] || '',
  }))

  return _cache
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Parse "M/D/YYYY" → Date (midnight UTC) */
function parseDate(str: string): Date | null {
  if (!str) return null
  const [m, d, y] = str.split('/')
  if (!m || !d || !y) return null
  return new Date(Date.UTC(parseInt(y), parseInt(m) - 1, parseInt(d)))
}

/** Date → ISO timestamp string (midnight UTC) */
function toISO(date: Date): string {
  return date.toISOString().replace('.000Z', 'Z')
}

/** Count records grouped by a string key, sorted descending */
function groupCount<T>(items: T[], key: (item: T) => string): BreakdownEntry[] {
  const map = new Map<string, number>()
  for (const item of items) {
    const k = key(item)
    map.set(k, (map.get(k) ?? 0) + 1)
  }
  return Array.from(map.entries())
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count)
}

/** Group records by harvest date and count them → sorted time series */
function toTimeSeries(records: FishRecord[], dateKey: (r: FishRecord) => string): TimeSeriesPoint[] {
  const map = new Map<string, number>()
  for (const r of records) {
    const d = parseDate(dateKey(r))
    if (!d) continue
    const iso = toISO(d)
    map.set(iso, (map.get(iso) ?? 0) + 1)
  }
  return Array.from(map.entries())
    .map(([timestamp, value]) => ({ timestamp, value }))
    .sort((a, b) => a.timestamp.localeCompare(b.timestamp))
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function getDashboardSummary(
  params: DashboardSummaryParams,
): Promise<DashboardSummaryResponse> {
  const allRecords = await loadRecords()

  const start = new Date(params.startDate + 'T00:00:00Z')
  const end   = new Date(params.endDate   + 'T23:59:59Z')

  // Filter records whose harvest_date falls within the range
  const filtered = allRecords.filter((r) => {
    const d = parseDate(r.harvest_date)
    if (!d) return false
    return d >= start && d <= end
  })

  // A fish is "expired" when its shelf_life date has passed the endDate
  const expired = filtered.filter((r) => {
    if (!r.shelf_life) return false
    const sl = parseDate(r.shelf_life)
    return sl !== null && sl <= end
  })

  // Scatter: one point per fish (price and quality)
  const avgPrice: ScatterPoint[] = filtered.map((r) => {
    const d = parseDate(r.harvest_date)!
    return { timestamp: toISO(d), value: r.price, species: r.species_name, region: r.harvest_region }
  }).sort((a, b) => a.timestamp.localeCompare(b.timestamp))

  const avgQuality: ScatterPoint[] = filtered
    .filter((r) => r.quality_score !== null)
    .map((r) => {
      const d = parseDate(r.harvest_date)!
      return { timestamp: toISO(d), value: r.quality_score as number, species: r.species_name, region: r.harvest_region }
    })
    .sort((a, b) => a.timestamp.localeCompare(b.timestamp))

  return {
    data: {
      num_harvested:    toTimeSeries(filtered.filter((r) => r.stage === 'HARVESTED'), (r) => r.harvest_date),
      num_expired:      toTimeSeries(expired, (r) => r.shelf_life),
      avg_quality:      avgQuality,
      avg_price:        avgPrice,
      total_count:      filtered.length,
      count_by_stage:   groupCount(filtered, (r) => r.stage),
      count_by_species: groupCount(filtered, (r) => r.species_name),
      count_by_region:  groupCount(filtered, (r) => r.harvest_region),
    },
  }
}
