import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import type { ScatterPoint } from '@/types'
import styles from './Chart.module.css'

interface FishScatterPlotProps {
  title: string
  data: ScatterPoint[]
  yLabel: string
  yFormatter?: (v: number) => string
}

const DOT_COLOR = '#fe620c'

function formatDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })
}

function toEpoch(iso: string) {
  return new Date(iso).getTime()
}

export default function FishScatterPlot({
  title,
  data,
  yLabel,
  yFormatter = (v) => String(v),
}: FishScatterPlotProps) {
  const plotData = data.map((d) => ({
    x: toEpoch(d.timestamp),
    y: d.value,
    species: d.species,
    region: d.region,
  }))

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>{title}</h3>
      {data.length === 0 ? (
        <div className={styles.empty}>No data for selected range</div>
      ) : (
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
                const { x, y, species, region } = payload[0].payload as { x: number; y: number; species: string; region: string }
                return (
                  <div style={{ padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <div style={{ color: 'var(--color-text-muted)', fontSize: 11 }}>{formatDate(new Date(x).toISOString())}</div>
                    <div style={{ fontWeight: 600 }}>{species}</div>
                    <div style={{ color: 'var(--color-text-muted)', fontSize: 12 }}>{region}</div>
                    <div style={{ color: DOT_COLOR, marginTop: 2 }}>{yLabel}: {yFormatter(y)}</div>
                  </div>
                )
              }}
            />
            <Scatter data={plotData} fill={DOT_COLOR} fillOpacity={0.8} />
          </ScatterChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
