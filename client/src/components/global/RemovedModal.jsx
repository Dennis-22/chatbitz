import { useNavigate } from "react-router-dom"
import DoNotDisturbRounded from '@mui/icons-material/DoNotDisturbRounded'
import styles from '../../css/removed.module.css'
import Modal, {ModalButtons} from "./Modal"
import { _PerformActionBeforeStart } from '../../utils/types'
import { useAppContext } from "../../utils/hooks"

export default function RemovedModal() {
    const {showRemovedModal, setShowRemovedModal} = useAppContext()
    const navigation = useNavigate()

    const handlePress = ()=>{
        setShowRemovedModal({show:false, adminName:''})
        navigation('/join')
    }

    return <Modal>
        <div className={styles.container}>
            <div className={styles.content}>
                <p className={styles.text}>You were removed by {showRemovedModal.adminName} from this chat</p>
                <DoNotDisturbRounded fontSize="large" sx={{color:"rgba(143, 143, 143, .6)"}}/>
            </div>
            <ModalButtons
                activity={handlePress}
            />
        </div>
    </Modal>
 
}
