// actions types for all reducers

export const userActions = {
    SET_USER:"SET-USER",
    EDIT_USER:"EDIT-USER"
}

export const chatActions = {
    SET_CURRENT_CHAT:"SET-CURRENT-CHAT",
    AUTO_SET_CURRENT_CHAT:"AUTO-SET-CURRENT-CHAT", //automatically set current chat. useful when user leave or gets removed from a chat
    ADD_CHAT:"ADD-CHAT", //add a chat id to users chats
    LEAVE_CHAT:"LEAVE-CHAT", // remove a chat id from users chat
    ADD_MEMBER_TO_CHAT:"ADD-MEMBER-TO-CHAT",
    REMOVE_MEMBER_FROM_CHAT:"REMOVE-MEMBER-FROM-CHAT",
    ADD_MESSAGE:"ADD-MESSAGE",
    SOMEONE_TYPING:"SOMEONE-TYPING",
}

export const playgroundActions = {
    SHOW_MOBILE_CHATS:"SHOW-MOBILE-CHATS",
    SHOW_LEAVE_CHAT:"SHOW-LEAVE-CHAT",
    SHOW_CHAT_DETAILS:"SHOW-CHAT-DETAILS",
    SHOW_YOU_WERE_REMOVED:"SHOW-YOU-WERE-REMOVED",
    SHOW_NOT_ADMIN:"SHOW-NOT-ADMIN"
}