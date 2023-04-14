import { userActions } from "../../utils/actions"
const {SET_USER, EDIT_USER, ADD_CHAT, REMOVE_CHAT} = userActions

const state = {
    user:{username:"", id:"", profilePhoto:"", accentColor:""},
    chats:[] // array of chat ids
}

function userReducer(state, action){
    const {type, payload} = action
    switch(type){
        case(SET_USER):{
            return {...state, user:payload}
        }
        case(EDIT_USER):{
            return {...state, user:{...state.user, ...payload}}
        }
        case(ADD_CHAT):{
            return {...state, chats:[...state.chats, payload]}
        }
        case(REMOVE_CHAT):{
            return {...state, chats:state.chats.filter(chat => ! payload)}
        }
    }

    return state
}

export {state, userReducer}