import { useState } from 'react';
import Picker from 'emoji-picker-react';
import IconButton from '@mui/material/IconButton';
import EmojiEmotionsRoundedIcon from '@mui/icons-material/EmojiEmotionsRounded';
import OpenInFullRoundedIcon from '@mui/icons-material/OpenInFullRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import styles from '../../../css/message.module.css'
import { useAppContext, useChatContext, useUserContext } from '../../../utils/hooks';
import {idGenerator} from '../../../utils/helpers'
import { socketConstance, screenSizes } from '../../../utils/constance';
import { chatActions } from '../../../utils/actions';

export default function Input() {
  const {deviceWidth, setShowPopupInput} = useAppContext()
  const {userState:{user}} = useUserContext()
  const {chatDispatch, socket, chatState:{currentChat}} = useChatContext()
  const [message, setMessage] = useState('')
  const [showEmojiPopup, setShowEmojiPopup] = useState(false)

  const handleChange = (e)=>{
    // setMessage(e.target.value)
    // socket?.emit(socketConstance.TYPING, {id:currentChat.id, username:user.username})
  }

  const handleShowPopupInput = ()=>{
    // setSharedMessage(message)
    // setShowPopupInput(true)
  }

  const handleSendMessage = ()=>{
    // if(!message) return null
    let msgData = {
      // username:user.username, userId:user.id, 
      // accentColor:user.accentColor,
      username:"ama",
      accentColor:"red",
      message, id:idGenerator(), //id will mismatch with the server but its ok
      chatId:currentChat,
      time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes() 
    }
    // socket.emit(socketConstance.SEND_MESSAGE, msgData)
    chatDispatch({type:chatActions.ADD_MESSAGE, payload:{id:currentChat, message:msgData}})
    setMessage("")
  }

  // const onEmojiClick = (event, emojiObject) => setMessage(message + emojiObject.emoji)
  const onEmojiClick = (emoji)=>{
    setMessage(message + emoji.emoji)
  }

  return (
    <>
      <div className={styles.inputContainer}>
        {showEmojiPopup && <EmojiPicker onEmojiClick={onEmojiClick}/>}
        <div className={styles.input}>
          <div className={styles.inputWrap}>
            <input
              value={message}
              onChange={(e)=>setMessage(e.target.value)} 
              className={styles.textInput} 
              placeholder="Type a message"
              onKeyDown={(e)=>{if(e.key === 'Enter'){handleSendMessage()}}}
            />
            <IconButton onClick={handleShowPopupInput} title="expand input">
              <OpenInFullRoundedIcon sx={{color:"#6f4c5b"}} className={styles.inputIcon} 
                fontSize={deviceWidth > screenSizes.small ? 'medium' : 'small'}
              />
            </IconButton>
          </div>

          <div className={styles.inputUtils}>
              <IconButton title="emojis" onClick={()=>setShowEmojiPopup(!showEmojiPopup)}>
                <EmojiEmotionsRoundedIcon sx={{color:"#c4d325"}} className={styles.inputIcon} 
                  fontSize={deviceWidth > screenSizes.small ? 'medium' : 'small'}
                />
              </IconButton>
              <IconButton onClick={handleSendMessage} title="send message">
                <SendRoundedIcon sx={{color:"#3a8be0"}} className={styles.inputIcon} 
                  fontSize={deviceWidth > screenSizes.small ? 'medium' : 'small'}
                />
              </IconButton>
          </div>
        </div>
    </div>
  </>
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