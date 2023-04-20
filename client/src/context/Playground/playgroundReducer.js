import { playgroundActions } from "../../utils/actions"
const {SHOW_MOBILE_CHATS, SHOW_LEAVE_CHAT, SHOW_CHAT_DETAILS,
    SHOW_YOU_WERE_REMOVED, SHOW_NOT_ADMIN,
} = playgroundActions


const state = {
    showMobileChats:false,
    showLeaveChat:false,
    showChatDetails:false,
    showRemoveUser:false,
    showNotAdmin:false,
    showYouWereRemoved:false
}

function playgroundReducer(state, action){
    const {type, payload} = action
    switch(type){
        case(SHOW_MOBILE_CHATS):{
            return {...state, showMobileChats:payload}
        }
        case(SHOW_LEAVE_CHAT):{
            return {...state, showLeaveChat:payload}
        }
        case(SHOW_CHAT_DETAILS):{
            return {...state, showChatDetails:payload}
        }
        case(SHOW_YOU_WERE_REMOVED):{
            return {...state, showYouWereRemoved:payload}
        }
        case(SHOW_NOT_ADMIN):{
            return {...state, showNotAdmin:payload}
        }
    }

    return state
}

export {state, playgroundReducer}