const socketConstance = {
    CONNECTION:'connection',
    DISCONNECT: 'disconnect',
   
    CREATE_CHAT: 'create chat',
    JOIN_CHAT:'join chat',
   
    SOMEONE_JOINED:'someone joined',
    LEAVE_CHAT: 'leave chat',
    SOMEONE_LEFT:   'someone left',

    REMOVE_USER:'remove-user',
    SOMEONE_WAS_REMOVED:'someone-were-removed',

    SEND_MESSAGE:'send message',
    RECEIVED_MESSAGE: 'received message',
   
    TYPING: 'typing',
    PERSON_IS_TYPING: 'person is typing'
}

module.exports = socketConstance