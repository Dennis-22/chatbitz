import { useNavigate } from "react-router-dom"
import styles from '../../css/leave-chat-modal.module.css'
import Modal, {ModalButtons} from "./Modal"
import { useUserContext, useChatContext, usePlaygroundContext } from '../../utils/hooks'
import { socketConstance } from '../../utils/constance'
import { _Connect } from "../../utils/types"
import { chatActions } from "../../utils/actions"
import { getItemFromStorage, setItemToSessionStorage } from "../../utils/helpers"


export default function LeaveChatModal() {
  const {userState:{user}} = useUserContext()
  const {socket, chatDispatch, chatState:{currentChat}} = useChatContext()
  const {toggleLeaveChat} = usePlaygroundContext()
  const navigation = useNavigate()

  const handleLeave = ()=>{
    let leaveProps = {chatId:currentChat, userId:user.id, username:user.username}
    socket?.emit(socketConstance.LEAVE_CHAT, leaveProps)
    let updateUserChats = getItemFromStorage("Chats").filter(chatId => chatId !== currentChat)
    setItemToSessionStorage("Chats", updateUserChats)
    chatDispatch({type:chatActions.LEAVE_CHAT, payload:currentChat})
    navigation('/connect', {state:{connectType:_Connect.create}})
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
          cancel={()=>toggleLeaveChat(false)}
          cancelText="Stay"
        />
      </div>
    </Modal>
  )
}
