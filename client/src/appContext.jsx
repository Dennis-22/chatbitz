import {useState, createContext, useEffect} from 'react'
import { idGenerator } from './utils/helpers'
import { accentColors } from './utils/constance'
import { setItemToSessionStorage, getItemFromStorage } from './utils/helpers'
import {_ChatMemberDetails} from './utils/types'

export const AppContext = createContext()


export default function AppProvider({children}){
    const [deviceWidth, setDeviceWidth] = useState(window.innerWidth)
    const [user, setUser] = useState({id:'', username:'', profilePhoto:null, accentColor:''})
    const [loading, setLoading] = useState(false) //state for popup loading

    const [showMobileChats, setShowMobileChats] = useState(false) //chats display on mobile devices
    const [showMobileChatDetails, setShowMobileChatDetails] = useState(false) //chat display on mobile devices
    const [showChatMemberDetails, setShowChatMemberDetails] = useState(_ChatMemberDetails) // when a chat member is clicked
    const [showPopupInput, setShowPopupInput] = useState(false)
    const [showRemovedModal, setShowRemovedModal] = useState({show:false, adminName:''}) //when user is removed - adminName = the admin who removed user
    const [showNotAdminModal, setShowNotAdminModal] = useState(false) //not an admin popup when user tries to remove a member

    // assigning the user to his id and accent color
    // const createUser = ()=>{
    //     // check if user is stored in session storage
    //     let userDetailsStored = getItemFromStorage('User');
    //     if(userDetailsStored){
    //         return setUser(userDetailsStored)
    //     }
    //     // create a new user
    //     let accentColor = accentColors[Math.floor(Math.random()*accentColors.length)]
    //     let id = idGenerator()
    //     let userDetails = {username:'', id, profilePhoto:'', accentColor}
    //     setUser(userDetails)
    //     setItemToSessionStorage('User', userDetails)
    // }


    // useEffect(()=>{
    //     createUser()
    // },[])

    useEffect(()=>{
        window.addEventListener('resize', ()=>{
            setDeviceWidth(window.innerWidth)
        })

    },[])

    const value = {
        deviceWidth, 
        user, setUser, 
        loading, setLoading,
        showMobileChats, setShowMobileChats,
        showMobileChatDetails, setShowMobileChatDetails,
        showChatMemberDetails, setShowChatMemberDetails,
        showPopupInput, setShowPopupInput,
        showRemovedModal, setShowRemovedModal,
        showNotAdminModal, setShowNotAdminModal
    }

    return <AppContext.Provider value={value}>
        {children}
    </AppContext.Provider>
}