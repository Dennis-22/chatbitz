import { playgroundActions } from "../../utils/actions"
const {SHOW_MOBILE_CHATS, SHOW_LEAVE_CHAT} = playgroundActions

export function ToggleMobileChats(dispatch, showOrClose){
    return dispatch({type:SHOW_MOBILE_CHATS, payload:showOrClose})
}

export function ToggleLeaveChat(dispatch, showOrClose){
    return dispatch({type:SHOW_LEAVE_CHAT, payload:showOrClose})
}