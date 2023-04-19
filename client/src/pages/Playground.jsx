import { useLocation } from "react-router-dom"
import styles from '../css/playground.module.css'
import PlaygroundProvider from "../context/Playground/PlaygroundContext"
import { useAppContext, usePlaygroundContext } from "../utils/hooks"
import {LargeScreenChats, MobileChats} from '../components/Playground/chats'
import LeaveChatModal from '../components/global/LeaveChatModal'
import Message from '../components/Playground/message'
import { _Connect } from "../utils/types"
import {screenSizes, socketConstance} from '../utils/constance'

export default function Playground(){
    // const location = useLocation()
    const connectType = useLocation()?.state?.connectType || _Connect.create 

    return <PlaygroundProvider>
        <PlaygroundContent connectType={connectType}/>
    </PlaygroundProvider>
}

function PlaygroundContent({connectType}){
    const {deviceWidth} = useAppContext()
    const {playState} = usePlaygroundContext()
    const {showMobileChats, showLeaveChat} = playState

    return <>
        <div className={styles.playground}>
            {deviceWidth >= screenSizes.small && <LargeScreenChats />}
            <Message />
        </div>

        {showMobileChats && <MobileChats />}
        {showLeaveChat && <LeaveChatModal />}
    </>
}