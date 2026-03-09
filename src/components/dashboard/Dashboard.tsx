import { useState } from 'react'
import Header from '@/components/layout/Header'
import StatCard from '@/components/stats/StatCard'
import BreakdownCard from '@/components/stats/BreakdownCard'
import FishLineChart from '@/components/charts/FishLineChart'
import FishScatterPlot from '@/components/charts/FishScatterPlot'
import { useDashboardData } from '@/hooks/useDashboardData'
import styles from './Dashboard.module.css'

// Default range: last 7 days from the most recent data (2026-03-01 to 2026-03-07)
const DEFAULT_START = '2026-03-01'
const DEFAULT_END   = '2026-03-09'

export default function Dashboard() {
  const [startDate, setStartDate] = useState(DEFAULT_START)
  const [endDate,   setEndDate]   = useState(DEFAULT_END)

  const { data, loading, error } = useDashboardData(startDate, endDate)

  return (
    <div className={styles.root}>
      <Header
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
      />

      <main className={styles.main}>
        {error && (
          <div className={styles.error}>Failed to load data: {error}</div>
        )}

        {loading && !data && (
          <div className={styles.loading}>Loading…</div>
        )}

        {data && (
          <>
            {/* ── Top stat cards ─────────────────────────────────── */}
            <section className={styles.statRow}>
              <StatCard label="Total Fish" value={data.total_count} accent />
            </section>

            {/* ── Breakdowns ─────────────────────────────────────── */}
            <section className={styles.breakdownRow}>
              <BreakdownCard
                title="Fish Count by Stage"
                entries={data.count_by_stage}
                total={data.total_count}
              />
              <BreakdownCard
                title="Fish Count by Species"
                entries={data.count_by_species}
                total={data.total_count}
              />
              <BreakdownCard
                title="Fish Count by Region"
                entries={data.count_by_region}
                total={data.total_count}
              />
            </section>

            {/* ── Line charts ────────────────────────────────────── */}
            <section className={styles.chartRow}>
              <FishLineChart
                title="Harvested Fish by Day"
                data={data.num_harvested}
                color="#fe620c"
              />
              <FishLineChart
                title="Expired Fish by Day"
                data={data.num_expired}
                color="#f87171"
              />
            </section>

            {/* ── Scatter plots ──────────────────────────────────── */}
            <section className={styles.chartRow}>
              <FishScatterPlot
                title="Fish Quality / Harvest Date"
                data={data.avg_quality}
                yLabel="Quality Score"
              />
              <FishScatterPlot
                title="Fish Price / Harvest Date"
                data={data.avg_price}
                yLabel="Price (USD)"
                yFormatter={(v) => `$${v.toFixed(0)}`}
              />
            </section>
          </>
        )}
      </main>
    </div>
  )
}
