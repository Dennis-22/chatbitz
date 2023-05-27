import { useNavigate } from "react-router-dom"
import DoNotDisturbRounded from '@mui/icons-material/DoNotDisturbRounded'
import styles from '../../css/removed.module.css'
import Modal, {ModalButtons} from "./Modal"
import { usePlaygroundContext, useChatContext } from "../../utils/hooks"
import { _Connect } from "../../utils/types"
import { chatActions } from "../../utils/actions"

export default function RemovedModal() {
    const {chatDispatch, chatState:{currentChat}} = useChatContext()
    const {toggleYouWereRemoved} = usePlaygroundContext()
    const navigate = useNavigate()

    const handlePress = ()=>{
        toggleYouWereRemoved(false)
        chatDispatch({
            type:chatActions.AUTO_SET_CURRENT_CHAT, 
            payload:{saidChat:currentChat, 
                noChatCallback:navigate('/connect', {state:{connectType:_Connect.create}})
            }
        })
    }

    return <Modal>
        <div className={styles.container}>
            <div className={styles.content}>
                <p className={styles.text}>You were removed from this chat</p>
                <DoNotDisturbRounded fontSize="large" sx={{color:"rgba(143, 143, 143, .6)"}}/>
            </div>
            <ModalButtons
                activity={handlePress}
            />
        </div>
    </Modal>
 
}
