const express = require('express');
const morgan = require('morgan');
const cors = require('cors')
const http = require('http');
const {Server} = require('socket.io')

const {idGenerator, createNewChat, createNewMember, createConversation, createMessage} = require('./utils')
const {sendMessage, sendData, sendError} = require('./response')

const {chatAlreadyExist, getChatName, getChatDetails, getChatById, isChatPasswordCorrect, addMemberToChat,
  getMembersInAChat, getUserChats, getChatMemberById, removeMemberFromChat, deleteChat, deleteChatWithNotMembers,
    addMessageToConversation, getAllMessagesOfAChat, postImage,
    createUserSocket, addUserToSockets, removeUserFromSocket, addChatToUserSocket, removeChatFromUserSocket
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
//   {id:'1', coverPhoto:'', chatName:"Hell 🔥🔥🔥", secured:{status:false, password: 'canopy'},
//       members:[
//         {id:'621', username: 'Jessica', admin:true, profilePhoto:'', accentColor:"rgb(89, 141, 29)"},
//       ]
//   },
//   {id:'2', coverPhoto:'', chatName:"Kitchen", secured:{status:false, password: 'canopy'},
//   members:[
//         {id:'21', username: 'Jessica', admin:true, profilePhoto:'', accentColor:"rgb(89, 141, 29)"},
//       {id:'2', username: 'Lucy', admin:false, profilePhoto:'', accentColor:"rgb(89, 141, 29)"},
//   ]
// },
]

let conversations = [
//  {
//     chatId:'1',
//     messages:[
//         {id:'6101', userId:'21', username:'Jessica', message:'Hello everyone', time:'10:30', accentColor:"rgb(38, 40, 170)"},
//         {id:'104', userId:'join', username:'Cynthia', message:'Cynthia Joined', time:'10:30'},
//         {id:'101', userId:'101', username:'Cynthia', message:'Hello', time:'10:31', accentColor:"rgb(38, 40, 170)"},
//         {id:'102', userId:'1', username:'Robert', message:'How are we all doing', time:"10:31", accentColor:"rgb(89, 141, 29)"},
//     ],
//  },
]

let images = [
    // {id:'23', image:'string'}
]

let sockets = [
    // {id:'sck', userId:'', username:'', chats:["chatId","chatId"]}
]


// Setup socket io
const io = new Server(server, {
    cors:{
        origin: "http://localhost:5173",
        // origin:"https://chatbitz.netlify.app",
        methods:["GET", "POST"],
        credentials: true
    }
})


app.get('/', (req, res) => {
    res.send('ChatBitz Server 1.5');
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

app.get('/api/get-user-chats/:userId', async(req,res)=>{
    console.log('fetching user chats')
    const {userId} = req.params
    try {
        let userChats = getUserChats(chats, userId)
        sendData(res, 200, userChats)
    } catch (error) {
        sendError(res, error, 400, 'Failed to get user chats')
    }
})

app.get('/api/get-chat-messages/:chatId', (req, res)=>{
    console.log('fetching chat messages')

    const {chatId} = req.params
    try {
        let messages = getAllMessagesOfAChat(conversations, chatId)
        sendData(res, 200, messages)
    } catch (error) {
        sendError(res, error, 400, 'Failed to get chat messages')
    }
})

//when the front gets a successful response from this, socket from front someone left
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

    // get username and id from user

    // creating a chat
    socket.on(CREATE_CHAT, (chatDetails)=>{
        socket.join(chatDetails.id)

        // get username, id and chat and add store in socket array
        let user = chatDetails.members[0] //creator/admin will be the only user
        let userSocket = createUserSocket(socket.id, user.id, user.username, [chatDetails.id])
        sockets = addUserToSockets(sockets, userSocket)
      
        // console.log(chatDetails.chatName, 'created')
    })

    // joining a chat
    socket.on(JOIN_CHAT, (chatIdAndUserDetails)=>{
        const {id, userId, username, accentColor} = chatIdAndUserDetails
        socket.join(id)
        let newUser = {username, userId,  profilePhoto:null, accentColor, admin:false}
        
        // add user to socket
        let userSocket = createUserSocket(socket.id, userId, username, [id])
        sockets = addUserToSockets(sockets, userSocket)

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
        
        // remove chats from user socket
        sockets = removeChatFromUserSocket(sockets, userId, id)
        socket.leave(id)
        // check if there is any member left in the chat and delete it
        let membersInChat = getMembersInAChat(chats, id)
        if(membersInChat.length > 0){
            socket.to(id).emit(SOMEONE_LEFT, {leaveMsg, id, userId})
        }else{
            // delete the chat and socket
            chats = deleteChat(chats, id)
            // socket.delete(id) //delete the socket room
        }
    })

    socket.on(SEND_MESSAGE, (msgDetails)=>{
        // add message to conversation and emit to other users
        const {chatId, userId, username, accentColor, message, time} = msgDetails
        let newMessage = createMessage(chatId, userId, username, message, accentColor, time)
        conversations = addMessageToConversation(conversations, newMessage)
        socket.to(chatId).emit(RECEIVED_MESSAGE, newMessage)
    })

    socket.on(TYPING, (chatIdAndUsername)=>{
        const {id} = chatIdAndUsername
        socket.to(id).emit(PERSON_IS_TYPING, chatIdAndUsername)
    })

    socket.on(DISCONNECT, ()=>{
        // when a user leaves or disconnects without using the right channel
        // by using the socket id, get the chat user was in and emit user left

        let userSocket = sockets.find(socketId => socketId.id === socket.id)
     
        if(userSocket){
            // check if user has his id in any of the chats.
            if(userSocket.chats.length > 0){
                            // get all chats user is in, check if there are any members and emit user left
                for(let chatId of userSocket.chats){
                    chats = removeMemberFromChat(chats, chatId, userSocket.userId) //remove user from chat

                    let membersInChat = getMembersInAChat(chats, chatId)
                    if(membersInChat.length > 0){ // there are other members in the chat. greater than 1 cos the user leaving counts as 1
                        // let joinMsg = createMessage(id, 'join', username, `${username} joined`, accentColor)

                        let leaveMsg = createMessage(chatId, 'left', userSocket.username, `${userSocket.username} left`, null)
                        conversations = addMessageToConversation(conversations, leaveMsg)

                        socket.to(chatId).emit(SOMEONE_LEFT, {leaveMsg, id:chatId, userId:userSocket.userId})
                        socket.leave(chatId)
                    }else{ //there are no other members
                        chats = deleteChat(chats, chatId)
                    }
                }
            }
        }
        
        console.log(socket.id, ' disconnected')
    })
}) 

server.listen(PORT, () => console.log(`listening on ${PORT}`))