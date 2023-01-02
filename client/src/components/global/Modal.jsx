import { useNavigate } from "react-router-dom"
import styles from '../../css/modal.module.css'
import { useAppContext, useChatContext } from '../../utils/hooks'
import { socketConstance } from '../../utils/constance'

export default function Modal() {
  const {user} = useAppContext()
  const {socket, currentChat, setLeaveChat} = useChatContext()
  const navigation = useNavigate()

  const handleCancel = ()=>{
    setLeaveChat({show:false, chatId:null})
  }

  const handleLeave = ()=>{
    let leaveProps = {id:currentChat, userId:user.id, username:user.username}
    socket?.emit(socketConstance.LEAVE_CHAT, leaveProps)
    setLeaveChat({show:false, chatId:null})
    navigation('/join')
  }

  return (
    <div className={styles.modal}>
        <div className={styles.wrap}>
            <div className={styles.content}>
                <p className={styles.title}>Leave Chat</p>
                <p className={styles.text}>Everyone will notice you are gone and you would have to rejoin to continue chatting here</p>
            </div>

            <div className={styles.btns}>
                <button id={styles.cancel} onClick={handleCancel} className={styles.btn}>Stay</button>
                <button id={styles.ok} onClick={handleLeave} className={styles.btn}>Leave</button>
            </div>
        </div>
    </div>
  )
}
