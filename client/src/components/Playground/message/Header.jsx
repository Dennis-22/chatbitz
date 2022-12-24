import IconButton from '@mui/material/IconButton';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import ExitToAppRoundedIcon from '@mui/icons-material/ExitToAppRounded';
import GroupRoundedIcon from '@mui/icons-material/GroupRounded';
import styles from '../../../css/message.module.css'
import ProfilePhoto from '../../global/ProfilePhoto'
import { useAppContext, useChatContext } from '../../../utils/hooks';
import { screenSizes } from '../../../utils/constance';

export default function Header() {
  const {deviceWidth, setShowMobileChats, setShowMobileChatDetails} = useAppContext()
  const {currentChat, setLeaveChat, peopleTyping} = useChatContext()
  const {chatName, members} = currentChat

  const handleLeaveChat = ()=>{
    // set the chat id and status of the modal to true
    // logic is handled in modal OK press
    setLeaveChat({show:true, chatId:currentChat.id})
  }

  const handleOpenMobileChats = ()=>{
    // check if the device width is greater than small size before showing
    if(deviceWidth <= screenSizes.small)setShowMobileChats(true)
    return null
  }

  const handleOpenMobileChatDetails = ()=>{
    if(deviceWidth <= screenSizes.large) setShowMobileChatDetails(true)
    return null
  }

  return (
    <div className={styles.header}>
        <div className={styles.head}>
          <section className={styles.details}>
            {
              deviceWidth <= screenSizes.small &&
              <IconButton onClick={handleOpenMobileChats} style={{backgroundColor:'#1d1d1d', marginRight:'5px'}}>
                <MenuRoundedIcon sx={{color:"rgb(143, 143, 143)"}}/>
              </IconButton>
            }
            <ProfilePhoto name={chatName}/>
            <p className={styles.name} title="Chat title">{chatName}</p>
          </section>


          <section className={styles.options}>
            <IconButton title="Leave chat" onClick={handleLeaveChat} style={{backgroundColor:"#1d1d1d"}}>
              <ExitToAppRoundedIcon sx={{color:'rgb(143, 143, 143)'}}
                fontSize={deviceWidth > screenSizes.small ? 'medium' : 'small'}
              />
            </IconButton>

            {
              deviceWidth <= screenSizes.large &&
              <IconButton onClick={handleOpenMobileChatDetails} style={{backgroundColor:'#1d1d1d'}}>
                <MenuRoundedIcon sx={{color:'rgb(143, 143, 143)'}}
                  fontSize={deviceWidth > screenSizes.small ? 'medium' : 'small'}
                />
              </IconButton>
            }
          </section>
    
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
