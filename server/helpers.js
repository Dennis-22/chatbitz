
//return room with the same name
function chatAlreadyExist(chats, chatName){
    let chatExist = chats.some(chat => chat.chatName.toLowerCase() === chatName.toLowerCase())
    return chatExist
}

//bring a particula information about a chat base on chat name(when user is joining)
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

function deleteChatWithNotMembers(chats){
    return chats.filter(chat => chat.members.length !== 0)
}

function deleteChat(chats, chatId){
    return chats.filter(chat => chat.id !== chatId)
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

module.exports = {
    chatAlreadyExist,
    getChatName,
    getChatDetails,
    getChatById,
    isChatPasswordCorrect,
    addMemberToChat,
    getMembersInAChat,
    getChatMemberById,
    removeMemberFromChat,
    deleteChat,
    deleteChatWithNotMembers,

    addMessageToConversation,
    getAllMessagesOfAChat,
    postImage,
    // getImage,
}