import styles from '../../css/profile-photo.module.css'
import { useAppContext } from '../../utils/hooks'

export default function ProfilePhoto({size, image, name, color}) {
    const {deviceWidth} = useAppContext()
    const defSize = deviceWidth > 600 ? 35 : 25 //also set in css using media query
    
    return <div className={styles.PhotoDiv} 
        style={{width: size ? size : defSize, height: size ? size : defSize}}
    >
        {
            image ? <img src={image} className={styles.photo}/> :

            <div className={styles.namePhoto} 
                style={{width: size ? size : defSize, height: size ? size : defSize, backgroundColor:color || '#3a8be0'}}
            >
                <p className={styles.name}>{name.charAt(0)}</p>
            </div>
        }

        
    </div>
}
