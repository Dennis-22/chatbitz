const express = require('express');
const morgan = require('morgan');
const cors = require('cors')
const http = require('http');
const crypto = require('crypto')
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

const {Chat} = require('./utils/chats')
const {Message} = require('./utils/messages')
const {User} = require('./utils/users')


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
    const {chatName, username, id, accentColor, secured} = req.body

    try {
        // let chatExist = chatAlreadyExist(chats, chatName)
        // if(chatExist)return sendError(res, "Chat Exists", 400, "Chat already exists. please user a different name")

        // // upload the profile images if they have one
        // let profilePhotoId = null

        // if(profilePhoto){
        //     profilePhotoId = idGenerator()
        //     images = postImage(images, profilePhoto, profilePhotoId)
        // }

        // // create new room with the admin in
        // let newChat = createNewChat(chatName, username, id, secured, accentColor, profilePhotoId)
        // chats = [...chats, newChat]

        // // create new conversation
        // let newConversation = createConversation(newChat.id)
        // conversations = [...conversations, newConversation]

        // sendData(res, 201, newChat, "Chat created successfully")

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

app.post('/api/chat/join', (req, res)=>{
    const {chatName, password, username, id, accentColor} = req.body

    try {
        const chat = Chat.findChatByName(chatName)
        if(!chat) return sendError(res, "Join Chat Failed", 404, "Sorry, chat does not exist")
        
        if(chat.secured.status & !password) {
            return sendMessage(res, 204, "Provide Password")
        }

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


// join a chat. also sends error to user to input password if chat is locked
// app.post('/api/chat/join', async(req, res)=>{
//     const {chatName, username, id, profilePhoto, accentColor, password} = req.body

//     try {
//         let chat = getChatDetails(chats, chatName)
//         if(!chat) return sendError(res, "Join Chat Failed", 404, "Sorry, chat does not exist")

// //       check if chat is password protected
//         let secured = chat.secured.status
//         if(secured && !password) return sendMessage(res, 204, "Provide Password")


// //       verify password if chat is password protected
//         if(secured && password){
//             let passwordIsCorrect = isChatPasswordCorrect(chat, chatName, password)
//             if(!passwordIsCorrect) return sendError(res, "Invalid Password", 400, "Invalid password")
//         }

//         // they are free to join

//         // upload the profile images if they have one
//         let profilePhotoId = null

//         if(profilePhoto){
//             profilePhotoId = idGenerator()
//             images = postImage(images, profilePhoto, profilePhotoId)
//         }

//         images = postImage(images, profilePhoto, profilePhotoId)

//         let newMember = createNewMember(username, id, false, profilePhoto, accentColor)
//         chats = addMemberToChat(chats, chat.id, newMember)

//         // get all messages from the chat
//         let chatMessages = getAllMessagesOfAChat(conversations, chat.id)
//         let chatDetails = getChatDetails(chats, chatName)
//         let sendResults = {chatDetails, chatMessages}

//         sendData(res, 200, sendResults, "Chat joined successfully")

//     } catch (error) {
//         console.log(error)
//         sendError(res, error, 404, "Failed to join chat")
//     }
// })

// api/user/get-chats/userId=userId&chats=chatId1,chatId2
app.get('/api/user/get-chats/query/:id', async(req,res)=>{
    // const {userId, chats:userChats} = req.query
    const userId = req.params.id
    // const splitUserChats = userChats.split(',')
    // try {
    //     // // get user chats
    //     let userFromRecycle = getUserFromRecycleBin(recycleBin, userId)
    //     if(!userFromRecycle) return sendMessage(res, 204, "No chats")


    //     // check if user is actually in the requested chatIds
    //     let userVerifiedChats = []
    //     for(let chatId of splitUserChats){
    //         const chat = userFromRecycle.chats.find(chat => chat.chatId === chatId)
    //         if(chat)userVerifiedChats.push({chatId:chat.chatId, isAdmin:chat.isAdmin})
    //     }

    //     if(userVerifiedChats.length === 0) return sendMessage(res, 204, "No chats")

    //     // get each chat and messages
    //     let userChats = []
    //     let messages = []

    //     for(let chat of userVerifiedChats){
    //         const {chatId, isAdmin} = chat
    //         const chatDetails = getChatById(chats, chatId)
    //         const chatMessages = getAllMessagesOfAChat(conversations, chatId)
            
    //         let {userId, username, accentColor} = userFromRecycle
           
    //         // add user details to chat
    //         let userDetails = createNewMember(username, userId, isAdmin, "", accentColor)
    //         userChats.push({...chatDetails, members:[...chatDetails.members, userDetails]})
    //         messages.push({chatId, messages:chatMessages})
    //     }

    //     sendData(res, 200, {userChats, messages})
    // } catch (error) {
    //     sendError(res, error, 400, 'Failed to get user chats')
    // }

    try {
        const getUserFromRecycle = User.findUserFromBin(userId)
        if(!getUserFromRecycle) return sendMessage(res, 204, "No chats")

        // get all user chats
        const userHasChats = getUserFromRecycle.chats
        
        if(!userHasChats || userHasChats.length === 0) return sendMessage(res, 204, "No chats")

        // get each chat and messages
        let userChats = []
        let messages = []

        for(let chat of userHasChats){
            const chatDetails = Chat.finChatById(chat.chatId)
            const chatMessages = Message.getChatMessages(chat.chatId, true)
            const {id, username, accentColor} = getUserFromRecycle
            const member = {id, username, accentColor, isAdmin:chat.isAdmin}
            Chat.addMemberToChat(chat.chatId, member)
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
        User.createUser(socket.id, userId, username, accentColor, "", [{chatId, isAdmin:true}])
    })

    // joining a chat
    socket.on(JOIN_CHAT, (chatIdAndUserDetails)=>{
        const {chatId, userId, username, accentColor} = chatIdAndUserDetails
        
        const createUser = User.createUser(socket.id, userId, username, accentColor, "", [{isAdmin:false, chatId}])
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
        // get the user rejoining from the recycle bin
        // const userRejoining = getUserFromRecycleBin(recycleBin, userId)
        
        // if(!userRejoining){
        //     console.log('No user found in recycle bin')
        //     return null
        // }

        // const {username, accentColor, chats: userChats} = userRejoining

        // create active user and add to active users
        // let activeUser = createNewActiveUser(socket.id, userId, username, accentColor, [])
        // activeUsers = addUserToActiveUsers(activeUsers, activeUser)

        // for(const chat of userChats){
        //     let {chatId, isAdmin} = chat
        //     socket.join(chatId)
        //     activeUsers = addChatToActiveUser(activeUsers, userId, chatId, isAdmin)

        //     let oldMember = createNewMember(username, userId, isAdmin, "", accentColor)
        //     chats = addMemberToChat(chats, chatId, oldMember)
            
        //     // emit a joined message and add to the chat messages
        //     let rejoinMsg = createMessage('rejoined', chatId, userId, username, `${username} rejoined`, accentColor)
        //     conversations = addMessageToConversation(conversations, rejoinMsg)

        //     socket.to(chatId).emit(SOMEONE_REJOINED, {rejoinMsg, id:chatId, oldMember})     
        // }

        // // remove user chat from the recyclebin
        // recycleBin = removeUserFromRecycleBin(recycleBin, userId)

        // get the user rejoining from the recycle bin
        const user = User.findUserFromBin(userId)
        if(!user){
            console.log('No user found in recycle bin')
            return null
        }
        const {id, username, chats, accentColor} = user    
        for(const chat of chats){
            const {chatId, isAdmin} = chat
            socket.join(chatId)
            Chat.addMemberToChat(chatId, {id, username, isAdmin, accentColor})
            const rejoinMessage = Message.createMessage({
                type:'rejoined',
                chatId,
                username,
                userId:id,
                message:`${username} "rejoined"`,
                accentColor,
            })
            Message.addMessageToChat(chatId, rejoinMessage)
            const memberData = {id, username, accentColor, isAdmin}
            socket.to(chatId).emit(SOMEONE_REJOINED, {rejoinMessage, id:chatId, memberData})     
        }
        User.recycleUserToAndFromBin(id, "move from bin")
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
                message:`${username} "left"`,
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
            User.recycleUserToAndFromBin(user.id, "move to bin") //move user to recycle bin
            if(user.chats.length > 0){
                for(const chat of user.chats) {
                    Chat.removeMemberFromChat(chat.chatId, user.id)
                    if(Chat.finChatById(chat.chatId).members.length > 0){
                        const leaveMessage = Message.createMessage({
                            type:'left-unexpectedly',
                            chatId:chat.chatId,
                            username:user.username,
                            userId:user.id,
                            message:`${user.username} "left unexpectedly"`,
                            accentColor:"",      
                        })
                        Message.addMessageToChat(leaveMessage)
                        socket.to(chat.chatId).emit(SOMEONE_LEFT, {leaveMessage, id:chat.chatId, userId:user.id})
                        socket.leave(chat.chatId) 
                    }else{
                        Chat.deleteChat(chat.id)
                        Message.deleteChatMessages(chat.id)
                    }
                }
            }
        }
        
        console.log(socket.id, 'disconnected')
    })
}) 

server.listen(PORT, () => console.log(`listening on ${PORT}`))