import {useState, useEffect} from 'react'
import Picker from 'emoji-picker-react';
import IconButton from '@mui/material/IconButton';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import EmojiEmotionsRoundedIcon from '@mui/icons-material/EmojiEmotionsRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import styles from '../../../css/popup-input.module.css'
import { useAppContext, useChatContext } from '../../../utils/hooks';

export default function PopupInput(){
  const {setShowPopupInput} = useAppContext()
  const {socket, currentChat, setMessages, sharedMessage, setSharedMessage} = useChatContext()
  const [showEmojis, setShowEmojis] = useState(false)
  const [message, setMessage] = useState('')


  const handleClose = ()=>{
    // set the message via shared message
    setSharedMessage(message)
    setShowPopupInput(false)
  }
  
  const onEmojiClick = (emoji)=>{
    setMessage(message + emoji.emoji)
  }

  const handleSendMessage = ()=>{
    if(!message) return null
    let msgData = {
      username:user.username, userId:user.id, 
      accentColor:user.accentColor,
      message, id:idGenerator(), //id will mismatch with the server but its ok
      chatId:currentChat,
      time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes() 
    }
    socket.emit(socketConstance.SEND_MESSAGE, msgData)
    setMessages(prev => [...prev, msgData])
    setMessage('')
  }

  useEffect(()=>{
    // set message to the shared message
    setMessage(sharedMessage)
  },[])

  return (
    <div className={styles.container}>
        <div className={styles.wrap}>
          <div className={styles.head}>
            <p>Type more stuff here</p>
            <IconButton onClick={handleClose}>
              <CloseRoundedIcon sx={{color:'rgb(143, 143, 143)'}}/>
            </IconButton>
          </div>

          <div className={styles.inputs}>
            <textarea 
              className={styles.textarea}
              placeholder="Type more messages"
              value={message}
              onChange={(e)=>setMessage(e.target.value)}
            />

            {showEmojis && <EmojiPicker onEmojiClick={onEmojiClick}/>}

          </div>


          <div className={styles.utils}>
            <IconButton onClick={()=>setShowEmojis(!showEmojis)} title="emojis" style={{backgroundColor:"#1d1d1d"}}>
              <EmojiEmotionsRoundedIcon sx={{color:"#eafc2b"}}/>
            </IconButton>

            <IconButton onClick={handleSendMessage} title="send message" style={{backgroundColor:"#1d1d1d"}}>
              <SendRoundedIcon sx={{color:"#eee"}}/>
            </IconButton>
          </div>
        </div>
    </div>
  )
}


function EmojiPicker({onEmojiClick}){
  return <div className={styles.emojiPicker}>
      <Picker 
        onEmojiClick={onEmojiClick} 
        theme="dark"
        lazyLoadEmojis={true}
        autoFocusSearch={false}
        width="100%"
        height="100%"
      />
  </div>
}