import {useContext} from 'react'
import { AppContext } from '../context/appContext'
import { UserContext } from '../context/user/UserContext'
import { ChatContext } from '../context/chat/ChatContext'
import { PlaygroundContext } from '../context/Playground/PlaygroundContext'

export const useAppContext = () => useContext(AppContext) 
export const useUserContext = ()=> useContext(UserContext)
export const useChatContext = () => useContext(ChatContext)
export const usePlaygroundContext = ()=>useContext(PlaygroundContext)
