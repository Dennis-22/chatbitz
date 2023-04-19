// actions types for all reducers

export const userActions = {
    SET_USER:"SET-USER",
    EDIT_USER:"EDIT-USER",
    ADD_CHAT:"ADD-CHAT", //add a chat id to users chats
    REMOVE_CHAT:"REMOVE-CHAT" // remove a chat id from users chat
}

export const chatActions = {
    SET_CURRENT_CHAT:"SET-CURRENT-CHAT",
    ADD_CHAT:"ADD-CHAT", //add a chat id to users chats
    LEAVE_CHAT:"LEAVE-CHAT", // remove a chat id from users chat
    ADD_MEMBER_TO_CHAT:"ADD-MEMBER-TO-CHAT",
    REMOVE_MEMBER_FROM_CHAT:"REMOVE-MEMBER-FROM-CHAT",
    ADD_MESSAGE:"ADD-MESSAGE"
}

export const playgroundActions = {
    SHOW_MOBILE_CHATS:"SHOW-MOBILE-CHATS",
    SHOW_LEAVE_CHAT:"SHOW-LEAVE-CHAT",
}