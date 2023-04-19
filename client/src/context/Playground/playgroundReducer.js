import { playgroundActions } from "../../utils/actions"
const {SHOW_MOBILE_CHATS, SHOW_LEAVE_CHAT} = playgroundActions
// const [showMobileChats, setShowMobileChats] = useState(false) //chats display on mobile devices
// const [showMobileChatDetails, setShowMobileChatDetails] = useState(false) //chat display on mobile devices
// const [showChatMemberDetails, setShowChatMemberDetails] = useState(_ChatMemberDetails) // when a chat member is clicked
// const [showPopupInput, setShowPopupInput] = useState(false)
// const [showRemovedModal, setShowRemovedModal] = useState({show:false, adminName:''}) //when user is removed - adminName = the admin who removed user
// const [showNotAdminModal, setShowNotAdminModal] = useState(false) 

const state = {
    showMobileChats:false,
    showLeaveChat:false,
    showChatDetails:false,
    showRemoveUser:false,
    showNotAdmin:false
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
    }

    return state
}

export {state, playgroundReducer}