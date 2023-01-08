import { useEffect, useState } from 'react'
import styles from '../css/playground.module.css'
import Chats, {MobileChats} from '../components/Playground/chats'
import Message from '../components/Playground/message'
import ChatDetails, {MobileChatDetails} from '../components/Playground/chat-details'
import Loading from '../components/global/Loading'
import LeaveChatModal from '../components/global/LeaveChatModal'
import { useAppContext, useChatContext } from '../utils/hooks'
import {screenSizes, socketConstance} from '../utils/constance'
import PopupInput from '../components/Playground/message/PopupInput'
import { useNavigate } from "react-router-dom"


const {CREATE_CHAT, JOIN_CHAT, SOMEONE_JOINED, SOMEONE_LEFT, RECEIVED_MESSAGE, PERSON_IS_TYPING} = socketConstance

export default function Playground(){
    const {deviceWidth, loading, user, showMobileChats, showMobileChatDetails, showPopupInput} = useAppContext()
    const {socket, leaveChat, setCurrentChat, setChats, setMessages, setPeopleTyping,
        performActionBeforeStartUp, setPerformActionBeforeStartUp} = useChatContext()
    const [settingUp, setSettingUp] = useState(true)
    const navigation = useNavigate()


    useEffect(() => {
        const handleTabClose = event => {
            event.preventDefault();

            window.alert('Do u want to exist')
    
            // console.log('beforeunload event triggered');
    
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
            setCurrentChat(chatDetails.id)
            
            // reset startup state
            setPerformActionBeforeStartUp({action:'', chatDetails:null})
            setSettingUp(false)
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
            setCurrentChat(chatDetails.id)

            // reset startup state
            setPerformActionBeforeStartUp({action:'', chatDetails:null})
            setSettingUp(false)
        }

        // when user navigates here without creating or joining a chat
        if(action === '' && chatDetails === null){
            navigation('/join')
        }

        // WHEN WORKING WITH REFRESH
        // when action is empty but a user is stored in session storage, user refreshed this page
        // if(action === '' && getItemFromStorage('User')){
        //     console.log('user refreshed')
        //     // check if user has chat id in session. 
        //     // if not, user has not created or joined any chat, move user from this page 
        //     // if user has chat ids, loop through each and socket connect to them
        // }
    },[])

    useEffect(()=>{

        if(socket){
            socket?.on(SOMEONE_JOINED, (data) =>{
                const {id, newUser, joinMsg} = data
                // add newUser to his/her belonging chat
                // make "userId" in newUser just "id" cos the rest of the functionality uses id not userId
                let prepUser = {...newUser, id: newUser.userId}
                delete prepUser.userId //remove cos its no more needed
                setChats((prev) => {
                    return {
                        ...prev, 
                        chatsData: prev.chatsData.map((chat) => {
                            if(chat.id === id){
                                return {...chat, members:[...chat.members, prepUser]}
                            }
                            return chat
                        }) 
                    }
                })
                // set messages
                setMessages(prev => [...prev, joinMsg])
            })

            socket?.on(SOMEONE_LEFT, (data)=>{
                const {leaveMsg, id, userId} = data
                // remove user from the chat members
                setChats((prev) => {
                    return {
                        ...prev,
                        chatsData: prev.chatsData.map((chat) => {
                            if(chat.id === id){
                                return {...chat, members:chat.members.filter(mem => mem.id !== userId)}
                            }
                            return chat
                        })
                    }
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
            {leaveChat.show && <LeaveChatModal />}

            {showMobileChats && <MobileChats />}
            {showMobileChatDetails && <MobileChatDetails />}
            {showPopupInput && <PopupInput />}
        </>
    )
}
