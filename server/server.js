const express = require('express');
const morgan = require('morgan');
const cors = require('cors')
const http = require('http');
const {Server} = require('socket.io')

const {idGenerator, createNewChat, createNewMember, createConversation, createMessage} = require('./utils')
const {sendMessage, sendData, sendError} = require('./response')

const {chatAlreadyExist, getChatName, getChatDetails, getChatById, isChatPasswordCorrect, addMemberToChat,
  getMembersInAChat, getChatMemberById, removeMemberFromChat, deleteChat, deleteChatWithNotMembers,
    addMessageToConversation, getAllMessagesOfAChat, postImage
} = require('./helpers')

const {CONNECTION, DISCONNECT, CREATE_CHAT, JOIN_CHAT, SOMEONE_JOINED,
    LEAVE_CHAT, SOMEONE_LEFT,
    SEND_MESSAGE, RECEIVED_MESSAGE, TYPING, PERSON_IS_TYPING
} = require('./constance')

const app = express()
app.use(cors())
app.use(morgan('tiny'))
app.use(express.json({limit:'30mb', extended:true}))
const server = http.createServer(app)

const PORT = process.env.port || 4000


let chats = [
//   {id:'1', coverPhoto:'', chatName:"Hell's kitchen 🔥🔥🔥", secured:{status:false, password: 'canopy'},
//       members:[
//           {id:'1', username: 'Robert', admin:true, profilePhoto:'', accentColor:"rgb(38, 40, 170)"},
//           {id:'21', username: 'Jessica', admin:false, profilePhoto:'', accentColor:"rgb(89, 141, 29)"},
//       ]
//   },
]

let conversations = [
//  {
//     chatId:'1',
//      messages:[
//        {id:'101', userId:'21', username:'Jessica', message:'Hello everyone', time:'10:30', accentColor:"rgb(38, 40, 170)"},
//      ],
//  },
]

let images = [
    // {id:'23', image:'string'}
]

// Setup socket io
const io = new Server(server, {
    cors:{
        // origin: "http://localhost:5173",
        // origin: "https://web-chatt.netlify.app",
        origin:"https://jmtesting.netlify.app",
        methods:["GET", "POST"],
        credentials: true
    }
})


app.get('/', (req, res) => {
    res.send('ChatBitz Server 1');
});

//create new chat
app.post('/api/create-chat', async(req, res)=>{
    const {chatName, username, id, secured, accentColor, profilePhoto} = req.body

    try {
        let chatExist = chatAlreadyExist(chats, chatName)
        if(chatExist)return sendError(res, "Chat Exists", 400, "Chat name already exists")

        // upload the profile images if they have one
        let profilePhotoId = null

        if(profilePhoto){
            profilePhotoId = idGenerator()
            images = postImage(images, profilePhoto, profilePhotoId)
        }

        // create new room with the admin in
        let newChat = createNewChat(chatName, username, id, secured, accentColor, profilePhotoId)
        chats = [...chats, newChat]

        // create new conversation
        let newConversation = createConversation(newChat.id)
        conversations = [...conversations, newConversation]

        let sendResults  = {chatDetails:newChat}

        sendData(res, 201, sendResults, "Chat created successfully")

    } catch (error) {
        sendError(res, error, 404, "Failed to create chat")
    }
})

// join a chat. also sends error to user to input password if chat is locked
app.post('/api/join-chat', async(req, res)=>{
    const {chatName, username, id, profilePhoto, accentColor, password} = req.body

     try {
        let chat = getChatDetails(chats, chatName)
        if(!chat) return sendError(res, "Join Chat Failed", 404, "Sorry, chat does not exist")

//       check if chat is password protected
        let secured = chat.secured.status
        if(secured && !password) return sendError(res, "Provide Password", 404, "Enter password to join chat")

//       verify password if chat is password protected
        if(secured && password){
            let passwordIsCorrect = isChatPasswordCorrect(chat, chatName, password)
            if(!passwordIsCorrect) return sendError(res, "Invalid Password", 400, "Invalid password")
        }

        // they are free to join

        // upload the profile images if they have one
        let profilePhotoId = null

        if(profilePhoto){
            profilePhotoId = idGenerator()
            images = postImage(images, profilePhoto, profilePhotoId)
        }

        images = postImage(images, profilePhoto, profilePhotoId)

        let newMember = createNewMember(username, id, false, profilePhoto, accentColor)
        chats = addMemberToChat(chats, chat.id, newMember)

        // get all messages from the chat
        let messages = getAllMessagesOfAChat(conversations, chat.id)
        let chatDetails = getChatDetails(chats, chatName)
        let sendResults = {chatDetails, messages}

        sendData(res, 200, sendResults, "Chat joined successfully")

    } catch (error) {
        sendError(res, error, 404, "Failed to join chat")
    }
})

//when the front gets a successfull response from this, socket from front someone left
app.patch('/api/leave-chat', (req,res)=>{
    let {chatId, id} = req.body //userId

    try {
        chats = removeMemberFromChat(chats, chatId, id)
        let sendResults = chatId
        sendData(res, 200, sendResults, "Chat left successfully")
     } catch (error) {
         sendError(res, error, 404, "Failed to leave chat")
     }
})


//SOCKET INTERACTIONS
io.on(CONNECTION, (socket)=>{
    console.log(socket.id, 'connected')
    socket.emit('connected', 'You connected with')

    // creating a chat
    socket.on(CREATE_CHAT, (chatDetails)=>{
        // let creator = createNewMember(username, userId, false, null, accentColor) //create user
        socket.join(chatDetails.id)
        console.log(chatDetails.chatName, 'created')
    })

    // joining a chat
    socket.on(JOIN_CHAT, (chatIdAndUserDetails)=>{
        const {id, userId, username, accentColor} = chatIdAndUserDetails
        socket.join(id)
        let newUser = {username, userId,  profilePhoto:null, accentColor, admin:false}
        // emit a joined message and add to the chat messages
        let joinMsg = createMessage(id, 'join', username, `${username} joined`, accentColor)
        conversations = addMessageToConversation(conversations, joinMsg)
        // emit to other users someone joined with new user data
        socket.to(id).emit(SOMEONE_JOINED, {joinMsg, id, newUser})
        // console.log('joining', chatIdAndUserDetails)
        console.log(`${username} joined ${id}`)
    })

    socket.on(LEAVE_CHAT, (chatIdAndUserDetails)=>{
        const {id, username, userId} = chatIdAndUserDetails
        // remove user from chat
        // disconnect via socket
        // send message and emit to other members
        chats = removeMemberFromChat(chats, id, userId)
        let leaveMsg = createMessage(id, 'left', username, `${username} left`, null)
        conversations = addMessageToConversation(conversations, leaveMsg)
        socket.leave(id)
        socket.to(id).emit(SOMEONE_LEFT, {leaveMsg, id, userId})
    })

    socket.on(SEND_MESSAGE, (msgDetails)=>{
        // add message to conversation and emit to other users
        const {chatId, userId, username, accentColor, message, time} = msgDetails
        let newMessage = createMessage(chatId, userId, username, message, accentColor, time)
        conversations = addMessageToConversation(conversations, newMessage)
        socket.to(chatId).emit(RECEIVED_MESSAGE, newMessage)
    })

    socket.on(TYPING, (chatIdAndUsername)=>{
        const {id, username} = chatIdAndUsername
        socket.to(id).emit(PERSON_IS_TYPING, chatIdAndUsername)
    })

    socket.on(DISCONNECT, ()=>{
        console.log(socket.id, ' disconnected')
    })
}) 

server.listen(PORT, () => console.log(`listening on ${PORT}`))