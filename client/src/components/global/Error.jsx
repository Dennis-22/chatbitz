import Button from '@mui/material/Button';
import DoNotDisturbRounded from '@mui/icons-material/DoNotDisturbRounded'
import styles from '../../css/error.module.css'
import Modal from './Modal'

export function ModalError({text, btnFn, btnText}){
  return <Modal>
    <div className={styles.wrap}>
      <DoNotDisturbRounded fontSize="large" sx={{color:"rgba(143, 143, 143, .6)"}}/>
      <p className={styles.text}>{text || 'Failed to get data'}</p>
      <Button variant="contained" onClick={btnFn}>
        {btnText || "Retry"}
      </Button>
    </div>
  </Modal>
}
