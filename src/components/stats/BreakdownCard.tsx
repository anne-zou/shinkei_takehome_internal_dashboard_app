import type { BreakdownEntry } from '@/types'
import styles from './BreakdownCard.module.css'

interface BreakdownCardProps {
  title: string
  entries: BreakdownEntry[]
  total: number
}

const BAR_COLORS = ['#fe620c', '#3b82f6', '#34d399', '#fbbf24', '#a78bfa', '#f87171']

export default function BreakdownCard({ title, entries, total }: BreakdownCardProps) {
  return (
    <div className={styles.card}>
      <h3 className={styles.title}>{title}</h3>
      <ul className={styles.list}>
        {entries.map((entry, i) => {
          const pct = total > 0 ? (entry.count / total) * 100 : 0
          const color = BAR_COLORS[i % BAR_COLORS.length]
          return (
            <li key={entry.label} className={styles.item}>
              <div className={styles.meta}>
                <span className={styles.dot} style={{ background: color }} />
                <span className={styles.itemLabel}>{entry.label}</span>
                <span className={styles.count}>{entry.count}</span>
              </div>
              <div className={styles.barTrack}>
                <div
                  className={styles.bar}
                  style={{ width: `${pct}%`, background: color }}
                />
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
