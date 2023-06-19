// How stuff should look like at their default state
// items here are supposed to look like this in their default state. they would carry values when running the app.

/**
 * @typedef {Object} User
 * @property {String} username
 * @property {String} id
 * @property {String} profilePhoto
 * @property {String} accentColor
 */

/**@type User */
const _User = {
    username:"", 
    id:"", 
    profilePhoto:"", 
    accentColor:""
}

const _Chat = {
    chats:[], 
    currentChat:"", 
    messages:[], 
    peopleTyping:[]
}

/**
 * @typedef {Object} Connect
 * @property {String} create
 * @property {String} join
 */
/**@type Connect */
const _Connect = {
    create:'create',
    join:'join'
}


export {
    _User,
    _Connect,
    _Chat
}