import CircularProgress from '@mui/material/CircularProgress';
import styles from '../../css/loading.module.css'
import Modal from './Modal';

export function ModalLoading(){
  return <Modal>
    <div className={styles.wrap}>
      <CircularProgress />
    </div>
  </Modal>
}

export function InLoading(){
  return <div className={styles.inLoading}>
    <CircularProgress sx={{color:'rgba(255, 255, 255, 0.863)'}}/>
  </div>
} 