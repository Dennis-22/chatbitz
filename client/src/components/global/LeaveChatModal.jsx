import { useNavigate } from "react-router-dom"
import styles from '../../css/leave-chat-modal.module.css'
import Modal, {ModalButtons} from "./Modal"
import { useAppContext, useChatContext } from '../../utils/hooks'
import { socketConstance } from '../../utils/constance'

export default function LeaveChatModal() {
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
    <Modal>
      <div className={styles.container}>
        <div className={styles.content}>
            <p className={styles.title}>Leave Chat</p>
            <p className={styles.text}>Everyone will notice you are gone and you would have to rejoin to continue chatting here</p>
        </div>

        <ModalButtons 
          activity={handleLeave}
          activityText="Leave"
          cancel={handleCancel}
          cancelText="Stay"
        />
      </div>
    </Modal>
  )
}
