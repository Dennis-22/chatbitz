import styles from '../../css/app-already-running.module.css'

export default function AppAlreadyRunning(){
    return <div className={styles.body}>
        <div className={styles.content}>
            <p className={styles.title}>Chatbitz Already Running.</p>
            <p className={styles.text}>
                Chatbitz can only run in one tab of your browser.
                Please close other tab(s) running this app to continue.
            </p>
        </div>
    </div>
}