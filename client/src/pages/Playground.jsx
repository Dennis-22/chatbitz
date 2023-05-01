import { useEffect, useState } from "react"
import {useLocation, useNavigate } from "react-router-dom"
import styles from '../css/playground.module.css'
import PlaygroundProvider from "../context/Playground/PlaygroundContext"
import { useAppContext, useChatContext, usePlaygroundContext, useUserContext } from "../utils/hooks"
import {ModalError} from "../components/global/Error"
import { ModalLoading } from "../components/global/Loading"
import {LargeScreenChats, MobileChats} from '../components/Playground/chats'
import Message from '../components/Playground/message'
import LeaveChatModal from '../components/global/LeaveChatModal'
import ChatDetails from '../components/Playground/chat-details'
import RemovedModal from "../components/global/RemovedModal"
import NotAnAdminModal from "../components/global/NotAnAdminModal"
import { getItemFromStorage, requestMaker } from "../utils/helpers"
import {screenSizes, socketConstance, api} from '../utils/constance'
import {_User, _Connect } from "../utils/types"
import { userActions, chatActions, playgroundActions } from "../utils/actions"


const {CREATE_CHAT, JOIN_CHAT, SOMEONE_JOINED, SOMEONE_LEFT, 
    SOMEONE_WAS_REMOVED, I_WAS_REMOVED, REMOVE_MEMBER_FAILED,
    PERSON_IS_TYPING, RECEIVED_MESSAGE} = socketConstance

export default function Playground(){
    const connectType = useLocation()?.state?.connectType || null
    const connectChatId = useLocation()?.state?.chatId || null //this will have value if the user created or joined a chat from connect page

    return <PlaygroundProvider>
        <PlaygroundContent connectType={connectType} connectChatId={connectChatId}/>
    </PlaygroundProvider>
}

