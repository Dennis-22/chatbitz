import crypto from 'crypto'
import { IChat, ChatMember } from '../../types'

const chats = new Map<string, IChat>()

export class Chat{
    static getAllChats(){return chats}

    static createChat(chatName:string, secured:{status:boolean, password:string},
        creatorId:string, creatorName:string , creatorAccentColor:string
        ):IChat
    {
        let chat:IChat = {
            id:crypto.randomUUID(), 
            chatName, 
            members:[{id:creatorId, username:creatorName, isAdmin:true, accentColor:creatorAccentColor}],
            secured
        }
        chats.set(chat.id, chat)
        return chat
    }

    static deleteChat(chatId:string){
        chats.delete(chatId)
    }
    
    static finChatById(chatId:string):IChat | null{
        return chats.get(chatId) || null
    }

    static findChatByName(chatName:string):IChat | null 
    {
        let chatExist: IChat | null = null
        for(let chat of this.getAllChats()){
            if(chat[1].chatName === chatName){
                chatExist = chat[1] as IChat
                break
            }
        }
       
        return chatExist
    }
    
    static addChatToChats(chat:IChat){
        chats.set(chat.id, chat)
    }

    /**
     * add a member to an existing chat
     */
    static addMemberToChat(chatId:string, member:ChatMember)
    {
        chats.get(chatId)?.members.push(member)
    }

    static findMemberInChat(chatId:string, memberId:string){
        const chat = this.finChatById(chatId)
        if(chat){
            return chat.members.find(mem => mem.id === memberId) || null
        }
        return null
    }

    static removeMemberFromChat(chatId:string, memberId:string){
        let chat = this.finChatById(chatId)
        if(!chat) return null
        let member = chat.members.find(mem => mem.id === memberId)!
        if(member){
            chat.members.splice(chat.members.indexOf(member), 1)
        }
    }

}