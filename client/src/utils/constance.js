const screenSizes = {large: 1000, small: 770}

const ENDPOINT = 'http://localhost:4000'
// export const ENDPOINT = 'https://web-chat-backend-server.herokuapp.com'

const api = {
    createChat: `${ENDPOINT}/api/create-chat`,
    joinChat: `${ENDPOINT}/api/join-chat`
}

// ids of messages neither user nor participants 
const defMsgsIds = ['left', 'join']

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

    REMOVE_USER:'remove-user',
    SOMEONE_WAS_REMOVED:'someone-were-removed',

    SEND_MESSAGE:'send message',
    RECEIVED_MESSAGE: 'received message',
   
    TYPING: 'typing',
    PERSON_IS_TYPING: 'person is typing'
}


export {screenSizes, accentColors, ENDPOINT, api, defMsgsIds, socketConstance}