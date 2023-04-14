import {useContext} from 'react'
import { AppContext } from '../appContext'
import { UserContext } from '../context/user/UserContext'
import { ChatContext } from '../context/chat/ChatContext'

export const useAppContext = () => useContext(AppContext) 
export const useUserContext = ()=> useContext(UserContext)
export const useChatContext = () => useContext(ChatContext) 
