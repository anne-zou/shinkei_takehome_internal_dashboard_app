import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import type { ScatterPoint } from '@/types'
import styles from './Chart.module.css'

interface FishScatterPlotProps {
  title: string
  data: ScatterPoint[]
  yLabel: string
  yFormatter?: (v: number) => string
}

const SPECIES_COLORS: Record<string, string> = {
  'Yellowfin Tuna':  '#fe620c',
  'Sockeye Salmon':  '#3b82f6',
  'Pacific Halibut': '#34d399',
  'Tilapia':         '#fbbf24',
}

const DEFAULT_COLOR = '#a78bfa'

function formatDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })
}

// Recharts needs numeric x-values for scatter; we convert ISO → epoch ms
function toEpoch(iso: string) {
  return new Date(iso).getTime()
}

export default function FishScatterPlot({
  title,
  data,
  yLabel,
  yFormatter = (v) => String(v),
}: FishScatterPlotProps) {
  // Group data by species for separate Scatter series (color per species)
  const speciesList = Array.from(new Set(data.map((d) => d.species)))

  const plotData = data.map((d) => ({
    x: toEpoch(d.timestamp),
    y: d.value,
    species: d.species,
  }))

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>{title}</h3>
      {data.length === 0 ? (
        <div className={styles.empty}>No data for selected range</div>
      ) : (
        <>
          {/* Manual legend */}
          <div className={styles.legend}>
            {speciesList.map((sp) => (
              <span key={sp} className={styles.legendItem}>
                <span
                  className={styles.legendDot}
                  style={{ background: SPECIES_COLORS[sp] ?? DEFAULT_COLOR }}
                />
                {sp}
              </span>
            ))}
          </div>

          <ResponsiveContainer width="100%" height={220}>
            <ScatterChart margin={{ top: 4, right: 16, left: -8, bottom: 0 }}>
              <CartesianGrid stroke="var(--color-border)" strokeDasharray="4 4" vertical={false} />
              <XAxis
                dataKey="x"
                type="number"
                domain={['auto', 'auto']}
                tickFormatter={(v) => formatDate(new Date(v).toISOString())}
                tick={{ fill: 'var(--color-text-muted)', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                scale="time"
              />
              <YAxis
                dataKey="y"
                type="number"
                tick={{ fill: 'var(--color-text-muted)', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={yFormatter}
                label={{
                  value: yLabel,
                  angle: -90,
                  position: 'insideLeft',
                  offset: 10,
                  style: { fill: 'var(--color-text-muted)', fontSize: 10 },
                }}
              />
              <Tooltip
                contentStyle={{
                  background: 'var(--color-surface-2)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '6px',
                  color: 'var(--color-text)',
                  fontSize: 12,
                }}
                cursor={{ strokeDasharray: '3 3', stroke: 'var(--color-border)' }}
                content={({ payload }) => {
                  if (!payload?.length) return null
                  const { x, y, species } = payload[0].payload as { x: number; y: number; species: string }
                  return (
                    <div style={{ padding: '8px 12px' }}>
                      <div style={{ color: 'var(--color-text-muted)', marginBottom: 4, fontSize: 11 }}>
                        {formatDate(new Date(x).toISOString())}
                      </div>
                      <div style={{ fontWeight: 600 }}>{species}</div>
                      <div style={{ color: SPECIES_COLORS[species] ?? DEFAULT_COLOR }}>
                        {yLabel}: {yFormatter(y)}
                      </div>
                    </div>
                  )
                }}
              />
              <Scatter data={plotData}>
                {plotData.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={SPECIES_COLORS[entry.species] ?? DEFAULT_COLOR}
                    fillOpacity={0.85}
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </>
      )}
    </div>
  )
}
