const express = require('express');
const morgan = require('morgan');
const cors = require('cors')
const http = require('http');
const {Server} = require('socket.io')

const {idGenerator, createNewChat, createNewActiveUser, createNewMember, createConversation, createMessage} = require('./utils')
const {sendMessage, sendData, sendError} = require('./response')

const {chatAlreadyExist, getChatName, getChatDetails, getChatById, isChatPasswordCorrect, addMemberToChat,
  getMembersInAChat, isUserAMemberOfChat, getUserChats, addUserToRecycleBin, getUserFromRecycleBin, removeUserFromRecycleBin,
  getChatMemberById, isMemberAdmin, getUserNameById, removeMemberFromChat, deleteChat, deleteChatWithNotMembers, deleteConversation,
    addMessageToConversation, getAllMessagesOfAChat, postImage, 
    addUserToActiveUsers, addChatToActiveUser, removeUserFromActiveUsers, removeChatFromActiveUser
} = require('./helpers')

const {CONNECTION, DISCONNECT, CREATE_CHAT, JOIN_CHAT, SOMEONE_JOINED, REJOIN_CHAT, SOMEONE_REJOINED,
    LEAVE_CHAT, SOMEONE_LEFT, REMOVE_MEMBER, SOMEONE_WAS_REMOVED, I_WAS_REMOVED, REMOVE_MEMBER_FAILED,
    SEND_MESSAGE, RECEIVED_MESSAGE, TYPING, PERSON_IS_TYPING
} = require('./constance')

const app = express()

// Cross Origin Resources Sharing
const whiteList = ["http://localhost:5173"]
// app.use(cors({
//     origin: (origin, callback) => {
//         if(whiteList.includes(origin)) callback(null, true)
//         else callback(true, new Error("Not allowed by cors"))
//     },
//     optionsSuccessStatus: 200
// }))
app.use(cors())
app.use(morgan('tiny'))
app.use(express.json({limit:'30mb', extended:true}))
const server = http.createServer(app)

const PORT = process.env.port || 4000


// let chats = []
let conversations = []

let chats = [
    // {id:'1', coverPhoto:'', chatName:"Hell 🔥🔥🔥", secured:{status:false, password: 'canopy'},
    //     members:[
    //         {id:'21', username: 'Jessica', admin:true, profilePhoto:'', accentColor:"rgb(89, 141, 29)"},
    //         {id:'li56tr85ae604cnpud', username: 'Lucy', admin:false, profilePhoto:'', accentColor:"rgb(89, 141, 29)"}, 
    //         {id:'212', username: 'Jessica', admin:true, profilePhoto:'', accentColor:"rgb(89, 141, 29)"},
    //     ]
    // },
    // {id:'2', coverPhoto:'', chatName:"Kitchen", secured:{status:false, password: 'canopy'},
    //     members:[
    //         {id:'21', username: 'Jessica', admin:true, profilePhoto:'', accentColor:"rgb(89, 141, 29)"},
    //         {id:'li56tr85ae604cnpud', username: 'Lucy', admin:false, profilePhoto:'', accentColor:"rgb(89, 141, 29)"},
    //     ]
    // },
]

// let conversations = [
//     {
//         chatId:'1',
//         messages:[
//             {id:'6101', userId:'21', username:'Jessica', message:'Hello everyone', time:'10:30', accentColor:"rgb(38, 40, 170)"},
//             {id:'104', userId:'join', username:'Cynthia', message:'Cynthia Joined', time:'10:30'},
//             {id:'101', userId:'101', username:'Cynthia', message:'Hello', time:'10:31', accentColor:"rgb(38, 40, 170)"},
//             {id:'102', userId:'1', username:'Robert', message:'How are we all doing', time:"10:31", accentColor:"rgb(89, 141, 29)"},
//         ],
//     },
//     {
//         chatId:'2',
//         messages:[
//             {id:'6101', userId:'21', username:'Jessica', message:'Hello everyone', time:'10:30', accentColor:"rgb(38, 40, 170)"},
//             {id:'104', userId:'join', username:'Cynthia', message:'Cynthia Joined', time:'10:30'},
//             {id:'101', userId:'101', username:'Cynthia', message:'Hello', time:'10:31', accentColor:"rgb(38, 40, 170)"},
//             {id:'102', userId:'1', username:'Robert', message:'How are we all doing', time:"10:31", accentColor:"rgb(89, 141, 29)"},
//             {id:'6101', userId:'21', username:'Jessica', message:'Hello everyone', time:'10:30', accentColor:"rgb(38, 40, 170)"},
//             {id:'104', userId:'join', username:'Cynthia', message:'Cynthia Joined', time:'10:30'},
//             {id:'101', userId:'101', username:'Cynthia', message:'Hello', time:'10:31', accentColor:"rgb(38, 40, 170)"},
//         ],
//     },
// ]
let images = [] //not fully implemented yet
let activeUsers = []
let recycleBin = [];

