type ActiveUser = {
    socketId:string
    id:string
    username:string
    accentColor:string
    chats: {chatId:string, isAdmin:boolean}[]
}

const activeUsers = new Map<string, ActiveUser>()
const usersBin = new Map<string, ActiveUser>()


export class User{

    static getAllActiveUsers(){return activeUsers}

    /**
     * Creates a user and add to active users
     * Returns username and id
     */

    //TODO: check if user already exits in active users or recycle bin  
    static createUser(socketId:string, id:string, username:string, accentColor:string,
        // chats:{chatId:string, isAdmin:boolean}[]):{userId:string, username:string}
        ):{userId:string, username:string}
    {
        if(activeUsers.has(id)) return {userId:id, username}
        activeUsers.set(id, {socketId, id, username, accentColor, chats:[]})
        return {userId:id, username}
    }

    /**
     * Find a user by id in active users
     */
    static findUserById(userId:string, whereToCheck?:"active"|"bin"):ActiveUser | null{
        const checkFrom = whereToCheck || "active"
        if(checkFrom === "bin") return usersBin.get(userId) || null
        return activeUsers.get(userId) || null
    }

    static findUserBySocketId(socketId:string){
        for(let user of activeUsers){
            if(activeUsers.get(user[0])?.socketId === socketId){
                return activeUsers.get(user[0])
            }
        }
        return null
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
    static recycleUserToAndFromBin(userId:string, method:"move to bin" | "move from bin" 
        | "delete from bin")
    {
        if(method === "move from bin"){
            let user = this.findUserById(userId, "bin")
            if(user){
                activeUsers.set(userId, user)
                usersBin.delete(userId)
            }
        }

        if(method === "move to bin"){
            const user = this.findUserById(userId, "active")
            if(user){
                usersBin.set(userId, user)
                activeUsers.delete(userId)
            }
        }

        if(method === "delete from bin"){
            usersBin.delete(userId)
        }
    }

    /**
     * Change the user's socket id
     * Useful when moving user from recycle back to active users
     */
    static changeSocketId(userId:string, newSocketId:string){
        const user = this.findUserById(userId)
        if(user)user.socketId = newSocketId
    }

    static findUserFromBin(userId:string){
        return usersBin.get(userId) || null
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