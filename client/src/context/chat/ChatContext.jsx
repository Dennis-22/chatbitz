import {createContext, useReducer, useState} from 'react'
import { state, chatReducer } from './chatReducer'

export const ChatContext = createContext()

export default function ChatProvider({children}){
    const [chatState, chatDispatch] = useReducer(chatReducer, state)
    const [socket, setSocket] = useState(null)
    

    const value = {
        chatState, chatDispatch,
        socket, setSocket
    }

    return <ChatContext.Provider value={value}>
        {children}
    </ChatContext.Provider>
}
