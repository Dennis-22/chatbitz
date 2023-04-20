import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import styles from '../../../css/popup-input.module.css'
import Modal from '../../global/Modal';


export default function PopupInput({close, message, handleChange, handleSendMessage}){
 
  return (
    <Modal>
      <div className={styles.container}>
        <div className={styles.head}>
          <p>Type more stuff here</p>
          <IconButton onClick={close}>
            <CloseRoundedIcon sx={{color:'rgb(143, 143, 143)'}}/>
          </IconButton>
        </div>

        <div className={styles.inputs}>
          <textarea 
            className={styles.textarea}
            placeholder="Type more messages"
            value={message}
            onChange={handleChange}
          />
        </div>

        <Button variant="contained" onClick={handleSendMessage} style={{width:"100%"}}>
          Send
        </Button>
      </div>
    </Modal>
  )
}