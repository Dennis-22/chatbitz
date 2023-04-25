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
import { userActions, chatActions } from "../utils/actions"

export default function Playground(){
    const connectType = useLocation()?.state?.connectType || _Connect.create

    return <PlaygroundProvider>
        <PlaygroundContent connectType={connectType}/>
    </PlaygroundProvider>
}

function PlaygroundContent({connectType}){
    const {deviceWidth} = useAppContext()
    const {userDispatch, userState:{user}} = useUserContext()
    const {chatDispatch, chatState:{chats, currentChat}} = useChatContext()
    const {playState} = usePlaygroundContext()
    const [process, setProcess] = useState({loading:!currentChat, errorText:""})
    const {showMobileChats, showLeaveChat, showChatDetails, showNotAdmin, showYouWereRemoved} = playState
    const navigate = useNavigate()

    // console.log('reduce chats', chats)
    // console.log('reduce chats', currentChat)
    // console.log('reduce chats', messages)

    // gets user chats and set everything up for chatting
    // this fn is called in configureUser fn
    const getUserChats = async()=>{
        // check if user has a chat if not request user chat from the server. if user does not have any chat navigate to connect
        if(currentChat) return null
        // if there is no current chat process.loading would be set to true by default

        // check if user has chat
        if(chats.length > 0){
            // set current chat to the first chat
            if(!currentChat) return chatDispatch({type:chatActions.SET_CURRENT_CHAT, payload:chats[0].id})
            return
        }

        // request the user chats from the server
        setProcess({loading:true, errorText:""})
        let request = await requestMaker("GET", `${api.getUserChats}/2`)
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

        setProcess({loading:false, errorText:""})
    }

    // check if user has necessary data to be on this page
    const configureUser = ()=>{
        if(user.username === ""){
            // user is not registered in store
            // check user from session and store the user in store if its available
            const userInSession = getItemFromStorage('User')
            if(userInSession.username === "") return navigate("/connect", {state: {connectType:_Connect.join}})
            // set user in store with the user in session storage
            userDispatch({type:userActions.SET_USER, payload:user})
            getUserChats()
        }
    }


    useEffect(()=>{
        configureUser()
    },[])

    if(process.loading) return <ModalLoading />
    
    if(process.errorText) return <ModalError text={process.errorText} retryFn={configureUser}/>

    return <>
        <div className={styles.playground}>
            {deviceWidth >= screenSizes.small && <LargeScreenChats />}
            <Message />
        </div>

        {/* the lower ones appear first */}
        {showLeaveChat && <LeaveChatModal />}
        {showChatDetails && <ChatDetails />}
        {showNotAdmin && <NotAnAdminModal />}
        {showYouWereRemoved && <RemovedModal />}
        {showMobileChats && <MobileChats />} {/* the drawer for chats on small devices */}
    </>
}