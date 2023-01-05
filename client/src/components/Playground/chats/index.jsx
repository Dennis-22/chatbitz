// import { useEffect } from 'react'
import styles from '../../../css/chats.module.css'
// import { api } from '../../../utils/constance'
// import { requestMaker } from '../../../utils/helpers'
import { useAppContext, useChatContext } from '../../../utils/hooks'
import { InLoading } from '../../global/Loading'
import Error from '../../global/Error'
import ProfilePhoto from '../../global/ProfilePhoto'


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
  const {user} = useAppContext()
  const {chats, setChats, currentChat, setCurrentChat} = useChatContext()
  const currentChatId = currentChat.id
  const {loading, fetched, error, chatsData} = chats

  // WORKING ON REFRESH *******
  // const getUserChats = async()=>{
  //   console.log('getting chats')
  //   setChats({fetched:false, loading:true, error:false, chatsData:[]})
  //   try {
  //     let chats = await requestMaker('GET', `${api.getUserChats}/${user.id}`)
  //     console.log('chats', chats)
  //     setChats({fetched:true, loading:false, error:false, chatsData:chats.data || []})
  //     // set current chat to the first chat element
  //     setCurrentChat(chats.data[0].id)
  //   } catch (error) {
  //     console.log(error)
  //     setChats({fetched:false, loading:false, error:true, chatsData:[]})
  //   }
  // }

  // useEffect(()=>{
  //   // fetch user chats if it has not been fetched (useful when user refreshes)
  //   if(!fetched) getUserChats()
  // },[])

  // *******

  return <>
    <p className={styles.appName}>ChatBits</p>
    <section className={styles.chatsDisplay}>
      <p className={styles.text}>Current chats</p>

      {
        loading ? <InLoading /> : error ? 
        <Error text="Failed to fetch chats" retryFn={getUserChats}/> :
        <div className={styles.chatsWrapper}>
          {
            chatsData.map((chat, idx) => <Chat key={idx} {...chat} currentChatId={currentChatId}/>)
          }
        </div>
      }

 
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