
//return room with the same name
function chatAlreadyExist(chats, chatName){
    let chatExist = chats.some(chat => chat.chatName.toLowerCase() === chatName.toLowerCase())
    return chatExist
}

//bring a particular information about a chat base on chat name(when user is joining)
function getChatDetails(chats, chatName){
    let roomDetails = chats.find(chat => chat.chatName === chatName)
    return roomDetails
}

//bring a particular information about a room based on the id
function getChatById(chats, chatId){return chats.find(chat => chat.id === chatId)}

//user is joining a room with password
function isChatPasswordCorrect(chat, chatId, password){
    return chat.secured.password === password
}


function addMemberToChat(chats, chatId, newMember){
    let newChats = chats.map((chat)=>{
        if(chat.id === chatId)return{...chat, members:[...chat.members, newMember]}
        return chat
    })
    return newChats
}

function getMembersInAChat(chats, chatId){
    return getChatById(chats, chatId).members
}

function getUserChats(chats, userId){
    let userChats = chats.filter(cht => cht.members.find(mem => mem.id === userId))
    return userChats || []
}

// rooms = removeMemberFromRoom(rooms, 'old', 'Getty')
function removeMemberFromChat(chats, chatId, memberId){
    let newChats = chats.map((chat)=>{
        if(chat.id === chatId){
            let newMembers = chat.members.filter(member => member.id !== memberId)
            return {...chat, members:newMembers}
        }
        return chat
    })
    return newChats
}


function getChatMemberById(chats, chatId, memberId){
    let user = null
    chats.map((chat)=>{
        if(chat.id === chatId){
            user = chat.members.find(mem => mem.id === memberId)
        }
    })
    return user
}

// check if a user(id) in a chat is an admin 
function isMemberAdmin(chats, chatId, memberId){
    let isAdmin = getChatMemberById(chats, chatId, memberId).admin
    return isAdmin
}

// this returns the name of a member by his id
function getUserNameById(chats, chatId, userId){
    let chat = chats.find(chat => chat.id === chatId)
    return chat.members.find(mem => mem.id === userId).username
}

function deleteChatWithNotMembers(chats){
    return chats.filter(chat => chat.members.length !== 0)
}

function deleteChat(chats, chatId){
    return chats.filter(chat => chat.id !== chatId)
}

function deleteConversation(conversations, conversationId){
    return conversations.filter(con => con.chatId !== conversationId)
}


function addMessageToConversation(conversations, messageDetails){
    let {chatId, message, time, id, username, userId, accentColor} = messageDetails
    let newConversations = conversations.map((chat)=>{
        if(chat.chatId === chatId){
            return {...chat, messages:[...chat.messages, {message, time, id, username, userId, accentColor}]}
        }
        return chat
    })

    return newConversations
}

function getAllMessagesOfAChat(conversations, chatId){
    let conversation = conversations.find(cn => cn.chatId === chatId)
    if(conversation) return conversation.messages
    return [] 
}

// get a chat's name based on its id
function getChatName(chats, chatId){
    return getChatById(chats, chatId).chatName
}

 function postImage(images, image, id){
     return [...images, {id, image}]
 }

// function getImage(images, id){
//     let image = images.find(image => image.id === id)
//     return image
// }

function createUserSocket(socketId, userId, username, chats){
    return {id:socketId, userId, username, chats}
}

function addUserToSockets(sockets, newUserSocket){
    return [...sockets, newUserSocket]
}

function removeUserFromSocket(sockets, socketId){
    return sockets.filter(sck => sck.id !== socketId)
}

function addChatToUserSocket(sockets, userId, chatId){
    let newSockets = sockets.map((sck)=>{
        if(sck.userId === userId){
            return {...sck, chats:[...sck.chats, chatId]}
        }
        return sck
    })
    return newSockets
}

function removeChatFromUserSocket(sockets, userId, chatId){
    let newSockets = sockets.map((sck)=>{
        if(sck.userId === userId){
            return {...sck, chats:sck.chats.filter(cht => cht !== chatId)}
        }
        return sck
    })
    return newSockets
}

module.exports = {
    chatAlreadyExist,
    getChatName,
    getChatDetails,
    getChatById,
    isChatPasswordCorrect,
    addMemberToChat,
    getMembersInAChat,
    getUserChats,
    getChatMemberById,
    isMemberAdmin,
    getUserNameById,
    removeMemberFromChat,
    deleteChat,
    deleteChatWithNotMembers,
    deleteConversation,

    addMessageToConversation,
    getAllMessagesOfAChat,
    postImage,
    // getImage,

    createUserSocket,
    addUserToSockets,
    removeUserFromSocket,
    addChatToUserSocket,
    removeChatFromUserSocket
}