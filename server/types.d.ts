type ChatMember = {
    id:string
    username:string
    isAdmin:boolean
    accentColor:string
}

type ActiveUser = {
    socketId:string
    id:string
    username:string
    accentColor:string
    chats: {chatId:string, isAdmin:boolean}[]
}


interface IChat {
    chatName:string
    id:string
    members:ChatMember[]
    secured:{status:boolean, password:string}
}



export {
    IChat,
    ChatMember,
    ActiveUser,
}
