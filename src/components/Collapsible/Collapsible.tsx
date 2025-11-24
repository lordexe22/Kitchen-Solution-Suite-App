import { useState, type ReactNode } from 'react'
import styles from './Collapsible.module.css'

interface CollapsibleProps {
  title: string
  children?: ReactNode
}

const Collapsible = ({ title, children }: CollapsibleProps) => {
  const [open, setOpen] = useState(true)

  return (
    <div className={styles.collapsible}>
      <button className={styles.header} onClick={() => setOpen((v) => !v)}>
        <span>{title}</span>
        <span className={styles.chev}>{open ? '▾' : '▸'}</span>
      </button>
      {open && <div className={styles.body}>{children}</div>}
    </div>
  )
}

export default Collapsible
