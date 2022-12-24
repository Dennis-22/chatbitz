import { useEffect, useState } from 'react'
import styles from '../css/playground.module.css'
import Chats, {MobileChats} from '../components/Playground/chats'
import Message from '../components/Playground/message'
import ChatDetails, {MobileChatDetails} from '../components/Playground/chat-details'
import Loading from '../components/global/Loading'
import Modal from '../components/global/Modal'
import { useAppContext, useChatContext } from '../utils/hooks'
import {screenSizes, socketConstance} from '../utils/constance'

const {CREATE_CHAT, JOIN_CHAT, SOMEONE_JOINED, SOMEONE_LEFT, RECEIVED_MESSAGE, PERSON_IS_TYPING} = socketConstance

export default function Playground(){
    const {deviceWidth, loading, user, showMobileChats, showMobileChatDetails} = useAppContext()
    const {socket, leaveChat, currentChat, setCurrentChat, setMessages, setPeopleTyping,
        performActionBeforeStartUp, setPerformActionBeforeStartUp} = useChatContext()
    const [settingUp, setSettingUp] = useState(true)

    const currentChatId = currentChat.id

    useEffect(() => {
        const handleTabClose = event => {
          event.preventDefault();

          window.alert('Do u want to exist')
    
          console.log('beforeunload event triggered');
    
          return (event.returnValue = 'Are you sure you want to exit?');
        };
    
        window.addEventListener('beforeunload', handleTabClose);
    
        return () => {
          window.removeEventListener('beforeunload', handleTabClose);
        };
    }, []);

    useEffect(()=>{
        const {action, chatDetails} = performActionBeforeStartUp
        // when user is creating a chat
        if(action === 'create'){
            // emit chat creating with the chat details set at Create page.
            socket.emit(CREATE_CHAT, chatDetails)
            setCurrentChat(chatDetails)
        }

        // when user is joining a chat
        if(action === 'join'){
            // emit chat creating with the chat details set at Join page.
            // id, userId, username, accentColor
            let joiningParams = {
                id:chatDetails.id, 
                username:user.username, 
                userId: user.id,
                accentColor:user.accentColor
            }
            socket.emit(JOIN_CHAT, joiningParams)
            setCurrentChat(chatDetails)
        }

        // reset startup state
        setPerformActionBeforeStartUp({action:'', chatDetails:null})
        setSettingUp(false)
    },[])

    useEffect(()=>{

        if(socket){
            socket?.on(SOMEONE_JOINED, (data) =>{
                const {newUser, joinMsg} = data
                // add newUser to current
                setCurrentChat((prev)=>{
                    return {...prev,members:[...prev.members, newUser]}
                })
                // set messages
                setMessages(prev => [...prev, joinMsg])
            })

            socket?.on(SOMEONE_LEFT, (data)=>{
                const {leaveMsg, id, userId} = data
                // remove user from the chat members
                setCurrentChat((prev)=>{
                    return {...prev, members:prev.members.filter(mem => mem.id !== userId)}
                })
                setMessages(prev => [...prev, leaveMsg])
            })

            socket?.on(RECEIVED_MESSAGE, (message)=>{
                setMessages(prev => [...prev, message])
                setPeopleTyping([]) //reset people typing cos the one typing sent the message
            })

            socket?.on(PERSON_IS_TYPING, (chatIdAndUsername)=>{
                const {id, username} = chatIdAndUsername
                setPeopleTyping((prev) => {
                    // don't add username if its already there
                    if(prev.includes(username)) return prev
                    return [...prev, username]
                })
            })
        }

    },[socket])

    // when emitting create chat or join chat to the server
    if(settingUp) return <Loading /> 

    return (
        <>
            <div className={styles.playground}>
                {deviceWidth >= screenSizes.small && <Chats />}
                <Message />
                {deviceWidth >= screenSizes.large && <ChatDetails />}  
            </div>
            {loading && <Loading />}
            {leaveChat.show && <Modal />}

            {showMobileChats && <MobileChats />}
            {showMobileChatDetails && <MobileChatDetails />}
        </>
    )
}
