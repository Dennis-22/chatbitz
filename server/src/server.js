const http = require('http');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors')
const {Server} = require('socket.io')

const {sendMessage, sendData, sendError} = require('./response')

const {CONNECTION, DISCONNECT, CREATE_CHAT, JOIN_CHAT, SOMEONE_JOINED, REJOIN_CHAT, SOMEONE_REJOINED,
    LEAVE_CHAT, SOMEONE_LEFT, REMOVE_MEMBER, SOMEONE_WAS_REMOVED, I_WAS_REMOVED, REMOVE_MEMBER_FAILED,
    SEND_MESSAGE, RECEIVED_MESSAGE, TYPING, PERSON_IS_TYPING
} = require('./constance')

const {Chat} = require('./utils/chats')
const {Message} = require('./utils/messages')
const {User} = require('./utils/users')


const app = express()

// Cross Origin Resources Sharing
const whiteList = ["http://localhost:5173", "https://chatbitz.netlify.app"]
app.use(cors({
    origin: (origin, callback) => {
        if(whiteList.includes(origin)) callback(null, true)
        else callback(true, new Error("Not allowed by cors"))
    },
    optionsSuccessStatus: 200
}))
app.use(cors())
app.use(morgan('tiny'))
app.use(express.json({limit:'30mb', extended:true}))
const server = http.createServer(app)

const PORT = process.env.port || 4000

// Setup socket io
const io = new Server(server, {
    cors:{
        origin: whiteList,
        methods:["GET", "POST"],
        credentials: true
    }
})


app.get('/', (req, res) => {
    res.send('ChatBitz Server 2');
});

//create new chat
app.post('/api/chat/create', async(req, res)=>{
    const {chatName, username, id, accentColor, secured} = req.body
    try {
        // check if a chat exist with the same name
        const existingChat = Chat.findChatByName(chatName)

        if(existingChat) return sendError(res, "Chat Exists", 400, "Chat already exists. please user a different name")

        const newChat = Chat.createChat(chatName, secured, id, username, accentColor)
        Message.setUpChatMessage(newChat.id)
        sendData(res, 201, newChat, "Chat created successfully")
    } catch (error) {
        sendError(res, error, 404, "Failed to create chat")
    }
})

// join a chat. also sends error to user to input password if chat is locked
app.post('/api/chat/join', (req, res)=>{
    const {chatName, password, username, id, accentColor} = req.body

    try {
        const chat = Chat.findChatByName(chatName)
        if(!chat) return sendError(res, "Join Chat Failed", 404, "Sorry, chat does not exist")
        
        if(chat.secured.status & !password) return sendMessage(res, 204, "Provide Password")

        if(chat.secured.status && password){
            if(chat.secured.password !== password) return sendError(res, "Invalid Password", 400, "Invalid password")
        }

        // add user to chat
        Chat.addMemberToChat(chat.id, {
            id, username, accentColor,
            isAdmin:false,
            accentColor:accentColor
        })

        const updatedChat = Chat.finChatById(chat.id)
        const chatMessages = Message.getChatMessages(chat.id, true) //get all messages
        sendData(res, 200, {chatDetails:updatedChat, chatMessages:chatMessages.messages}, "Chat joined successfully")
    } catch (error) {
        sendError(res, error, 404, "Failed to join chat")
    }
})


// api/user/get-chats/userId=userId&chats=chatId1,chatId2
app.get('/api/user/rejoin-chats/:id', async(req,res)=>{
    const userId = req.params.id

    try {
        const getUserFromRecycle = User.findUserFromBin(userId)
        if(!getUserFromRecycle) return sendMessage(res, 204, "No chats")

        // get all user chats
        const userHasChats = getUserFromRecycle.chats
        if(!userHasChats || userHasChats.length === 0) return sendMessage(res, 204, "No chats")

        // get each chat and messages
        let userChats = []
        let messages = []

        for(let {chatId, isAdmin} of userHasChats){
            const chatDetails = Chat.finChatById(chatId)
            const chatMessages = Message.getChatMessages(chatId, true)
            const {id, username, accentColor} = getUserFromRecycle
            const member = {id, username, accentColor, isAdmin}
            Chat.addMemberToChat(chatId, member)
            userChats.push(chatDetails)
            messages.push(chatMessages)
        }
        sendData(res, 200, {userChats, messages})
    } catch (error) {
        sendError(res, error, 400, 'Failed to get user chats')
    }
})

app.get('/api/chat/messages/:chatId', (req, res)=>{
    const {chatId} = req.params
    try {
        const messages = Message.getChatMessages(chatId, true)
        sendData(res, 200, messages)
    } catch (error) {
        sendError(res, error, 400, 'Failed to get chat messages')
    }
})


