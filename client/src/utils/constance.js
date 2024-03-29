const screenSizes = {large: 1000, small: 770}


// ids of messages neither user nor participants 
const defMsgTypes = ['leave', 'join', 'user-removed', 'left-unexpectedly', 'rejoined']

// character limit user can input for chat name and username
const charsAllowed = {
    chatName:15,
}

const accentColors = [
    "rgb(18, 112, 112)",
    "rgb(99, 32, 131)",
    "rgb(29, 81, 158)",
    "rgb(29, 141, 76)",
    "rgb(89, 141, 29)",
    "rgb(38, 40, 170)",
    "rgb(141, 132, 0)",
    "rgb(148, 11, 125)",
    "rgb(148, 11, 68)",
    "rgb(148, 11, 34)",
    "rgb(136, 16, 16)",
    "rgb(16, 136, 22)"
]

const socketConstance = {
    CONNECTION:'connection',
    DISCONNECT: 'disconnect',
   
    CREATE_CHAT: 'create chat',
    JOIN_CHAT:'join chat',
    SOMEONE_JOINED:'someone joined',
    LEAVE_CHAT: 'leave chat',
    SOMEONE_LEFT:   'someone left',

    REJOIN_CHAT:'rejoin chat',
    SOMEONE_REJOINED:'some rejoined',

    REMOVE_MEMBER:'remove member',
    REMOVE_MEMBER_FAILED:'remove member failed',
    SOMEONE_WAS_REMOVED:'someone were removed',
    I_WAS_REMOVED:'i was removed',

    SEND_MESSAGE:'send message',
    RECEIVED_MESSAGE: 'received message',
   
    TYPING: 'typing',
    PERSON_IS_TYPING: 'person is typing'
}


export {screenSizes, accentColors, defMsgTypes, socketConstance, charsAllowed}