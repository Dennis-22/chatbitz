import { useNavigate } from "react-router-dom"
import DoNotDisturbRounded from '@mui/icons-material/DoNotDisturbRounded'
import styles from '../../css/removed.module.css'
import Modal, {ModalButtons} from "./Modal"
import { _PerformActionBeforeStart } from '../../utils/types'
import { usePlaygroundContext } from "../../utils/hooks"
import { _Connect } from "../../utils/types"

export default function RemovedModal() {
    const {toggleYouWereRemoved} = usePlaygroundContext()
    const navigation = useNavigate()

    const handlePress = ()=>{
        toggleYouWereRemoved(false)
        navigation('/connect', {state:{connectType:_Connect.create}})
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
