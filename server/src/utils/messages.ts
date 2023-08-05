import crypto from 'crypto'

type MessageT = {
    id?:string
    chatId:string
    userId:string
    username:string
    message:string
    type: MessageType
    accentColor:string
    time?:string
}

type MessageType = 'leave' | 'join' | 'user-removed' | 'left-unexpectedly' | 'rejoined'

// const messages = new Map<string, MessageT>()

const messages = [{chatId:"chat2", messages: new Set<MessageT>()}]


export class Message{
    static getChatMessages(chatId:string, sendingToClientSide:boolean=false){
        const getMessages = messages.find(msg => msg.chatId === chatId)!
        if(sendingToClientSide){
            // Set cannot be sent via api so make messages to an array
            const makeMessages = []
            for(let msg of getMessages.messages){
                makeMessages.push(msg)
            }
            return {chatId:getMessages.chatId, messages:makeMessages}
        }
        return messages.find(msg => msg.chatId === chatId)
    }

    static deleteChatMessages(chatId:string){
        const chatMessages = messages.find(chat => chat.chatId === chatId)!
        if(chatMessages){
            messages.splice(messages.indexOf(chatMessages), 1)
        }
    }

    /**
     * set up messages for a chat when its first created
     */
    static setUpChatMessage(chatId:string){
        messages.push({chatId:chatId, messages:new Set()})
    }

    /**
     * create a message for chat
     */
    static createMessage(message:MessageT){
        return {
            ...message,
            id:message.id || crypto.randomUUID(),
            time:message.time || new Date(Date.now()).getHours() + " : " + new Date(Date.now()).getMinutes()
        }
    }

    static addMessageToChat(chatId:string, message:MessageT)
    {
        const chatMessages = Message.getChatMessages(chatId, false)
        if(chatMessages){
            const {id, userId, username, message:text, type, accentColor, time} = message
            // @ts-ignore
            chatMessages.messages.add({
                id, username, type, message:text, accentColor, userId, time
            })
        }
    }
}
