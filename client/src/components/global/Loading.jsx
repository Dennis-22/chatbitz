import styles from '../../css/loading.module.css'
import CircularProgress from '@mui/material/CircularProgress';

export default function Loading(){
  return (
    <div className={styles.loading}>
        <div className={styles.wrap}>
            <CircularProgress sx={{color:'rgba(255, 255, 255, 0.863)'}}/>
        </div>
    </div>
  )
}

export function InLoading(){
  return <div className={styles.inLoading}>
    <CircularProgress sx={{color:'rgba(255, 255, 255, 0.863)'}}/>
  </div>
} 