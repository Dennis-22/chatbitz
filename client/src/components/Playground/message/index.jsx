import styles from '../../../css/message.module.css'
import Header from './Header'
import Messages from './Messages'
import Input from './Input'
import {useChatContext} from '../../../utils/hooks'

export default function Message(){
  
  return (
    <div className={styles.body}>
      <Header />
      <Messages/>
      <Input />
    </div>
  )
}
