import { userActions } from "../../utils/actions"
import { _User } from "../../utils/types"
const {SET_USER, EDIT_USER} = userActions

const state = {
    user:_User,
    // user:{id:'2', username:"Jessica", accentColor:"red", profilePhoto:""}
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
    }

    return state
}

export {state, userReducer}