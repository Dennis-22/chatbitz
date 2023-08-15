import { useEffect, useRef } from 'react';
import styles from '../../../css/messages.module.css'
import {defMsgTypes} from '../../../utils/constance'
import {useChatContext, useUserContext} from '../../../utils/hooks.js'

export default function Messages() {
  const {chatState} = useChatContext()
  const messages = chatState.messages.find(msg=> msg.chatId === chatState.currentChat).messages
  const bottomRef = useRef(null);

  useEffect(() => {
    // 👇️ scroll to bottom every time messages change
    bottomRef.current?.scrollIntoView({behavior: 'smooth'});
  }, [messages]);

  return (
    <div className={styles.messages}>
      {messages.map((msg) => <Message key={msg.id} {...msg}/>)}
      <div ref={bottomRef} />
    </div>
  )
}


function Message({id: msgId, type, message, userId, username, accentColor, time, image}){
  const {userState:{user}} = useUserContext()

  return <div
    className={
      defMsgTypes.includes(type) ? styles.defMsg : 
      userId == user.id ? styles.uMsg : styles.pMsg
    }
  >
    {
      !defMsgTypes.includes(type) && 
      userId !== user.id && 
      <p style={{color:accentColor}} className={styles.username}>{username}</p>
    }
    <p className={defMsgTypes.includes(type) ? styles.defMsgText : styles.msgText}>
      {message}
    </p>
    {!defMsgTypes.includes(type) && <p className={styles.msgTime}>{time}</p>}
  </div>
}