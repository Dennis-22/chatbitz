import { getItemFromStorage, setItemToSessionStorage } from "../../utils/helpers"
import { chatActions } from "../../utils/actions"
import { _Chat } from "../../utils/types"
const {SET_CURRENT_CHAT, AUTO_SET_CURRENT_CHAT, ADD_CHAT, LEAVE_CHAT, LAVE_ALL_CHATS, ADD_MEMBER_TO_CHAT, 
    REMOVE_MEMBER_FROM_CHAT, ADD_MESSAGE, SOMEONE_TYPING} = chatActions



const state = {
   chats:[], //array of all user chats
   currentChat:"1", // id of user's current chat
   messages:[], // all messages of user chats
   peopleTyping:[], //names of people typing in the current chat
}

function chatReducer(state, action){
    const {type, payload} = action
    switch(type){
        case(SET_CURRENT_CHAT):{
            return {...state, currentChat:payload}
        }
        case(AUTO_SET_CURRENT_CHAT):{
            // checks if user has more chats and set current chat to one of them or setNoChatFn to payload fn
            const {noChatsCallback} = payload
            
            // user has no chats
            if(state.chats.length === 0) {
                if(noChatsCallback) noChatsCallback()
                return _Chat //default state of 
            }

            // set current to one of the chats
            return {...state, currentChat:state.chats[0].id}
        }
        case(ADD_MESSAGE):{
            const {id, message} = payload
            delete message.chatId
            let newMessages = state.messages.map((msg) => {
                if(msg.chatId === id) return {...msg, messages: [...msg.messages, message]}
                return msg
            })
            return {...state, messages:newMessages, peopleTyping:[]}
        }
        case(ADD_CHAT):{
            const {chat, messages} = payload
            let chatMessages = {chatId:chat.id, messages:messages}

            let chatsInStorage = getItemFromStorage("Chats") || []
            setItemToSessionStorage('Chats', [...chatsInStorage, chat.id])

            return {...state,
                currentChat:chat.id,
                chats:[...state.chats, chat], 
                messages:[...state.messages, chatMessages]
            }
        }
        case(LEAVE_CHAT):{
            // update session storage
            let updateUserChats = getItemFromStorage("Chats").filter(chatId => chatId !== payload)
            setItemToSessionStorage("Chats", updateUserChats)
            // update store
            return {...state, chats:state.chats.filter(chat => chat.id !== payload)}
        }

        case(LAVE_ALL_CHATS):{
            setItemToSessionStorage("Chats", [])
            return _Chat //default state
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
        case(SOMEONE_TYPING):{
            const {chatId, userId, username} = payload
            
            // show some is typing only when the user is currently on the chat
            if(chatId === state.currentChat){
                // check if user is already in the typing
                let userAlreadyInTyping = state.peopleTyping.find(user => user.id === userId)
                if(!userAlreadyInTyping){
                    return {...state, peopleTyping:[...state.peopleTyping, {username, id:userId}]}
                }
            }
            return state
        }
    }

    return state
}

export {state, chatReducer}