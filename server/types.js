// how stuffs looks like

const chats = [ //array of all chats
    { //a chat
        id:"string, unique id of a chat",
        chatName:"string, name of the chat",
        coverPhoto:"string, photo of the chat, NB:not implemented yet",  
        secured:{ //object, 
            status:"boolean, chat is secured or not", 
            password: "string, password of the chat."
        },
        members:[ //array of all members in the chat
            {
                id :"string, unique id a member",
                username:"string, name of the member",
                admin:"boolean, whether member is an admin of this chat",
                accentColor:"string, random color chosen of the user",
                profilePhoto:"sting, of user profile photo, NB:not implemented yet"
            }
        ]
    } //end of a chat
]

const conversations = [
    {
        chatId:'1',
        messages:[
            {id:'6101', userId:'21', username:'Jessica', message:'Hello everyone', time:'10:30', accentColor:"rgb(38, 40, 170)"},
            {id:'104', userId:'join', username:'Cynthia', message:'Cynthia Joined', time:'10:30'},
            {id:'101', userId:'101', username:'Cynthia', message:'Hello', time:'10:31', accentColor:"rgb(38, 40, 170)"},
            {id:'102', userId:'1', username:'Robert', message:'How are we all doing', time:"10:31", accentColor:"rgb(89, 141, 29)"},
        ],
    },

    {
        chatId:"string, the chat id this conversation belongs to",
        messages:[ //array of all the messages sent in the chat
            { //start of a message
                id:"string, unique id of the message",
                userId:"string, the id of the user who sent this message",
                username:"string, the name of the user who sent the message",
                message:"string, the text message itself",
                time:"string, time the message was sent",
                accentColor:"string, the assigned color of the user"
            } // end of a message
        ]
    }
]

const sockets = [ //array of all userSockets userIds and their chats
    {
        id:"string, socket id of a user",
        userId:"string, unique id of a user",
        username:"string, username",
        chats:["array, chats id of the user"]
    }
]

const images = [
    // this is not implemented yet
    {
        id:"string, unique id of the image",
        image:"string, image string"
    }
]