import styles from '../../../css/chats.module.css'
import { useAppContext, useChatContext } from '../../../utils/hooks'
import ProfilePhoto from '../../global/ProfilePhoto'

// export default function ChatDetails() {
//   const {chats} = useChatContext()
  
//   return (
//     <div className={styles.body}>
//       <h1 className={styles.appName}>ChatBits</h1>

//       <section className={styles.chatsDisplay}>
//         <p>Current chats</p>

//         <div className={styles.chatsWrapper}>
//           {
//             chats.map((chat, idx) => <Chat key={idx} {...chat} />)
//           }
//         </div>
//       </section>  
//     </div>
//   )
// }

export default function Chats(){
  return <div className={styles.body}>
    <Content />
  </div>
}


export function MobileChats(){
  const {setShowMobileChats} = useAppContext()
  return <div className={styles.mobChat}>
    <div className={styles.mobChatContent}>
      <Content />
    </div>

    <div className={styles.mobChatEmpty} onClick={()=>setShowMobileChats(false)}/>
  </div>
}

function Content(){
  const {chats, currentChat} = useChatContext()
  const currentChatId = currentChat.id
  return <>
    <h1 className={styles.appName}>ChatBits</h1>
    <section className={styles.chatsDisplay}>
      <p>Current chats</p>

      <div className={styles.chatsWrapper}>
        {
          chats.map((chat, idx) => <Chat key={idx} {...chat} currentChatId={currentChatId}/>)
        }
      </div>
    </section>  
  </>
}

function Chat({id, chatName, members, currentChatId}){
  return <div className={id === currentChatId ? styles.chatSelected : styles.chat}>
    <ProfilePhoto name={chatName}/>
    <div className={styles.textWrap}>
      <p className={styles.chatName}>{chatName}</p>
      <p className={styles.text}>{members.length} participants</p>
    </div>
  </div>
}