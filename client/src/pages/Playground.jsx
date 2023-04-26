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
import {screenSizes, socketConstance, ENDPOINT, api} from '../utils/constance'
import {_User, _Connect } from "../utils/types"
import { userActions, chatActions } from "../utils/actions"


const {CREATE_CHAT, JOIN_CHAT, SOMEONE_JOINED, SOMEONE_LEFT, RECEIVED_MESSAGE} = socketConstance

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
    const {chatDispatch, socket, setSocket, connectToServer, chatState:{chats, currentChat}} = useChatContext()
    const {playState} = usePlaygroundContext()
    const [process, setProcess] = useState({loading:!currentChat, errorText:""})
    const {showMobileChats, showLeaveChat, showChatDetails, showNotAdmin, showYouWereRemoved} = playState
    const navigate = useNavigate()


    // console.log('reduce chats', currentChat)
    // console.log('reduce chats', messages)

    // create or join a chat based on user activity on the connect page
    // this is called in getUserChatsfn
    const connectUser = async()=>{
        // if socket is not successfully connected to the backend
        // let tempSocket = null
        // if(!socket){
        //     tempSocket = await io.connect(ENDPOINT)
        //     setSocket(tempSocket)
        // }   

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

        // below only runs when user has refreshed the page
        // check user chats and for each, socket join them
        console.log('check user chats and socket join them')
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


    useEffect(()=>{
        configureUser()
    },[])

    useEffect(()=>{
        if(socket){
            socket?.on(SOMEONE_JOINED, (data) =>{
                const {id, newUser, joinMsg} = data
                chatDispatch({type:chatActions.ADD_MEMBER_TO_CHAT, payload:{id, newUser, joinMsg}})
            })

            socket?.on(SOMEONE_LEFT, (data)=>{
                const {leaveMsg, id, userId} = data
                chatDispatch({type:chatActions.REMOVE_MEMBER_FROM_CHAT, payload:{id, userId, leaveMsg}})
            })

            socket?.on(RECEIVED_MESSAGE, (message)=>{
                chatDispatch({type:chatActions.ADD_MESSAGE, payload:{id:message.chatId, message}})
            })
        }

    },[socket])

    if(process.loading) return <ModalLoading />
    
    if(process.errorText) return <ModalError text={process.errorText} retryFn={configureUser}/>

    return <>
        <div className={styles.playground}>
            {deviceWidth >= screenSizes.small && <LargeScreenChats />}
            <Message />

            {/* <button onClick={()=> chatDispatch({
                type:chatActions.REMOVE_MEMBER_FROM_CHAT, 
                payload:{id:'2', userId:'21', leaveMsg:'left'}})}>
                Play
            </button> */}
        </div>

        {/* the lower ones gets higher z index */}
        {showLeaveChat && <LeaveChatModal />}
        {showChatDetails && <ChatDetails />}
        {showNotAdmin && <NotAnAdminModal />}
        {showYouWereRemoved && <RemovedModal />}
        {showMobileChats && <MobileChats />} {/* the drawer for chats on small devices */}
    </>
}