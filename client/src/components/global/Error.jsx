import Button from '@mui/material/Button';
import styles from '../../css/error.module.css'

export default function Error({text, retryFn}) {
  return (
    <div className={styles.error}>
        <p className={styles.text}>{text || 'Failed to get data'}</p>
        <Button 
            variant="contained" 
            onClick={retryFn}
            style={{marginTop:30}}
        >
            Retry
        </Button>
    </div>
  )
}
