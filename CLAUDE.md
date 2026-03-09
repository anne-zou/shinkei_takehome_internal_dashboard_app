# Shinkei Inventory Dashboard — Claude Context

## Project overview
Frontend-only React/TypeScript dashboard for internal stakeholders. No real backend — all data is served by a mock API layer that parses a local CSV file.

## Tech stack
- **Vite** — build tool
- **React 18 + TypeScript** — UI framework
- **Recharts** — charting (LineChart, ScatterChart)
- **PapaParse** — CSV parsing
- **CSS Modules** — component-scoped styles (no Tailwind, no CSS-in-JS)

## Key files
| Path | Purpose |
|------|---------|
| `src/data/shinkei_takehome_mock_data.csv` | Source of truth for all dashboard data |
| `src/api/MockServerApi.ts` | Mock `GET /dashboard/summary` — parses CSV, filters by date range, computes all metrics |
| `src/types/index.ts` | Shared TypeScript interfaces |
| `src/hooks/useDashboardData.ts` | Data-fetching hook (wraps the mock API) |
| `src/components/dashboard/Dashboard.tsx` | Root page — assembles all sections |
| `src/components/layout/Header.tsx` | Sticky header with date range picker |
| `src/components/stats/StatCard.tsx` | Single metric card |
| `src/components/stats/BreakdownCard.tsx` | Horizontal bar breakdown (stage / species / region) |
| `src/components/charts/FishLineChart.tsx` | Recharts line chart wrapper |
| `src/components/charts/FishScatterPlot.tsx` | Recharts scatter chart wrapper |

## Data model
The CSV has 20 fish records with these fields:
- `fish_id`, `price`, `stage` (`HARVESTED` | `PROCESSED`), `species_name`, `harvest_weight_kg`
- `harvest_date` — `M/D/YYYY`; used as X-axis for harvested/scatter charts
- `harvest_region`
- `shelf_life` — `M/D/YYYY`; expiration date for PROCESSED fish; used as X-axis for expired chart
- `quality_score` — only present for PROCESSED fish
- `optimal_consumption_date`, `processed_img_url` — present but not displayed

## Mock API logic
- **Filtering**: records are included if `harvest_date` falls within `[startDate, endDate]`
- **Expired**: a filtered fish is expired if its `shelf_life` ≤ `endDate`
- **`num_expired` X-axis**: grouped by `shelf_life` (not `harvest_date`)
- **Scatter points**: one dot per fish; tooltip shows date, species, region, and value

## Design system
Defined in `src/index.css` as CSS custom properties:
- `--color-bg`: `#07091a` (dark navy page background)
- `--color-surface`: `#0d1230` (card background)
- `--color-accent`: `#fe620c` (Shinkei orange)
- `--color-text-muted`: `#8892b0`
- Font: Inter

## Dev commands
```bash
npm run dev      # start dev server
npm run build    # type-check + production build
npm run preview  # preview production build
```

## Conventions
- One CSS Module per component, co-located in the same folder
- All chart components accept plain data arrays — no API calls inside them
- `MockServerApi.ts` is the only file that touches the CSV; keep data logic there
- Commit in digestible increments; get approval before proceeding to next feature
