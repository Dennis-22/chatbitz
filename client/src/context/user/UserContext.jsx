import {createContext, useReducer, useCallback, useEffect} from 'react'
import { state, userReducer } from './userReducer'
import { accentColors } from '../../utils/constance'
import { getItemFromStorage, idGenerator, setItemToSessionStorage } from '../../utils/helpers'
import { userActions } from "../../utils/actions"

export const UserContext = createContext()

export default function UserProvider({children}){
    const [userState, userDispatch] = useReducer(userReducer, state)

    const createUser = useCallback(()=>{
        let userInSession = getItemFromStorage('User')
        if(userInSession){
            return userDispatch({type:userActions.SET_USER, payload:userInSession})
        }
        
        //create user defaults
        /** @type {import('../../utils/types').User} */
        const user = {
            username:'',
            id:idGenerator(), 
            accentColor: accentColors[Math.floor(Math.random()*accentColors.length)]
        }
        setItemToSessionStorage('User', user)
        userDispatch({type:userActions.SET_USER, payload:user})
    },[])


    useEffect(()=>{
        // if user's id is empty at the store, create a new user.
        // user will always be empty once user refreshes. some instance will create a new user so this won't recreate user
        if(!userState.user.id){
            createUser()
        }
    },[])


    const value = {
        userState, userDispatch,
        createUser
    }

    return <UserContext.Provider value={value}>
        {children}
    </UserContext.Provider>
}
