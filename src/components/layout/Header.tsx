import styles from './Header.module.css'

interface HeaderProps {
  startDate: string
  endDate: string
  onStartDateChange: (value: string) => void
  onEndDateChange: (value: string) => void
}

export default function Header({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <svg className={styles.logo} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="40" height="40" rx="8" fill="#080c5e" />
          <path
            d="M7 20 C11 13, 16 10, 20 20 C24 30, 29 27, 33 20"
            stroke="#fe620c"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
        <div>
          <span className={styles.brandName}>Shinkei</span>
          <span className={styles.brandSub}>Inventory Dashboard</span>
        </div>
      </div>

      <div className={styles.controls}>
        <div className={styles.dateField}>
          <label className={styles.label}>From</label>
          <input
            type="date"
            className={styles.input}
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
          />
        </div>
        <span className={styles.dateSep}>—</span>
        <div className={styles.dateField}>
          <label className={styles.label}>To</label>
          <input
            type="date"
            className={styles.input}
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
          />
        </div>
      </div>
    </header>
  )
}
