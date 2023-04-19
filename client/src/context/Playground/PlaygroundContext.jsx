import {createContext, useReducer} from 'react'
import { state, playgroundReducer } from './playgroundReducer'

export const PlaygroundContext = createContext()

export default function PlaygroundProvider({children}){
    const [playState, playDispatch] = useReducer(playgroundReducer, state)

    const value = {
        playState, playDispatch
    }

    return <PlaygroundContext.Provider value={value}>
        {children}
    </PlaygroundContext.Provider>
}
