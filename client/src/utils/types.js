// How stuff should look like at their default state
// items here are supposed to look like this in their default state. they would carry values when running the app.

const _PerformActionBeforeStart = {
    action:'', chatDetails:null
}


// object for the modal which pops up when a member is clicked on the chat details 
const _ChatMemberDetails = {
    show: false, //show modal
    memberDetails:{ //the id of the menber
        id:'id', 
        username: 'username', 
        profilePhoto:'', 
        accentColor:""
    }
}

export {
    _PerformActionBeforeStart,
    _ChatMemberDetails
}