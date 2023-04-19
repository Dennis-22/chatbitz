import IconButton from '@mui/material/IconButton';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import ExitToAppRoundedIcon from '@mui/icons-material/ExitToAppRounded';
import GroupRoundedIcon from '@mui/icons-material/GroupRounded';
import styles from '../../../css/message.module.css'
import ProfilePhoto from '../../global/ProfilePhoto'
import { useAppContext, useChatContext, usePlaygroundContext } from '../../../utils/hooks';
import { ToggleMobileChats, ToggleLeaveChat } from '../../../context/Playground/playgroundDispatches';
import { screenSizes } from '../../../utils/constance';

export default function Header() {
  const {deviceWidth} = useAppContext()
  const {chatState:{chats, currentChat, peopleTyping}, } = useChatContext()
  const {playDispatch} = usePlaygroundContext()
  // const {getCurrentChatDetails, setLeaveChat, peopleTyping} = useChatContext()

  const chat = chats.find(chat => chat.id === currentChat)
  const {chatName, members, id} = chat


  const handleOpenMobileChats = ()=>{
    // check if the device width is greater than small size before showing
    // if(deviceWidth <= screenSizes.small)setShowMobileChats(true)
    // return null
  }

  const handleOpenMobileChatDetails = ()=>{
    // if(deviceWidth <= screenSizes.large) setShowMobileChatDetails(true)
    // return null
  }

  return (
    <div className={styles.header}>
        <div className={styles.head}>
          <div className={styles.details}>
            {
              deviceWidth <= screenSizes.small &&
              <IconButton onClick={()=>ToggleMobileChats(playDispatch, true)} style={{marginRight:'5px'}}>
                <MenuRoundedIcon sx={{color:"rgb(143, 143, 143)"}}/>
              </IconButton>
            }
            <div onClick={handleOpenMobileChatDetails} className={styles.chatDetails}>
              <ProfilePhoto name={chatName}/>
              <p className={styles.name} title="Chat title">{chatName}</p>
            </div>
          </div>


          <IconButton title="Leave chat" onClick={()=>ToggleLeaveChat(playDispatch, true)}>
            <ExitToAppRoundedIcon sx={{color:'rgb(143, 143, 143)'}}
              fontSize={deviceWidth > screenSizes.small ? 'medium' : 'small'}
            />
          </IconButton>
    
        </div>

      <div className={styles.utils}>
          <div className={styles.membersWrap}>
            <GroupRoundedIcon sx={{color:"rgb(143, 143, 143)"}} fontSize="small"/>
            <p className={styles.members}>{members.length} members</p>
          </div>
          {/* <p className={styles.typing}>Jude is typing</p> */}

          {
            peopleTyping.length > 0 && <p className={styles.typing}>
                {peopleTyping.map((name, index) => <span className={name} key={index}>
                    {index+1 < peopleTyping.length ? `${name}, ` : `${name} ` }
                    </span>
                )}
                {peopleTyping.length > 1 ? 'are' : 'is'} typing
            </p>
          }
      </div>
    </div>

  )
}
