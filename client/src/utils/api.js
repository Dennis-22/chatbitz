import axios from 'axios'

export const ENDPOINT = import.meta.env.VITE_SERVER_URL

const API = axios.create({
    baseURL: `${ENDPOINT}/api`
})

export const createChatRoute = (createChatProps)=>API.post(`/chat/create`, createChatProps)
export const joinChatRoute = (joinChatProps)=>API.post(`/chat/join`, joinChatProps)
export const getChatMessages = (chatId)=>API.get(`/chat/messages/${chatId}`)
export const getUserChatsRoute = (userId, chats)=>{
    chats = chats.join(",")
    return API.get(`/user/get-chats/query?userId=${userId}&chats=${chats}`)
}
