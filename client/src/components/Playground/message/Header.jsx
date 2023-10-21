import { useState, useEffect } from 'react';
import IconButton from '@mui/material/IconButton';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import ExitToAppRoundedIcon from '@mui/icons-material/ExitToAppRounded';
import GroupRoundedIcon from '@mui/icons-material/GroupRounded';
import styles from '../../../css/message.module.css'
import ProfilePhoto from '../../global/ProfilePhoto'
import { useAppContext, useChatContext, usePlaygroundContext } from '../../../utils/hooks';
import { screenSizes } from '../../../utils/constance';

export default function Header() {
  const {deviceWidth} = useAppContext()
  const {chatState:{chats, currentChat, peopleTyping}} = useChatContext()
  const {toggleMobileChats, toggleLeaveChat, toggleChatDetails} = usePlaygroundContext()
  const [typing, setTyping] = useState("")

  const chat = chats.find(chat => chat.id === currentChat)
  const {chatName, members} = chat


  const handleOpenMobileChats = ()=>{
    // check if the device width is greater than small size before showing
    if(deviceWidth <= screenSizes.large) toggleMobileChats(true)
    return null
  }

  useEffect(()=>{
    const namesOfPeopleTyping = peopleTyping.map(p => p.username)
    setTyping(()=>{
      if(namesOfPeopleTyping.length > 0){
        return `${namesOfPeopleTyping.join(', ')} ${namesOfPeopleTyping.length > 1 ? "are" : "is"} typing`
      }
      return "" 
    })
  },[peopleTyping])

  return (
    <div className={styles.header}>
        <div className={styles.head}>
          {
            deviceWidth <= screenSizes.small &&
            <IconButton onClick={handleOpenMobileChats} style={{marginRight:'5px'}}>
              <MenuRoundedIcon sx={{color:"rgb(143, 143, 143)"}}/>
            </IconButton>
          }
          <div onClick={()=>toggleChatDetails(true)} className={styles.details}>
            <ProfilePhoto name={chatName} size={36}/>
            <div className={styles.detail}>
              <p className={styles.name} title="Chat title">{chatName}</p>
              <p className={typing ? styles.typingShow : styles.typingHide}>A is typing</p>
            </div>
          </div>

          <IconButton title="Leave chat" onClick={()=>toggleLeaveChat(true)}>
            <ExitToAppRoundedIcon sx={{color:'rgb(143, 143, 143)'}}
              fontSize={deviceWidth > screenSizes.small ? 'medium' : 'small'}
            />
          </IconButton>
    
        </div>

        <div className={styles.membersWrap}>
          <GroupRoundedIcon sx={{color:"rgb(143, 143, 143)"}} fontSize="small"/>
          <p className={styles.members}>{members.length} {members.length === 1 ? "member" : "members"}</p>
        </div>
    </div>

  )
}
