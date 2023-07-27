const crypto = require('crypto')

function idGenerator(){
    return crypto.randomUUID()
}

function createNewMember(username, id, admin, profilePhoto, accentColor){
    return {id, username, admin, profilePhoto, accentColor}
}

// creating a whole chat where others would join
function createNewChat(chatName, creator, creatorId, secured, accentColor, profilePhoto){
    let admin = createNewMember(creator, creatorId, true, profilePhoto, accentColor)
    return {
        id:idGenerator(),
        chatName,
        coverPhoto:'',
        members:[admin],
        secured:secured
    }
}

// creating an object of conversations
function createConversation(chatId){
    let newConversation = {chatId:chatId, messages:[]}
    return newConversation
}

function createNewActiveUser(socketId, userId, username, accentColor, chats){
    return {socketId, userId, username, accentColor, chats:[...chats]}
}

// just a message being sent by a user
function createMessage(type, chatId, userId, username, message, accentColor, time){
    return {
        type,
        chatId,
        id: idGenerator(), //msgId
        userId, username, message, accentColor,
        // dont use this time if client sends its time.
        time: time || new Date(Date.now()).getHours() + " : " + new Date(Date.now()).getMinutes()
    }
}

module.exports = {idGenerator, createNewMember, createNewChat,
    createConversation, idGenerator, createMessage, createNewActiveUser
}