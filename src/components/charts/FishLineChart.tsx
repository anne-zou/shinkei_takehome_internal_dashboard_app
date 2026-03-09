import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import type { TimeSeriesPoint } from '@/types'
import styles from './Chart.module.css'

interface FishLineChartProps {
  title: string
  data: TimeSeriesPoint[]
  color: string
  yLabel?: string
}

function formatDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })
}

export default function FishLineChart({ title, data, color, yLabel }: FishLineChartProps) {
  return (
    <div className={styles.card}>
      <h3 className={styles.title}>{title}</h3>
      {data.length === 0 ? (
        <div className={styles.empty}>No data for selected range</div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={data} margin={{ top: 4, right: 16, left: -8, bottom: 0 }}>
            <CartesianGrid stroke="var(--color-border)" strokeDasharray="4 4" vertical={false} />
            <XAxis
              dataKey="timestamp"
              tickFormatter={formatDate}
              tick={{ fill: 'var(--color-text-muted)', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fill: 'var(--color-text-muted)', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              label={
                yLabel
                  ? {
                      value: yLabel,
                      angle: -90,
                      position: 'insideLeft',
                      offset: 10,
                      style: { fill: 'var(--color-text-muted)', fontSize: 10 },
                    }
                  : undefined
              }
            />
            <Tooltip
              contentStyle={{
                background: 'var(--color-surface-2)',
                border: '1px solid var(--color-border)',
                borderRadius: '6px',
                color: 'var(--color-text)',
                fontSize: 12,
              }}
              labelFormatter={formatDate}
              formatter={(value: number) => [value, 'Count']}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2.5}
              dot={{ r: 4, fill: color, strokeWidth: 0 }}
              activeDot={{ r: 6, fill: color }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
