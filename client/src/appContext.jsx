import {useState, createContext, useEffect} from 'react'
import { idGenerator } from './utils/helpers'
import { accentColors } from './utils/constance'

export const AppContext = createContext()


export default function AppProvider({children}){
    const [deviceWidth, setDeviceWidth] = useState(window.innerWidth)
    const [user, setUser] = useState({id:'21', username:'Jessica', profilePhoto:null, accentColor:''})
    const [loading, setLoading] = useState(false) //state for popup loading

    const [showMobileChats, setShowMobileChats] = useState(false) //chats display on mobile devices
    const [showMobileChatDetails, setShowMobileChatDetails] = useState(false) //chat display on mobile devices

    // assigning the user to his id
    const createUser = ()=>{
        let accentColor = accentColors[Math.floor(Math.random()*accentColors.length)]
        setUser({username:'Chad', id:idGenerator(), profilePhoto:'', accentColor})
    }


    useEffect(()=>{
        createUser()
    },[])

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
        showMobileChatDetails, setShowMobileChatDetails
    }

    return <AppContext.Provider value={value}>
        {children}
    </AppContext.Provider>
}