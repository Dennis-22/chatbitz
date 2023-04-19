import { useEffect, useRef } from 'react';
import styles from '../../../css/messages.module.css'
import {defMsgsIds} from '../../../utils/constance'
import {useChatContext, useUserContext} from '../../../utils/hooks.js'

export default function Messages() {
  const {chatState} = useChatContext()
  const messages = chatState.messages.find(chat=> chat.chatId === chatState.currentChat).messages
  const bottomRef = useRef(null);

  // useEffect(() => {
  //   // 👇️ simulate chat messages flowing in
  //   setInterval(
  //     () =>
  //       setMessages(current => [
  //         ...current,
  //         {
  //           message:'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Porro, quaerat eum id obcaecati, magnam voluptatum dolorem sunt, omnis sed consectetur necessitatibus blanditiis ipsa? Cumque architecto, doloribus mollitia velit non sint!',
  //           id:'123',
  //           userId:'45',
  //           accentColor:'pink',
  //           username:'unknowwn',
  //           time:'10:30'
  //         }
  //       ]),
  //     1000,
  //   );
  // }, []);

  useEffect(() => {
    // 👇️ scroll to bottom every time messages change
    bottomRef.current?.scrollIntoView({behavior: 'smooth'});
  }, [messages]);

  return (
    <div className={styles.messages}>
      {messages.map((msg, idx) => <Message key={idx} {...msg}/>)}
      <div ref={bottomRef} />
    </div>
  )
}


function Message({id: msgId, message, userId, username, accentColor, time, image}){
  const {userState:{user}} = useUserContext()

  return <div
    className={
      defMsgsIds.includes(userId) ? styles.defMsg : 
      userId == user.id ? styles.uMsg : styles.pMsg
    }
  >
    {
      !defMsgsIds.includes(userId) && 
      userId !== user.id && 
      <p style={{color:accentColor}} className={styles.username}>{username}</p>
    }
    <p className={defMsgsIds.includes(userId) ? styles.defMsgText : styles.msgText}>
      {message}
    </p>
    {!defMsgsIds.includes(userId) && <p className={styles.msgTime}>{time}</p>}
  </div>
}