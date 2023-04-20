import {createContext, useReducer} from 'react'
import { state, playgroundReducer } from './playgroundReducer'
import { playgroundActions } from '../../utils/actions'

const {SHOW_MOBILE_CHATS, SHOW_LEAVE_CHAT, SHOW_POPUP_INPUT, SHOW_CHAT_DETAILS,
    SHOW_YOU_WERE_REMOVED, SHOW_NOT_ADMIN
} = playgroundActions

export const PlaygroundContext = createContext()

export default function PlaygroundProvider({children}){
    const [playState, playDispatch] = useReducer(playgroundReducer, state)

    const toggleMobileChats = (show)=>{
        playDispatch({type:SHOW_MOBILE_CHATS, payload:show})
    }
    
    const toggleLeaveChat = (show)=>{
        return playDispatch({type:SHOW_LEAVE_CHAT, payload:show})
    }

    const toggleChatDetails = (show)=>{
        playDispatch({type:SHOW_CHAT_DETAILS, payload:show})
    }

    const toggleYouWereRemoved = (show)=>{
        playDispatch({type:SHOW_YOU_WERE_REMOVED, payload:show})
    }

    const toggleNotAdmin = (show)=>{
        playDispatch({type:SHOW_NOT_ADMIN, payload:show})
    }

    const value = {
        playState, playDispatch,
        toggleMobileChats, toggleLeaveChat,
        toggleChatDetails, toggleYouWereRemoved, toggleNotAdmin
    }

    return <PlaygroundContext.Provider value={value}>
        {children}
    </PlaygroundContext.Provider>
}
