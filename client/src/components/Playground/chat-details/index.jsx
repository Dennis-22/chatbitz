import { useState } from 'react';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import styles from '../../../css/chat-details.module.css'
import Modal from '../../global/Modal'
import ProfilePhoto from '../../global/ProfilePhoto'
import { useUserContext, useChatContext, usePlaygroundContext } from '../../../utils/hooks'
import { socketConstance } from '../../../utils/constance';


export default function ChatDetails(){
    const {userState:{user}} = useUserContext()
    const {socket, chatState:{chats, currentChat, messages}} = useChatContext()
    const {toggleChatDetails} = usePlaygroundContext()
    const chat = chats.find(chat => chat.id === currentChat)
    const {chatName, members} = chat

    // console.log('ms', messages.find(msg => msg.chatId === currentChat))
    const getUserMessagesCount = (userId)=> messages.find(msg => msg.chatId === currentChat)
        .messages.filter(msg => msg.userId === userId).length
    
    // check if user is an admin of a chat
    const canUserRemoveOtherUser = ()=> chat.members.find(mem => mem.id === user.id)?.admin || false

    const handleRemoveUser = async(removeUserId)=>{
        let props = {
            chatId:currentChat, 
            adminId:user.id, 
            adminName:user.username, 
            userId:removeUserId
        }
        socket?.emit(socketConstance.REMOVE_MEMBER, props)
    }

    return <Modal>
        <div className={styles.body}>
           
            <div className={styles.header}>
                <div className={styles.details}>
                    <ProfilePhoto name={chatName}/>
                    <div className={styles.detailsText}>
                        <p className={styles.chatName}>{chatName}</p>
                        <p className={styles.membersCount}>{members.length} participants</p>
                    </div>
                </div>

                <IconButton onClick={()=>toggleChatDetails(false)}>
                    <CloseRoundedIcon sx={{color:'rgb(143, 143, 143)'}}/>
                </IconButton>
            </div>


            <section className={styles.members}>
                <p className={styles.membersMemCount}>{members.length} participants</p>
                <p className={styles.adminMemText}>👌 Tap on a participant to remove them</p>
                <div className={styles.membersWrap}>
                    {members.map((mem, idx) => (<Member 
                            {...mem} 
                            key={idx} 
                            getUserMessagesCount={getUserMessagesCount}
                            canUserRemoveOtherUser={canUserRemoveOtherUser}
                            handleRemoveUser={handleRemoveUser}
                        />
                    ))}
                </div>
            </section>
        </div>
    </Modal>
}

function Member(props){
    const {admin, id, username, accentColor, getUserMessagesCount, canUserRemoveOtherUser, handleRemoveUser} = props
    const [openUtils, setOpenUtils] = useState(false)
   
    const handlePress = ()=>{
        // if(canUserRemoveOtherUser(id)) return setOpenUtils(!openUtils)
        // return null
        setOpenUtils(!openUtils)
    }


    return <div className={styles.member}>
        <div onClick={handlePress} className={styles.memberDetails}>
            <ProfilePhoto name={username} size={35} color={accentColor}/>
            <p>{username} - <span className={styles.messagesSent}> {getUserMessagesCount(id)} 💌</span></p>
        </div>
        
        {
            openUtils && <div className={styles.memberUtils}>
               
               <Button 
                        variant="contained" 
                        onClick={()=> handleRemoveUser(id)}
                    >
                        Remove {username}
                    </Button>
            </div>
        }
  
    </div>
}