import {createContext, useReducer, useCallback, useEffect} from 'react'
import { state, userReducer } from './userReducer'
import { accentColors } from '../../utils/constance'
import { idGenerator, setItemToSessionStorage, getItemFromStorage } from '../../utils/helpers'
import { userActions } from "../../utils/actions"

export const UserContext = createContext()

export default function UserProvider({children}){
    const [userState, userDispatch] = useReducer(userReducer, state)

    const createUser = useCallback(()=>{
        // check if user is stored in session storage
        let user = getItemFromStorage('User');
        if(!user){
            //create user defaults
            let accentColor = accentColors[Math.floor(Math.random()*accentColors.length)]
            user = {username:'', id:idGenerator(), profilePhoto:'', accentColor}
            setItemToSessionStorage('User', user)
        }
        userDispatch({type:userActions.SET_USER, payload:user})
    },[])


    useEffect(()=>{
        createUser()
    },[])

    const value = {
        userState, userDispatch
    }

    return <UserContext.Provider value={value}>
        {children}
    </UserContext.Provider>
}