// console.log(getUserFromRecycleBin(recycleBin, "123").chats)

// console.log("before", activeUsers)
// console.log(activeUsers)
// console.log("after", activeUsers)
// const newUser = createNewActiveUser("sock", "123", "ama", "yellow", [{chatId:'3', isAdmin:true}])
// activeUsers = addUserToActiveUsers(activeUsers, newUser)
// activeUsers = addChatToActiveUser(activeUsers, "123", "chatId", false)
// console.log(activeUsers[0].chats)
// activeUsers = removeChatFromActiveUser(activeUsers, "123", "3")
// console.log(activeUsers[0].chats)

// (()=>{
//     // get userId
//     let socketId = "1"
//     let user = activeUsers.find((user)=> user.id === socketId)
//     activeUsers = removeUserFromActiveUsers(activeUsers, user.userId)

//     console.log('active')
//     console.log(activeUsers)

//     recycleBin = addUserToRecycleBin(recycleBin, user)
    
//     console.log('recycle')
//     console.log(recycleBin[0].chats)
// })();

// Setup socket io
const io = new Server(server, {
    cors:{
        origin: whiteList,
        methods:["GET", "POST"],
        credentials: true
    }
})


app.get('/', (req, res) => {
    res.send('ChatBitz Server 1.5');
});

//create new chat
app.post('/api/chat/create', async(req, res)=>{
    const {chatName, username, id, secured, accentColor, profilePhoto} = req.body

    try {
        let chatExist = chatAlreadyExist(chats, chatName)
        if(chatExist)return sendError(res, "Chat Exists", 400, "Chat already exists. please user a different name")

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

        sendData(res, 201, newChat, "Chat created successfully")

    } catch (error) {
        sendError(res, error, 404, "Failed to create chat")
    }
})

// join a chat. also sends error to user to input password if chat is locked
app.post('/api/chat/join', async(req, res)=>{
    const {chatName, username, id, profilePhoto, accentColor, password} = req.body

    try {
        let chat = getChatDetails(chats, chatName)
        if(!chat) return sendError(res, "Join Chat Failed", 404, "Sorry, chat does not exist")

//       check if chat is password protected
        let secured = chat.secured.status
        if(secured && !password) return sendMessage(res, 204, "Provide Password")


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
        let chatMessages = getAllMessagesOfAChat(conversations, chat.id)
        let chatDetails = getChatDetails(chats, chatName)
        let sendResults = {chatDetails, chatMessages}

        sendData(res, 200, sendResults, "Chat joined successfully")

    } catch (error) {
        console.log(error)
        sendError(res, error, 404, "Failed to join chat")
    }
})

// api/user/get-chats/userId=userId&chats=chatId1,chatId2
app.get('/api/user/get-chats/query', async(req,res)=>{
    const {userId, chats:userChats} = req.query
    let splitUserChats = userChats.split(',')

    try {
        // // get user chats
        let userFromRecycle = getUserFromRecycleBin(recycleBin, userId)
        if(!userFromRecycle) return sendMessage(res, 204, "No chats")


        // check if user is actually in the requested chatIds
        let userVerifiedChats = []
        for(let chatId of splitUserChats){
            const chat = userFromRecycle.chats.find(chat => chat.chatId === chatId)
            if(chat)userVerifiedChats.push({chatId:chat.chatId, isAdmin:chat.isAdmin})
        }

        if(userVerifiedChats.length === 0) return sendMessage(res, 204, "No chats")

        // get each chat and messages
        let userChats = []
        let messages = []

        for(let chat of userVerifiedChats){
            const {chatId, isAdmin} = chat
            const chatDetails = getChatById(chats, chatId)
            const chatMessages = getAllMessagesOfAChat(conversations, chatId)
            
            let {userId, username, accentColor} = userFromRecycle
           
            // add user details to chat
            let userDetails = createNewMember(username, userId, isAdmin, "", accentColor)
            userChats.push({...chatDetails, members:[...chatDetails.members, userDetails]})
            messages.push({chatId, messages:chatMessages})
        }

        sendData(res, 200, {userChats, messages})
    } catch (error) {
        sendError(res, error, 400, 'Failed to get user chats')
    }
})

