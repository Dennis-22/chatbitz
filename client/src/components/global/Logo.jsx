import styles from '../../css/logo.module.css'
import logo from '../../assets/logo.svg'

export default function Logo(){
    return <div className={styles.logo}>
        <img src={logo} className={styles.img}/>
        <p className={styles.name}>ChatBitz</p>
    </div>
}