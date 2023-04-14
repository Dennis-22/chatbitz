import {createContext, useReducer} from 'react'
import { state, chatReducer } from './chatReducer'

export const ChatContext = createContext()

export default function ChatProvider({children}){
    const [chatState, chatDispatch] = useReducer(chatReducer, state)

    const value = {
        chatState, chatDispatch
    }

    return <ChatContext.Provider value={value}>
        {children}
    </ChatContext.Provider>
}