app.get('/api/chat/messages/:chatId', (req, res)=>{
   
    const {chatId} = req.params
    try {
        let messages = getAllMessagesOfAChat(conversations, chatId)
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

        // create active user and add to active users if user does not exist
        let activeUserAlreadyExist = activeUsers.some(user => user.userId !== userId)
        if(activeUserAlreadyExist){
            activeUsers = addChatToActiveUser(activeUsers, userId, chatId, false)
        }else{
            // create an active user
            let newActiveUser = createNewActiveUser(
                socket.id, 
                userId, username, accentColor,
                [{chatId:chatId, isAdmin:true}] 
            )
            activeUsers = addUserToActiveUsers(activeUsers, newActiveUser)
        }        
    })

    // joining a chat
    socket.on(JOIN_CHAT, (chatIdAndUserDetails)=>{
        const {chatId, userId, username, accentColor} = chatIdAndUserDetails
        socket.join(chatId)

        // create active user and add to active users if user does not exist
        let activeUserAlreadyExist = activeUsers.some(user => user.userId === userId)
        if(activeUserAlreadyExist){
            activeUsers = addChatToActiveUser(activeUsers, userId, chatId, false)
        }else{
            let newActiveUser = createNewActiveUser(socket.id, userId, username, accentColor, 
                [{chatId:chatId, isAdmin:false}]    
            )
            activeUsers = addUserToActiveUsers(activeUsers, newActiveUser)
        }


        // emit a joined message and add to the chat messages
        let joinMsg = createMessage("join", chatId, userId, username, `${username} joined`, accentColor)
        conversations = addMessageToConversation(conversations, joinMsg)
        
        // emit to other users someone joined with new user data
        let newUser = {username, id:userId,  profilePhoto:null, accentColor, admin:false}
        socket.to(chatId).emit(SOMEONE_JOINED, {joinMsg, id: chatId, newUser})
    })

    // when user refreshes the browser, the socket gets disconnected 
    // rejoin chats via this socket.
    socket.on(REJOIN_CHAT, (userId)=>{
        // get the user rejoining from the recycle bin
        const userRejoining = getUserFromRecycleBin(recycleBin, userId)
        
        if(!userRejoining){
            console.log('No user found in recycle bin')
            return null
        }

        const {username, accentColor, chats: userChats} = userRejoining

        // create active user and add to active users
        let activeUser = createNewActiveUser(socket.id, userId, username, accentColor, [])
        activeUsers = addUserToActiveUsers(activeUsers, activeUser)


        for(const chat of userChats){
            let {chatId, isAdmin} = chat
            socket.join(chatId)
            activeUsers = addChatToActiveUser(activeUsers, userId, chatId, isAdmin)

            let oldMember = createNewMember(username, userId, isAdmin, "", accentColor)
            chats = addMemberToChat(chats, chatId, oldMember)
            
            // emit a joined message and add to the chat messages
            let rejoinMsg = createMessage('rejoined', chatId, userId, username, `${username} rejoined`, accentColor)
            conversations = addMessageToConversation(conversations, rejoinMsg)

            socket.to(chatId).emit(SOMEONE_REJOINED, {rejoinMsg, id:chatId, oldMember})     
        }

        // remove user chat from the recyclebin
        recycleBin = removeUserFromRecycleBin(recycleBin, userId)
    })

    socket.on(LEAVE_CHAT, (chatIdAndUserDetails)=>{
        const {chatId, username, userId} = chatIdAndUserDetails
        // remove user from chat
        // remove chatId from user socket
        // send message and emit to other members

        chats = removeMemberFromChat(chats, chatId, userId)
        
        // remove chats from the users chats
        activeUsers = removeChatFromActiveUser(activeUsers, userId, chatId)
        socket.leave(chatId) //user sockets disconnects from the chat

        // check if there is any member left in the chat and delete it
        let membersInChat = getMembersInAChat(chats, chatId)
        if(membersInChat.length > 0){ //if there are members in the chat
            // send a someone left message
            let leaveMsg = createMessage('left', chatId, userId, username, `${username} left`, null)
            conversations = addMessageToConversation(conversations, leaveMsg)
            socket.to(chatId).emit(SOMEONE_LEFT, {leaveMsg, id: chatId, userId})
        }else{
            // delete the chat, conversation and socket
            chats = deleteChat(chats, chatId)
            conversations = deleteConversation(conversations, chatId)
            // socket.delete(chatId) //delete the socket room
        }
    })

    socket.on(REMOVE_MEMBER, (props)=>{
        // check if user is an admin before they can remove a member
        // this sends message to other users that a user has been removed
        const {chatId, adminId, adminName, userId} = props

        // check if user is an admin
        let isAdmin = isMemberAdmin(chats, chatId, adminId)
        if(!isAdmin) return io.to(chatId).emit(REMOVE_MEMBER_FAILED, adminId)
        

        let userRemovedName = getUserNameById(chats, chatId, userId) // get the name of the user being removed
        chats = removeMemberFromChat(chats, chatId, userId) //remove user from the chat

        // remove chat from userSocket
        activeUsers = removeChatFromActiveUser(activeUsers, userId, chatId)

        // create a message for other members in the chat  
        let userRemovedMsg = createMessage('user-removed', chatId, userId, userRemovedName, `${adminName} removed ${userRemovedName}`, null)
        conversations = addMessageToConversation(conversations, userRemovedMsg)
        
        // send to every one in the chat including the admin
        io.to(chatId).emit(SOMEONE_WAS_REMOVED, {userId, chatId, message:userRemovedMsg})
    })

    // the person removed from a chat emits this socket to disconnect form socket 
    socket.on(I_WAS_REMOVED, (chatId)=>{
        socket.leave(chatId)
    })

    socket.on(SEND_MESSAGE, (msgDetails)=>{
        // add message to conversation and emit to other users
        const {chatId, userId, username, accentColor, message, time} = msgDetails
        let newMessage = createMessage("message", chatId, userId, username, message, accentColor, time)
        conversations = addMessageToConversation(conversations, newMessage)
        socket.to(chatId).emit(RECEIVED_MESSAGE, newMessage)
    })

    socket.on(TYPING, (typingDetails)=>{
        const {chatId} = typingDetails
        socket.to(chatId).emit(PERSON_IS_TYPING, typingDetails)
    })

    socket.on(DISCONNECT, ()=>{
        
        // remove user from active users and move to recycle bin
        let user = activeUsers.find(user => user.socketId === socket.id)
        recycleBin = addUserToRecycleBin(recycleBin, user)
        activeUsers = removeUserFromActiveUsers(activeUsers, user.userId)


        if(user){
            if(user.chats.length > 0){
                for(const chat of user.chats){
                    let {chatId} = chat
                    chats = removeMemberFromChat(chats, chatId, user.userId) //remove user from chat

                    let membersInChat = getMembersInAChat(chats, chatId)

                    //if there are other members, send message a "member has left" msg to them
                    if(membersInChat.length > 0){ // there are other members in the chat. greater than 1 cos the user leaving counts as 1

                        let leaveMsg = createMessage('left-unexpectedly', user.userId, 'left-unexpectedly', user.username, `${user.username} left unexpectedly`, null)
                        conversations = addMessageToConversation(conversations, leaveMsg)

                        socket.to(chatId).emit(SOMEONE_LEFT, {leaveMsg, id:chatId, userId:user.userId})
                        socket.leave(chatId)
                    }else{ //there are no other members
                        // delete chat and conversations
                        chats = deleteChat(chats, chatId)
                        conversations = deleteConversation(conversations, chatId)
                    }
                }
            }
        }

        console.log(socket.id, ' disconnected')
    })
}) 

server.listen(PORT, () => console.log(`listening on ${PORT}`))