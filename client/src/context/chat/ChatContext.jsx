import {createContext, useReducer, useState} from 'react'
import {io} from 'socket.io-client'
import { state, chatReducer } from './chatReducer'
import { ENDPOINT } from '../../utils/api'

export const ChatContext = createContext()

export default function ChatProvider({children}){
    const [chatState, chatDispatch] = useReducer(chatReducer, state)
    const [socket, setSocket] = useState(null)
  
   
    const connectToServer = async()=>{
        let connected = await io.connect(ENDPOINT)
        setSocket(connected)
    }

    const value = {
        chatState, chatDispatch,
        socket, setSocket, connectToServer
    }

    return <ChatContext.Provider value={value}>
        {children}
    </ChatContext.Provider>
}
