import styles from '../../../css/chats.module.css'
import { useChatContext } from '../../../utils/hooks'
import ProfilePhoto from '../../global/ProfilePhoto'
import { usePlaygroundContext } from '../../../utils/hooks'
import {ToggleMobileChats} from '../../../context/Playground/playgroundDispatches'
import { chatActions } from '../../../utils/actions'
import { memo } from 'react'

export function LargeScreenChats(){
  return <div className={styles.body}>
    <Content />
  </div>
}

export function MobileChats(){
  const {playDispatch} = usePlaygroundContext()
  return <div className={styles.mobChat}>
    <div className={styles.mobChatContent}>
      <Content />
    </div>

    <div 
      className={styles.mobChatEmpty} 
      onClick={()=>ToggleMobileChats(playDispatch, false)}
    />
  </div>
}

function Content(){
  const {chatDispatch, chatState:{chats, currentChat}} = useChatContext()

  return <>
    <p className={styles.appName}>ChatBits</p>
    <section className={styles.chatsDisplay}>
      <p className={styles.text}>Current chats</p>
      <div className={styles.chatsWrapper}>
        {
          chats.map((chat, idx) => <MemoizedChat 
              key={idx} 
              {...chat} 
              currentChat={currentChat}
              setCurrentChat={(chatId)=> (chatDispatch({type:chatActions.SET_CURRENT_CHAT, payload:chatId}))}
            />
          )
        }
      </div>
    </section>  
  </>
}

const MemoizedChat = memo(Chat)

function Chat({id, chatName, members, currentChat, setCurrentChat}){
  return <div onClick={()=>setCurrentChat(id)} className={id === currentChat ? styles.chatSelected : styles.chat}>
    <ProfilePhoto name={chatName}/>
    <div className={styles.textWrap}>
      <p className={styles.chatName}>{chatName}</p>
      <p className={styles.text}>{members.length} participants</p>
    </div>
  </div>
}