function PlaygroundContent({connectType, connectChatId}){
    const {deviceWidth} = useAppContext()
    const {userDispatch, userState:{user}} = useUserContext()
    const {chatDispatch, socket, chatState:{chats, currentChat}} = useChatContext()
    const {playDispatch, playState, toggleNotAdmin, toggleYouWereRemoved} = usePlaygroundContext()
    const [process, setProcess] = useState({loading:!currentChat, errorText:""})
    const {showMobileChats, showLeaveChat, showChatDetails, showNotAdmin, showYouWereRemoved} = playState
    const navigate = useNavigate()


    console.log('reduce chats', chats)
    // console.log('reduce chats', messages)

    // create or join a chat based on user activity on the connect page
    // this is called in getUserChatsfn
    const connectUser = async()=>{
        if(connectType === _Connect.create){
            const createChatDetails = {
                chatId:connectChatId, 
                userId:user.id,
                username:user.username,
            }
            socket.emit(CREATE_CHAT, createChatDetails)
            return
        }

        if(connectType === _Connect.join){
            // const {id, userId, username, accentColor} = chatIdAndUserDetails
            console.log('joining chat')
            const joinChatDetails = {
                chatId:connectChatId,
                userId:user.id,
                username:user.username,
                accentColor:user.accentColor
            }
            socket.emit(JOIN_CHAT, joinChatDetails)
            return
        }

        //code below is expected to run only when user has refresh the page

        // TODO::
        // check user chats and for each, socket join them
        // console.log('check user chats and socket join them')
        // connect to server
        // create a new socket.join and server for only refreshed joining so it does not alert other users
    }

    // gets user chats and set everything up for chatting
    // this fn is called in configureUser fn
    const getUserChats = async()=>{
        // check if user has a chat if not request user chat from the server. if user does not have any chat navigate to connect
        // if there is no current chat process.loading would be set to true by default
        
        // check if user has chat and current chat
        if(chats.length > 0 && !currentChat){
            // set current chat to the first chat
            if(!currentChat) chatDispatch({type:chatActions.SET_CURRENT_CHAT, payload:chats[0].id})
            // move on
        }

        // there is no chat but userId is present request user chats from the backend
        // helpful when user refreshes on the browser
        if(chats.length === 0 && user.id){
            // request the user chats from the server
            setProcess({loading:true, errorText:""})
            let request = await requestMaker("GET", `${api.getUserChats}/${user.id}`)

            // when user has no chat at the backend
            if(request.error){
                return setProcess({loading:false, errorText:request.message})
            }
    
            // no error encountered
            // set user chats from the results from the server
            let {chats:userChats, messages} = request.data
    
            // add chats to user chats
            for(let chat of userChats){
                // get chat messages
                let chatMessages = messages.find(msg => msg.chatId === chat.id).messages
                chatDispatch({type:chatActions.ADD_CHAT, payload:{chat, messages:chatMessages}})
            }
            // set current chat to the first chat if userChats is more than one
            if(userChats.length > 1){
                chatDispatch({type:chatActions.SET_CURRENT_CHAT, payload:userChats[0].id})
            }
        }

        connectUser()
        setProcess({loading:false, errorText:""})
    }

    // check if user has necessary data to be on this page
    const configureUser = ()=>{
        if(user.username === ""){
            // user is not registered in store
            // check user from session and store the user in store if its available
            const userInSession = getItemFromStorage('User')
            if(userInSession === null) return navigate("/connect", {state: {connectType:_Connect.join}})
            
            // set user in store with the user in session storage
            userDispatch({type:userActions.SET_USER, payload:userInSession})
            
        }

        getUserChats()
    }

    
 
    // when user switches chat, this fn runs to see if user is still part of the chat
    // helpful when user is removed from a chat which is not the current chat
    useEffect(()=>{
        let isUserStillAMember = chats.find(chat => chat.id === currentChat)
        .members.some(mem => mem.id === user.id)

        if(!isUserStillAMember)toggleYouWereRemoved(true)
        
    },[currentChat])

    useEffect(()=>{
        configureUser()
    },[])


    useEffect(()=>{
        
        socket?.on(SOMEONE_JOINED, (data) =>{
            const {id, newUser, joinMsg} = data
            chatDispatch({type:chatActions.ADD_MEMBER_TO_CHAT, payload:{id, newUser, joinMsg}})
        })

        socket?.on(SOMEONE_LEFT, (data)=>{
            const {leaveMsg, id, userId} = data
            chatDispatch({type:chatActions.REMOVE_MEMBER_FROM_CHAT, payload:{id, userId, leaveMsg}})
        })

        socket?.on(SOMEONE_WAS_REMOVED, (data)=>{
            const {userId, chatId, message} = data
            // check if user was removed and show the removed popup otherwise remove the removed user from store
            if(userId === user.id){
                // emit to the backend to disconnect from the chatId socket
                socket?.emit(I_WAS_REMOVED, chatId)
                
                if(chatId === currentChat){
                    // if user is on the chat, show the removed modal
                    playDispatch({type:playgroundActions.SHOW_YOU_WERE_REMOVED, payload:true})
                }else{
                    // leave the chat
                    // when user later set the chat, the useEffect which checks if user is still ...
                    // a member of a chat will handle the modal showing
                    chatDispatch({
                        type:chatActions.REMOVE_MEMBER_FROM_CHAT, 
                        payload:{id:chatId, userId, leaveMsg:message}
                    }) //remove user from the chat
                }


            }else{ //someone else was removed.
                // update the store to remove that member from the chat
                chatDispatch({type:chatActions.REMOVE_MEMBER_FROM_CHAT, payload:{id:chatId, userId, leaveMsg:message}})
            }
        })

        socket?.on(REMOVE_MEMBER_FAILED, (userId)=>{
            if(userId === user.id){
                toggleNotAdmin(true)
            }
        })

        socket?.on(PERSON_IS_TYPING, (data)=>{
            const {chatId, username, userId} = data
            chatDispatch({type:chatActions.SOMEONE_TYPING, payload:{chatId, userId, username}})
        })

        socket?.on(RECEIVED_MESSAGE, (message)=>{
            chatDispatch({type:chatActions.ADD_MESSAGE, payload:{id:message.chatId, message}})
        })
        

    },[socket])

    if(process.loading) return <ModalLoading />
    
    if(process.errorText) return <ModalError text={process.errorText} retryFn={configureUser}/>

    return <>
        <div className={styles.playground}>
            {deviceWidth >= screenSizes.small && <LargeScreenChats />}
            <Message />  
        </div>

        {/* the lower ones gets higher z index */}
        {showLeaveChat && <LeaveChatModal />}
        {showChatDetails && <ChatDetails />}
        {showNotAdmin && <NotAnAdminModal />}
        {showYouWereRemoved && <RemovedModal />}
        {showMobileChats && <MobileChats />} {/* the drawer for chats on small devices */}
    </>
}