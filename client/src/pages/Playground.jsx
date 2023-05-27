import { useEffect, useState, useCallback } from "react"
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
import { userActions, chatActions, playgroundActions } from "../utils/actions"
import { connectToServer, getApiErrorResponse, getItemFromStorage} from "../utils/helpers"
import {screenSizes, socketConstance} from '../utils/constance'
import {_User, _Connect } from "../utils/types"
import { getUserChatsRoute } from "../utils/api"

const _defProcessError = {status:false, text:"", btnTet:"", btnFn:()=>null} // default error object for process useState

const {CREATE_CHAT, JOIN_CHAT, SOMEONE_JOINED, SOMEONE_LEFT, REJOIN_CHAT,
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
    const {userDispatch, getUserFromStore} = useUserContext()
    const {chatDispatch, socket, setSocket, chatState:{chats, currentChat}} = useChatContext()
    const {playDispatch, playState, toggleNotAdmin, toggleYouWereRemoved} = usePlaygroundContext()
    const [process, setProcess] = useState({loading:!currentChat, error:_defProcessError})
    const {showMobileChats, showLeaveChat, showChatDetails, showNotAdmin, showYouWereRemoved} = playState
    const navigate = useNavigate()
    const {id:userId, username, accentColor} = getUserFromStore()
    

    // create or join a chat based on user activity on the connect page
    const connectUser = ()=>{
        console.log('configure user')
        let connectChatDetails = {userId, username, chatId:connectChatId}
        if(connectType === _Connect.create){
            console.log('create chat')
            socket.emit(CREATE_CHAT, connectChatDetails)
        }

        if(connectType === _Connect.join){
            console.log('joining chat')
            socket.emit(JOIN_CHAT, {...connectChatDetails, accentColor})
        }
    }

    const pageRefreshedFn = useCallback(async()=>{
        // check id user is stored in session
        // if user not stored in session, navigate from this page else below lines continues
        // get all user chats from the backend with userId
        // if user has no chats from the server, alert the user and navigate user from this page
        // when user has chats on the backend, connect to server via socket and socket join all user chats
        // set socket to new socket and set user in store wit user in session
        setProcess({loading:true, error:_defProcessError})
        console.log('ren refresh fun')
        const userInSession = getItemFromStorage('User')
        if(!userInSession) return navigate("/connect", {state: {connectType:_Connect.join}})

        
        console.log('fetching chats from server', userInSession.id)
        // request the user chats from the server
        
        try {
            const {status, data:{data}} = await getUserChatsRoute(userInSession.id)

            // when user has no chat on the server
            if(status === 204) {
                return setProcess(()=>({
                    loading:false, 
                    error:{
                        status:true,
                        text:"You have no chats",
                        btnFn:()=> navigate("/connect", {state: {connectType:_Connect.join}}),
                        btnText:"Okay"
                    }
                }))
            }

            // no error encountered
            // set user chats from the results from the server
            let {chats:userChats, messages} = data
            
            let chatIds = [] //store the user chat ids and connect wih socket

            // add chats to user chats
            for(let chat of userChats){
                // get chat messages
                let chatMessages = messages.find(msg => msg.chatId === chat.id).messages
                chatDispatch({type:chatActions.ADD_CHAT, payload:{chat, messages:chatMessages}})
                chatIds.push(chat.id)
            }
            // set current chat to the first chat if userChats is more than one
            if(userChats.length > 1){
                chatDispatch({type:chatActions.SET_CURRENT_CHAT, payload:userChats[0].id})
            }

            // connect user via socket
            let newSocket = await connectToServer()
            newSocket.emit(REJOIN_CHAT, {userId:userInSession.id, chatIds})
            setSocket(newSocket)
            userDispatch({type:userActions.SET_USER, payload:userInSession})
            setProcess({loading:false, error:_defProcessError})
        } catch (error) {
            let errorMsg = getApiErrorResponse(error)
            setProcess(()=>({
                loading:false,
                error:{
                    status:true,
                    text:errorMsg || "Failed to load your chats",
                    btnFn: pageRefreshedFn,
                    btnText:"Retry"
                }
            }))
        }
    },[])

 
    // when user switches chat, this fn runs to see if user is still part of the chat
    // helpful when user is removed from a chat which is not the current chat
    useEffect(()=>{
        if(currentChat){
            let isUserStillAMember = chats.find(chat => chat.id === currentChat)
            ?.members.some(mem => mem.id === userId)
    
            if(!isUserStillAMember)toggleYouWereRemoved(true)
        }
        
    },[currentChat])


    useEffect(()=>{
        if(userId){connectUser()}
        else{pageRefreshedFn()}
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
            if(userId === user.id) toggleNotAdmin(true)
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
    
    if(process.error.status) return <ModalError {...process.error}/>

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