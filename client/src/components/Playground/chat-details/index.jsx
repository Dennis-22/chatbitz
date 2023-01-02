import styles from '../../../css/chat-details.module.css'
import ProfilePhoto from '../../global/ProfilePhoto'
import {useChatContext, useAppContext} from '../../../utils/hooks'

export default function ChatDetails() {
  return (
    <div className={styles.body}>
      <Content />
    </div>
  )
}

export function MobileChatDetails(){
  const {setShowMobileChatDetails} = useAppContext()
  return <div className={styles.mobChatDetails}>
    <div className={styles.empty} onClick={()=>setShowMobileChatDetails(false)}/>
    <div className={styles.mobChatDetailsContent}>
      <Content />
    </div>
  </div>
}

function Content(){
  const {user} = useAppContext()
  const {getCurrentChatDetails} = useChatContext()
  const {chatName, members} = getCurrentChatDetails()

  return <div className={styles.detailsWrap}>
    <div className={styles.chatDetails}>
      <ProfilePhoto name={chatName} />
      <p className={styles.chatName}>{chatName}</p>
    </div>

    <div className={styles.members}>
      <p className={styles.membersText}>{members.length} members</p>

      <section className={styles.membersWrap}>
        {
          members.map((mem, idx) => {
            const {id, username, accentColor, profilePhoto, admin} = mem
            return <div key={idx} className={styles.member} title={`${username} is a chat member`}>
                <ProfilePhoto size={30} image={profilePhoto} name={username} color={accentColor}/>
                <p className={styles.memberName}>{username}</p>
                {user.id === id && <p className={styles.you}>👑</p>}
                {admin &&  <p className={styles.admin}>admin</p>}
            </div>
          })
        }
      </section>
    </div>
  </div>
}