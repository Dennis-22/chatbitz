import { useEffect, useLayoutEffect, useState } from 'react'
import styles from '../../../css/member-details-modal.module.css'
import Modal, { ModalButtons } from "../../global/Modal"
import ProfilePhoto from '../../global/ProfilePhoto'
import { useAppContext, useChatContext } from '../../../utils/hooks'
import {_ChatMemberDetails} from '../../../utils/types'
import {socketConstance} from '../../../utils/constance'


export default function MemberDetailsModal() {
    const {user, showChatMemberDetails, setShowChatMemberDetails} = useAppContext()
    const {socket, messages, getCurrentChatDetails} = useChatContext()
    const [showRemoveUserBtn, setShowRemoveUserBtn] = useState(false)
    const {id, username, profilePhoto, accentColor} = showChatMemberDetails.memberDetails //details of the chat member clicked

    const getMessagesCount = ()=> messages.filter(msg => msg.userId === id).length

    const currentChat = getCurrentChatDetails()

    const closeModal = ()=>{
        // set to the default obj 
        setShowChatMemberDetails({..._ChatMemberDetails, show:false})
    }

    const handleRemoveUser = ()=>{
        // chatId, adminName, adminId, userId
        let props = {chatId:currentChat.id, adminName:user.username, adminId:user.id, userId:id}
        socket.emit(socketConstance.REMOVE_USER, props)
        closeModal()
    }

    useEffect(()=>{

    },[])

    useLayoutEffect(()=>{
        // check if user is admin in the current chat and set the show btn to true
        let chatMembers = currentChat.members //get all members
        let isUserAnAdmin = chatMembers.find(mem => mem.id === user.id).admin
        let show = isUserAnAdmin && user.id !== id ? true : false //check if user is not viewing own details
        setShowRemoveUserBtn(show)
    },[])
    
    
    return (
        <Modal>
            <div className={styles.container}>
                <div className={styles.content}>
                    <ProfilePhoto size={40} image={profilePhoto} name={username} color={accentColor}/>
                    <p className={styles.username}>{username}</p>
                    <p className={styles.msgCount}><b>{getMessagesCount()}</b> messages sent</p>
                </div>
                <ModalButtons 
                    activityText="Close"
                    activity={closeModal}
                    cancelText={`Remove ${username}`}
                    cancel={showRemoveUserBtn ? handleRemoveUser : null}
                />
            </div>
        </Modal>
    )
}
