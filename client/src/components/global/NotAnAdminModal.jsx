// if a user tries to remove a member and user is not an admin 
import DoNotDisturbRounded from '@mui/icons-material/DoNotDisturbRounded'
import styles from '../../css/not-admin-modal.module.css'
import Modal, {ModalButtons} from "./Modal"
import { useAppContext } from "../../utils/hooks"

export default function NotAnAdminModal() {
    const {setShowNotAdminModal} = useAppContext()

    return <Modal>
        <div className={styles.container}>
            <div className={styles.content}>
                <p className={styles.title}>You are not an admin!!!</p>
                <p className={styles.text}>Only admins can remove a member</p>
                <DoNotDisturbRounded fontSize="large" sx={{color:"rgba(143, 143, 143, .6)"}}/>
            </div>
            <ModalButtons
                activity={()=>setShowNotAdminModal(false)}
            />
        </div>
    </Modal>
 
}
