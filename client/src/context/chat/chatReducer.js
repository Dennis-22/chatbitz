import { chatActions } from "../../utils/actions"
const {SET_CURRENT_CHAT, AUTO_SET_CURRENT_CHAT, ADD_CHAT, LEAVE_CHAT, ADD_MEMBER_TO_CHAT, 
    REMOVE_MEMBER_FROM_CHAT, ADD_MESSAGE, SOMEONE_TYPING} = chatActions

const state = {
   chats:[
//     {id:'1', coverPhoto:'', chatName:"Hell 🔥🔥🔥", secured:{status:false, password: 'canopy'},
//     members:[
//         {id:'21', username: 'Jessica', admin:true, profilePhoto:'', accentColor:"rgb(89, 141, 29)"},
//         {id:'2', username: 'Lucy', admin:false, profilePhoto:'', accentColor:"rgb(89, 141, 29)"}, 
//         {id:'21', username: 'Jessica', admin:true, profilePhoto:'', accentColor:"rgb(89, 141, 29)"},
//     ]
// },
// {id:'2', coverPhoto:'', chatName:"Kitchen", secured:{status:false, password: 'canopy'},
//     members:[
//         {id:'21', username: 'Jessica', admin:true, profilePhoto:'', accentColor:"rgb(89, 141, 29)"},
//         {id:'2', username: 'Lucy', admin:false, profilePhoto:'', accentColor:"rgb(89, 141, 29)"},
//     ]
// },
   ], //array of all user chats
   currentChat:"", // id of user's current chat
   messages:[
    // {
    //     chatId:'1',
    //     messages:[
    //         {id:'6101', userId:'21', username:'Jessica', message:'Hello everyone', time:'10:30', accentColor:"rgb(38, 40, 170)"},
    //         {id:'104', userId:'join', username:'Cynthia', message:'Cynthia Joined', time:'10:30'},
    //         {id:'101', userId:'101', username:'Cynthia', message:'Hello', time:'10:31', accentColor:"rgb(38, 40, 170)"},
    //         {id:'102', userId:'1', username:'Robert', message:'How are we all doing', time:"10:31", accentColor:"rgb(89, 141, 29)"},
    //     ],
    // },
    // {
    //     chatId:'2',
    //     messages:[
    //         {id:'6101', userId:'21', username:'Jessica', message:'Hello everyone', time:'10:30', accentColor:"rgb(38, 40, 170)"},
    //         {id:'104', userId:'join', username:'Cynthia', message:'Cynthia Joined', time:'10:30'},
    //         {id:'101', userId:'101', username:'Cynthia', message:'Hello', time:'10:31', accentColor:"rgb(38, 40, 170)"},
    //         {id:'102', userId:'1', username:'Robert', message:'How are we all doing', time:"10:31", accentColor:"rgb(89, 141, 29)"},
    //         {id:'6101', userId:'21', username:'Jessica', message:'Hello everyone', time:'10:30', accentColor:"rgb(38, 40, 170)"},
    //         {id:'104', userId:'join', username:'Cynthia', message:'Cynthia Joined', time:'10:30'},
    //         {id:'101', userId:'101', username:'Cynthia', message:'Hello', time:'10:31', accentColor:"rgb(38, 40, 170)"},
    //     ],
    // },
   ], // all messages of user chats
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
            const {ignoreChatId, noChatCallback} = payload
            
            let newUserChats= state.chats.filter(chat => chat.id !== ignoreChatId)
            let newMessages = state.messages.filter(msg => msg.chatId !== ignoreChatId)
        
            if(newUserChats.length > 0){
                // set current to one of the chats
                return {...state, chats:newUserChats, messages:newMessages, currentChat:newUserChats[0].id}
            }
            
            // user has no chats left
            noChatCallback()
            return {...state, chats:[], currentChat:"", messages:[], peopleTyping:[]}
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