import {useState, createContext, useEffect} from 'react'
import {_ChatMemberDetails} from '../utils/types'

export const AppContext = createContext()


export default function AppProvider({children}){
    const [deviceWidth, setDeviceWidth] = useState(window.innerWidth)
    
    useEffect(()=>{
        window.addEventListener('resize', ()=>{
            setDeviceWidth(window.innerWidth)
        })

    },[])

    const value = {
        deviceWidth,
    }

    return <AppContext.Provider value={value}>
        {children}
    </AppContext.Provider>
}