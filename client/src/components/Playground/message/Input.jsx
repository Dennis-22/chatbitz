import { useState } from 'react';
import Picker from 'emoji-picker-react';
import IconButton from '@mui/material/IconButton';
import EmojiEmotionsRoundedIcon from '@mui/icons-material/EmojiEmotionsRounded';
import OpenInFullRoundedIcon from '@mui/icons-material/OpenInFullRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import styles from '../../../css/message.module.css'
import { useAppContext, useChatContext } from '../../../utils/hooks';
import {idGenerator} from '../../../utils/helpers'
import { socketConstance, screenSizes } from '../../../utils/constance';

export default function Input() {
  const {deviceWidth, user} = useAppContext()
  const {socket, currentChat, setMessages} = useChatContext()
  const [message, setMessage] = useState('')
  const [showEmojiPopup, setShowEmojiPopup] = useState(false)

  const handleChange = (e)=>{
    setMessage(e.target.value)
    socket?.emit(socketConstance.TYPING, {id:currentChat.id, username:user.username})
  }


  const handleSendMessage = ()=>{
    if(!message) return null
    let msgData = {
      username:user.username, userId:user.id, 
      accentColor:user.accentColor,
      message, id:idGenerator(), //id will mismatch with the server but its ok
      chatId:currentChat.id,
      time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes() 
    }
    socket.emit(socketConstance.SEND_MESSAGE, msgData)
    setMessages(prev => [...prev, msgData])
    setMessage('')
  }

  // const onEmojiClick = (event, emojiObject) => setMessage(message + emojiObject.emoji)
  const onEmojiClick = (emoji)=>{
    setMessage(message + emoji.emoji)
  }

  return (
    <div className={styles.inputContainer}>
      {showEmojiPopup && <EmojiPicker onEmojiClick={onEmojiClick}/>}
      <div className={styles.input}>
        <div className={styles.inputWrap}>
          <input 
            value={message}
            onChange={handleChange} 
            className={styles.textInput} 
            placeholder="Type a message"
            onKeyPress={(e)=>{if(e.key === 'Enter'){handleSendMessage()}}}
          />
          <IconButton title="expand input">
            <OpenInFullRoundedIcon sx={{color:"#6f4c5b"}} className={styles.inputIcon} 
              fontSize={deviceWidth > screenSizes.small ? 'medium' : 'small'}
            />
          </IconButton>
        </div>

        <div className={styles.inputUtils}>
            <IconButton title="emojis" onClick={()=>setShowEmojiPopup(!showEmojiPopup)}>
              <EmojiEmotionsRoundedIcon sx={{color:"#eafc2b"}} className={styles.inputIcon} 
                fontSize={deviceWidth > screenSizes.small ? 'medium' : 'small'}
              />
            </IconButton>
            <IconButton onClick={handleSendMessage} title="send message">
              <SendRoundedIcon sx={{color:"#eee"}} className={styles.inputIcon} 
                fontSize={deviceWidth > screenSizes.small ? 'medium' : 'small'}
              />
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
      />
  </div>
}