import styles from './StatCard.module.css'

interface StatCardProps {
  label: string
  value: number | string
  accent?: boolean
}

export default function StatCard({ label, value, accent = false }: StatCardProps) {
  return (
    <div className={`${styles.card} ${accent ? styles.accent : ''}`}>
      <span className={styles.label}>{label}</span>
      <span className={styles.value}>{value}</span>
    </div>
  )
}