//SOCKET INTERACTIONS
io.on(CONNECTION, (socket)=>{
    console.log(socket.id, 'connected')
    socket.emit('connected', 'You connected with')

    // get username and id from user

    // creating a chat
    socket.on(CREATE_CHAT, (createChatDetails)=>{
        const {chatId, userId, username, accentColor} = createChatDetails
        socket.join(chatId)        
        const createUser = User.createUser(socket.id, userId, username, accentColor)
        User.addChatToUserChats(createUser.userId, {chatId, isAdmin:true})
    })

    // joining a chat
    socket.on(JOIN_CHAT, (chatIdAndUserDetails)=>{
        const {chatId, userId, username, accentColor} = chatIdAndUserDetails
        
        const createUser = User.createUser(socket.id, userId, username, accentColor)
        User.addChatToUserChats(createUser.userId, {chatId, isAdmin:false})

        socket.join(chatId)
        
        const joinMessage = Message.createMessage({
            type:'join',
            chatId,
            username,
            userId,
            message:`${username} "joined"`,
            accentColor,            
        })

        Message.addMessageToChat(chatId, joinMessage)
        const newUser = {username, id:userId,  profilePhoto:null, accentColor, admin:false}
        socket.to(chatId).emit(SOMEONE_JOINED, {joinMessage, id: chatId, newUser})
    })

    // when user refreshes the browser, the socket gets disconnected 
    // rejoin chats via this socket.
    socket.on(REJOIN_CHAT, (userId)=>{
       
        User.recycleUserToAndFromBin(userId, "move from bin")
        const user = User.findUserById(userId)

        if(!user){
            console.log('No user found in recycle bin')
            return null
        }
        const {id, username, chats, accentColor} = user
        const chatInfoToAddLater = [] //store user chat ids here and 
        for(const {chatId, isAdmin} of chats){
            socket.join(chatId)
            chatInfoToAddLater.push({chatId, isAdmin}) //add chat id and is admin to loop through later
            const rejoinMessage = Message.createMessage({
                type:'rejoined',
                chatId,
                username,
                userId:id,
                message:`${username} rejoined`,
                accentColor,
            })
            Message.addMessageToChat(chatId, rejoinMessage)
            const memberData = {id, username, accentColor, isAdmin}
            socket.to(chatId).emit(SOMEONE_REJOINED, {rejoinMessage, id:chatId, memberData})
        }

        User.changeSocketId(id, socket.id) //update user socket id
    })

    socket.on(LEAVE_CHAT, (chatIdAndUserDetails)=>{
        const {chatId, username, userId} = chatIdAndUserDetails
        Chat.removeMemberFromChat(chatId, userId)
        User.removeChatFromUserChats(userId, chatId)
        socket.leave(chatId) //user sockets disconnects from the chat

        const chat = Chat.finChatById(chatId)
        if(!chat) return null
        const chatMembers = chat.members
        if(chatMembers.length > 0){
            const leaveMessage = Message.createMessage({
                type:'leave',
                chatId,
                username,
                userId,
                message:`${username} left`,
                accentColor:"",      
            })
            Message.addMessageToChat(chatId, leaveMessage)
            socket.to(chatId).emit(SOMEONE_LEFT, {leaveMessage, id: chatId, userId})
        }else{
            Chat.deleteChat(chatId)
            Message.deleteChatMessages(chatId)
        }
        
    })

    socket.on(REMOVE_MEMBER, (props)=>{
        // check if user is an admin before they can remove a member
        // this sends message to other members that a member has been removed
        const {chatId, adminId, adminName, userId} = props

        // check if member is an admin
        const isAdmin = Chat.findMemberInChat(chatId, adminId)?.isAdmin
        if(!isAdmin) return io.to(chatId).emit(REMOVE_MEMBER_FAILED, adminId)
        
        const memberBeingRemovedName = Chat.findMemberInChat(chatId, userId) //get the name of the user being removed
        Chat.removeMemberFromChat(chatId, userId) // remove member from chat
        User.removeChatFromUserChats(userId, chatId) // remove chat from the user's chats
        
        // send removed message to the chat
        const removeMemberMessage = Message.createMessage({
            type:'user-removed',
            chatId,
            username:memberBeingRemovedName.username,
            userId,
            message:`${adminName} removed ${memberBeingRemovedName.username}`,
            accentColor:"",      
        })

        Message.addMessageToChat(chatId, removeMemberMessage)
        io.to(chatId).emit(SOMEONE_WAS_REMOVED, {userId, chatId, message:removeMemberMessage})
    })

    // the person removed from a chat emits this socket to disconnect form socket 
    socket.on(I_WAS_REMOVED, (chatId)=>{
        socket.leave(chatId)
    })

    socket.on(SEND_MESSAGE, (msgDetails)=>{
        const {id, chatId, userId, username, accentColor, message, time} = msgDetails
        
        const newMessage = Message.createMessage({
            id, chatId, userId, username, accentColor, message, time,
            type:"message", 
        })
        
        Message.addMessageToChat(chatId, newMessage) //add message to chat
        socket.to(chatId).emit(RECEIVED_MESSAGE, newMessage) //send message to members
    })

    socket.on(TYPING, (typingDetails)=>{
        const {chatId} = typingDetails
        socket.to(chatId).emit(PERSON_IS_TYPING, typingDetails)
    })

    socket.on(DISCONNECT, ()=>{
        //find the disconnected user
        //remove the user from all chats
        //if there are other members in the user's chat, send messages to other members user disconnected
        //if there are no members, don't send any message and delete the chat
        const user = User.findUserBySocketId(socket.id) //get the disconnected user
        if(user){
            if(user.chats.length > 0){
                for(const chat of user.chats) {
                    Chat.removeMemberFromChat(chat.chatId, user.id)
                    if(Chat.finChatById(chat.chatId).members.length > 0){
                        const leaveMessage = Message.createMessage({
                            type:'left-unexpectedly',
                            chatId:chat.chatId,
                            username:user.username,
                            userId:user.id,
                            message:`${user.username} left unexpectedly`,
                            accentColor:"",      
                        })
                        Message.addMessageToChat(chat.chatId, leaveMessage)
                        socket.to(chat.chatId).emit(SOMEONE_LEFT, {leaveMessage, id:chat.chatId, userId:user.id})
                        socket.leave(chat.chatId)
                    }else{
                        Chat.deleteChat(chat.id)
                        Message.deleteChatMessages(chat.id)
                    }
                }
            }
            User.recycleUserToAndFromBin(user.id, "move to bin") //move user to recycle bin
        }
        
        console.log(socket.id, 'disconnected')
    })
}) 

server.listen(PORT, () => console.log(`listening on ${PORT}`))