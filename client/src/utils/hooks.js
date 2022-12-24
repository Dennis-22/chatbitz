import {useContext} from 'react'
import { AppContext } from '../appContext'
import { ChatContext } from '../chatContext'

export const useAppContext = () => useContext(AppContext) 
export const useChatContext = () => useContext(ChatContext) 
