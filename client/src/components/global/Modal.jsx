import ReactDom from 'react-dom'
import styles from '../../css/modal.module.css'

export default function Modal({children}) {
    return ReactDom.createPortal(
        <div className={styles.modal}>
            {children}
        </div>,
        document.getElementById('modal')
    ) 
}

export function ModalButtons({activity, activityText, cancel, cancelText}){
    return  <div className={styles.btns}>
        <button id={styles.cancel} onClick={activity} className={styles.btn}>
            {activityText || 'Okay'}
        </button>
        {
            cancel && //if there is a cancel fn show the cancel btn
            <button id={styles.ok} onClick={cancel} className={styles.btn}>
                {cancelText || 'Cancel'}
            </button>
        }
    </div>
}