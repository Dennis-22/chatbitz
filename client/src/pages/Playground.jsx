import { useLocation } from "react-router-dom"
import styles from '../css/playground.module.css'
import PlaygroundProvider from "../context/Playground/PlaygroundContext"
import { useAppContext, usePlaygroundContext } from "../utils/hooks"
import {LargeScreenChats, MobileChats} from '../components/Playground/chats'
import Message from '../components/Playground/message'
import LeaveChatModal from '../components/global/LeaveChatModal'
import ChatDetails from '../components/Playground/chat-details'
import RemovedModal from "../components/global/RemovedModal"
import NotAnAdminModal from "../components/global/NotAnAdminModal"
import { _Connect } from "../utils/types"
import {screenSizes, socketConstance} from '../utils/constance'

export default function Playground(){
    const connectType = useLocation()?.state?.connectType || _Connect.create

    return <PlaygroundProvider>
        <PlaygroundContent connectType={connectType}/>
    </PlaygroundProvider>
}

function PlaygroundContent({connectType}){
    const {deviceWidth} = useAppContext()
    const {playState} = usePlaygroundContext()
    const {showMobileChats, showLeaveChat, showChatDetails,
        showNotAdmin, showYouWereRemoved
    } = playState

    return <>
        <div className={styles.playground}>
            {deviceWidth >= screenSizes.small && <LargeScreenChats />}
            <Message />
        </div>

        {/* the lower ones appear first */}
        {showLeaveChat && <LeaveChatModal />}
        {showChatDetails && <ChatDetails />}
        {showNotAdmin && <NotAnAdminModal />}
        {showYouWereRemoved && <RemovedModal />}
        {showMobileChats && <MobileChats />} {/* the drawer for chats on small devices */}
    </>
}