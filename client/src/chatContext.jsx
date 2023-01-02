import {useState, createContext} from 'react'
import {io} from 'socket.io-client'
import { ENDPOINT } from './utils/constance'


export const ChatContext = createContext()

// how a chat obj look like
const _Chat = {
    id:'id',
    chatName:'Chat name',
    coverPhoto:'',
    members:[],
    secured:{status:false, password:''}
}

// const Chats = [
//     {id:'1', coverPhoto:'', chatName:"Hell's kitchen 🔥🔥🔥", secured:{status: false, password: 'canopy'},
//         members:[
//             {id:'1', username: 'Robert', admin:true, profilePhoto:'', accentColor:"rgb(38, 40, 170)"},
//             {id:'21', username: 'Jessica', admin:true, profilePhoto:'', accentColor:"rgb(89, 141, 29)"},
//             {id:'3', username: 'Cynthia', admin:false, profilePhoto:'', accentColor:"rgb(29, 141, 76)"},
//             {id:'5', username: 'Gina', admin:false, profilePhoto:'', accentColor:"rgb(99, 32, 131)"},
//             {id:'6', username: 'Alexander', admin:false, profilePhoto:'', accentColor:"rgb(18, 112, 112)"},
//             {id:'2', username: 'Bruce', admin:false, profilePhoto:'', accentColor:"rgb(148, 11, 125)"},
//             {id:'4', username: 'David', admin:false, profilePhoto:'', accentColor:"red"},
//             // {id:'3', username: 'Cynthia', admin:false, profilePhoto:'', accentColor:"rgb(29, 141, 76)"},
//             // {id:'5', username: 'Gina', admin:false, profilePhoto:'', accentColor:"rgb(99, 32, 131)"},
//             // {id:'6', username: 'Alexander', admin:false, profilePhoto:'', accentColor:"rgb(18, 112, 112)"},
//             // {id:'2', username: 'Bruce', admin:false, profilePhoto:'', accentColor:"rgb(148, 11, 125)"},
//             // {id:'4', username: 'David', admin:false, profilePhoto:'', accentColor:"red"},
//             // {id:'3', username: 'Cynthia', admin:false, profilePhoto:'', accentColor:"rgb(29, 141, 76)"},
//             // {id:'5', username: 'Gina', admin:false, profilePhoto:'', accentColor:"rgb(99, 32, 131)"},
//             // {id:'6', username: 'Alexander', admin:false, profilePhoto:'', accentColor:"rgb(18, 112, 112)"},
//             // {id:'2', username: 'Bruce', admin:false, profilePhoto:'', accentColor:"rgb(148, 11, 125)"},
//             // {id:'4', username: 'David', admin:false, profilePhoto:'', accentColor:"red"},
//         ]
//     },
//    {id:'2', coverPhoto:'', chatName:'The pentecost church', secured:{status: false, password: 'canopy'},
//        members: [
//            {id:'1', username: 'Malvin', admin:true, profilePhoto:'', accentColor:"red"},
//            {id:'2', username: 'Cynthia', admin:false, profilePhoto:'', accentColor:'green'},
//        ]},
//   ]

// const Messages = [
//     {id:'101', userId:'101', username:'Jessica', message:'Hello everyone', time:'10:30', accentColor:"rgb(38, 40, 170)"},
//     {id:'102', userId:'1', username:'Robert', message:'How are we all doing', time:"10:41", accentColor:"rgb(89, 141, 29)"},
//     // {id:'104', userId:'join', username:'Abigail', message:'Abigail Joined', time:'11:40'},
//     // {id:'104', userId:'left', username:'Abigail', message:'Abigail left', time:'12:9'},
//     // {id:'102', userId:'4', username:'David', message:'We are all good', time:"10:41", accentColor:"rgb(89, 141, 29)"},
//     // {id:'102', userId:'1', username:'Robert', message:'How are we all doing', time:"10:41", accentColor:"rgb(89, 141, 29)"},
//     // {id:'104', userId:'2', username:'Abigail', message:'Abigail Joined', time:'11:40'},
//     // {id:'104', userId:'2', username:'Abigail', message:'Abigail left', time:'12:9'},
//     // {id:'102', userId:'1', username:'Robert', message:'How are we all doing', time:"10:41", accentColor:"rgb(89, 141, 29)"},
//     // {id:'104', userId:'2', username:'Abigail', message:'Abigail Joined', time:'11:40'},
//     // {id:'104', userId:'2', username:'Abigail', message:'Abigail left', time:'12:9'},
// ]

export default function ChatProvider({children}){
    const [chats, setChats] = useState({loading:false, error:false, fetched:false, chatsData:[]})
    const [socket, setSocket] = useState(null)
    const [performActionBeforeStartUp, setPerformActionBeforeStartUp] = useState({action:'', chatDetails:null}) //when playgrounds mounts, this will store details either creating or joining a chat 
    const [currentChat, setCurrentChat] = useState('1')
    const [messages, setMessages] = useState([])
    const [sharedMessage, setSharedMessage] = useState('') //message to be shared btn input and popupInput 
    const [peopleTyping, setPeopleTyping] = useState([]) //people typing in a current chat
    const [leaveChat, setLeaveChat] = useState({show:false, chatId:null}) //current chat id and modal to leave a chat

    const connectToServer = ()=>{
        let connected = io.connect(ENDPOINT, {car:'car'})
        setSocket(connected)
    }

    // get the current chats details
    const getCurrentChatDetails = ()=>{
        let chat = chats.chatsData.find(cht => cht.id === currentChat)
        if(chat) return chat
        return _Chat
    }
    
    const value = {
        socket, connectToServer,
        performActionBeforeStartUp, setPerformActionBeforeStartUp,
        chats, setChats,
        currentChat, setCurrentChat, getCurrentChatDetails,
        messages, setMessages,
        sharedMessage, setSharedMessage,
        peopleTyping, setPeopleTyping,
        leaveChat, setLeaveChat
    }

    return <ChatContext.Provider value={value}>
        {children}
    </ChatContext.Provider>
}