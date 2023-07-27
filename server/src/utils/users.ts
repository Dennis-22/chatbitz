import { ChatMember, ActiveUser } from "../../types"

const activeUsers = new Map<string, ActiveUser>()
const usersBin = new Map<string, ActiveUser>()

export class User{

    static getAllActiveUsers(){return activeUsers}

    /**
     * Creates a user and add to active users
     * Returns username and id
     */
    static createUser(socketId:string, id:string, username:string, accentColor:string, profilePhoto:string, 
        chats:{chatId:string, isAdmin:boolean}[]):{userId:string, username:string}
    {
        if(activeUsers.has(id)) return {userId:id, username}
        activeUsers.set(id, {socketId, id, username, accentColor, chats})
        return {userId:id, username}
    }

    /**
     * Find a user by id in active users
     */
    static findUserById(userId:string):ActiveUser | null{
        let user = activeUsers.get(userId)
        return user || null
    }

    /**Get all user chats */
    static findUserChats(userId:string):null | string[]{
        let user = this.findUserById(userId)
        if(!user) return null
        let chats:string[] = []
        for(let chat of user.chats){
            chats.push(chat.chatId)
        }
        return chats
    }

    /**
     * Add and removes user to and from active users to users bin
     * method (move to bin) - remove user from active users to bin
     * method (move from bin) - remove user from bin to active users
     * method (delete from bin) - delete user from bin
     */
    static recycleUserToAndFromBin(userId:string, metohd:"move to bin" | "move from bin" 
        | "delete from bin")
    {
        let user = this.findUserById(userId)
        if(user){
            if(metohd === "move to bin"){
                usersBin.set(userId, user)
                activeUsers.delete(userId)
            }
            if(metohd === "move from bin"){
                activeUsers.set(userId, user)
                usersBin.delete(userId)
            }

            if(metohd === "delete from bin"){
                usersBin.delete(userId)
            }
        }
    }

    /**
     * Add a chat to user's chat 
     */
    static addChatToUserChats(userId:string, chat:{chatId:string, isAdmin:boolean}){
        let user = this.findUserById(userId)
        if(user){
            user.chats.push(chat)
        }
    }

    /**Remove a chat from user's chat */
    static removeChatFromUserChats(userId:string, chatId:string){
        let user = this.findUserById(userId)
        if(user){
            let chat = user.chats.find(chat => chat.chatId === chatId)!
            if(chat){
                user.chats.splice(user.chats.indexOf(chat), 1)
            }
        }
    }
}


// let newUser = User.createUser("socket", "1", "Dennis", "yellow", "", [{chatId:"1", isAdmin:true}])
// console.log('before')
// console.log(activeUsers)

// User.addChatToUserChats("1", {chatId:'2', isAdmin:false})
// console.log('after')
// console.log(activeUsers)

// User.removeChatFromUserChats("1", "1")
// console.log("before before")
// console.log(activeUsers)