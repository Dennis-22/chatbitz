import { userActions } from "../../utils/actions"
const {SET_CURRENT_CHAT, ADD_CHAT, LEAVE_CHAT, ADD_MEMBER_TO_CHAT, 
    REMOVE_MEMBER_FROM_CHAT, ADD_MESSAGE} = userActions

const state = {
   chats:[], //array of all user chats
   currentChat:"", // id of user's current chat
   messages:[] // all messages of user chats
}

function chatReducer(state, action){
    const {type, payload} = action
    switch(type){
        case(SET_CURRENT_CHAT):{
            return {...state, currentChat:payload}
        }
        case(ADD_MESSAGE):{
            const {id, message} = payload
            let newMessages = state.messages.map((msg) => {
                if(msg.chatId === id) return [...msg.messages, message]
                return msg
            })
            return {...state, messages:newMessages}
        }
        case(ADD_CHAT):{
            const {chat, messages} = payload
            let chatMessages = {chatId:chat.id, messages:messages}
            return {...state,
                currentChat:chat.id,
                chats:[...state.chats, chat], 
                messages:[...state.messages, chatMessages]
            }
        }
        case(LEAVE_CHAT):{
            return {...state, chats:state.chats.filter(chat => chat.id !== payload)}
        }
        case(ADD_MEMBER_TO_CHAT):{
            const {id, newUser, joinMsg} = payload
            
            // add member to the chats
            let newChats = state.chats.map((chat) => {
                if(chat.id === id){
                    return {...chat, members:[...chat.members, newUser]}
                }
                return chat
            })

            // add message to messages
            let newMessages = state.messages.map((msg) => {
                if(msg.chatId === id){
                    return {...msg, messages:[...msg.messages, joinMsg]}
                }
                return msg
            })

            return {...state, chats:newChats, messages:newMessages}
        }
        case(REMOVE_MEMBER_FROM_CHAT):{
            const {id, userId, leaveMsg} = payload

            // remove user from the chat
            let newChats = state.chats.map((chat) => {
                if(chat.id === id){
                    return {...chat, members:chat.members.filter(mem => mem.id !== userId)}
                }
                return chat
            })

            // add message to chat
            let newMessages = state.messages.map((msg) => {
                if(msg.chatId === id){
                    return {...msg, messages:[...msg.messages, leaveMsg]}
                }
                return msg
            })

            return {...state, chats:newChats, messages:newMessages}
        }
    }

    return state
}

export {state, chatReducer}