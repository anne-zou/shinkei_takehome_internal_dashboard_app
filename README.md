# Shinkei Inventory Dashboard

An internal stakeholder-facing dashboard for monitoring fish inventory metrics. Built as a frontend-only React/TypeScript app with a mock API layer backed by local CSV data.

## Demo Video
[https://drive.google.com/file/d/1t1eEKbxa4JNGOLDYQLaRnHaZ2GU-ICe7/view?usp=sharing](https://drive.google.com/file/d/1t1eEKbxa4JNGOLDYQLaRnHaZ2GU-ICe7/view?usp=sharing)

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Features

- **Date range filter** — sticky header picker; all metrics update reactively
- **Total fish count** — highlighted stat card
- **Fish count by stage** — HARVESTED vs PROCESSED with proportion bars
- **Fish count by species** — Yellowfin Tuna, Sockeye Salmon, Pacific Halibut, Tilapia
- **Fish count by region** — breakdown by harvest region
- **Harvested fish by day** — line chart grouped by `harvest_date`
- **Expired fish by day** — line chart grouped by `shelf_life` expiration date
- **Quality / Harvest Date** — scatter plot; hover shows species, region, quality score
- **Price / Harvest Date** — scatter plot; hover shows species, region, price

## Project structure

```
src/
├── api/
│   └── MockServerApi.ts        # Mock GET /dashboard/summary
├── data/
│   └── shinkei_takehome_mock_data.csv
├── types/
│   └── index.ts                # Shared TypeScript interfaces
├── hooks/
│   └── useDashboardData.ts     # Data-fetching hook
└── components/
    ├── layout/
    │   └── Header.tsx           # Sticky header + date range picker
    ├── stats/
    │   ├── StatCard.tsx         # Single metric card
    │   └── BreakdownCard.tsx    # Proportional bar breakdown
    ├── charts/
    │   ├── FishLineChart.tsx    # Recharts line chart wrapper
    │   └── FishScatterPlot.tsx  # Recharts scatter chart wrapper
    └── dashboard/
        └── Dashboard.tsx        # Page root — assembles all sections
```

## Mock API

All data is served from `MockServerApi.ts`, which simulates the following endpoint:

```
GET /dashboard/summary?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
```

**Response shape:**
```json
{
  "data": {
    "num_harvested":    [{ "timestamp": "...", "value": 3 }],
    "num_expired":      [{ "timestamp": "...", "value": 1 }],
    "avg_quality":      [{ "timestamp": "...", "value": 92, "species": "...", "region": "..." }],
    "avg_price":        [{ "timestamp": "...", "value": 75.25, "species": "...", "region": "..." }],
    "total_count":      20,
    "count_by_stage":   [{ "label": "HARVESTED", "count": 10 }],
    "count_by_species": [{ "label": "Yellowfin Tuna", "count": 5 }],
    "count_by_region":  [{ "label": "Santa Barbara Channel, CA", "count": 5 }]
  }
}
```

**Expiration logic:** a fish is considered expired when its `shelf_life` date ≤ the query `endDate`. The expired-by-day chart uses `shelf_life` as the X-axis date.

## Tech stack

| Tool | Purpose |
|------|---------|
| [Vite](https://vitejs.dev) | Build tool |
| [React 18](https://react.dev) | UI framework |
| [TypeScript](https://www.typescriptlang.org) | Type safety |
| [Recharts](https://recharts.org) | Charts |
| [PapaParse](https://www.papaparse.com) | CSV parsing |
| CSS Modules | Component-scoped styles |

## Scripts

```bash
npm run dev      # Start dev server (http://localhost:5173)
npm run build    # Type-check + production build → dist/
npm run preview  # Serve the production build locally
```
