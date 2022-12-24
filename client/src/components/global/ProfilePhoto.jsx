import styles from '../../css/profile-photo.module.css'
import { screenSizes } from '../../utils/constance'
import { useAppContext } from '../../utils/hooks'

export default function ProfilePhoto({size, image, name, style, color}) {
    const {deviceWidth} = useAppContext()
    const defSize = deviceWidth > 600 ? 40 : 30 //also set in css using media query
    
    return <div className={styles.PhotoDiv} 
        style={{width: size ? size : defSize, height: size ? size : defSize}}
    >
        {
            image ? <img src={image} className={styles.photo}/> :

            <section className={styles.namePhoto} 
                style={{width: size ? size : defSize, height: size ? size : defSize, backgroundColor:color || 'red'}}
            >
                <p className={styles.name}>{name.charAt(0)}</p>
            </section>
        }

        
    </div>
}
