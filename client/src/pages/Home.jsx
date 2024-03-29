import {useRef, useState} from 'react'
import { useNavigate, Link } from 'react-router-dom'
import IconButton from '@mui/material/IconButton';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded';
import styles from  '../css/home.module.css'
import Logo from '../components/global/Logo';
import { _Connect } from '../utils/types';

const documentation = [
    {
        title:'Create A Chat', 
        text:[
            "You Create a chat by first providing the name of the chat.",
            "If the name you provide for your chat has already been taken, you must provide a new name.",
            "You provide your username. Your username is what other participants you are in a chat with sees.",
            "A creator of a chat is called an admin",
            "Chats are by default public and anyone can join. To keep it private, secure the chat with a password. Only users with the password can join."
        ]
    },
    {
        title:"Join a chat",
        text:[
            "You Join a chat by first providing the name of the chat.",
            "If there is no chat registered with that name, you would be prompted.",
            "If the chat you want to join is secured, you will need to provide the password to join.",
            "You provide your username. Your username is what other participants you are in a chat with sees.",
            "Once you join a chat, you would be able to see all the conversations of the chat."
        ]
    },
    {
        title:"Messaging",
        text:[
            "Messages are sent and received just like any other messaging service.",
            "Any member of a chat can send a message and it will be delivered to all the other members"
        ]
    },
    {
        title:"Rules",
        text:[
            "No email, telephone or password required.",
            "You can leave and rejoin a chat when necessary.",
            "An admin of a chat can remove any member in a chat",
            "Once there are no other participants in a chat with you and you refresh your browser, you automatically leave the chat and the chat gets deleted",
            "Once the last person leaves the chat, the chat is automatically deleted",
            "All messages are deleted together the chat."
        ]
    }
]


export default function Home(){
    const docsRef = useRef(null)
    const navigation = useNavigate()
    
    const scrollToView = ()=>{
        window.scrollTo(0, docsRef.current.offsetTop)
    }

    return <div className={styles.home}>
         <header className={styles.header}>
            <nav className={styles.nav}>
                <Logo />
                <p className={styles.navEl} onClick={scrollToView}>Usage</p>
            </nav>
        </header>

        <div className={styles.hero}>
            <section className={styles.heroSec}>
                <h1 className={styles.heroText}>Meet. Chat. Plan.</h1>
                <p className={styles.heroSubText}>Connect with anyone, anywhere with zero effort and no limitations.</p>
                <button className={styles.heroBtn} onClick={()=>navigation('/connect', {state:{connectType:_Connect.create}})}>Start Chatting</button>
            </section>
        </div>

        <div className={styles.helper}>
            <h2 className={styles.helperText}>
                <Link to="connect" state={{connectType:_Connect.create}} className={styles.helperLink}>Create</Link> a chat or 
                <Link to="connect" state={{connectType:_Connect.join}} className={styles.helperLink}> join </Link> 
                an existing one and experience new way of communicating.
            </h2>
        </div>

        <Documentation docsRef={docsRef} />

    </div>
}


function Documentation({docsRef}){
    return <div className={styles.documentation} ref={docsRef}>
    <p className={styles.docTitle}>Usage</p>

    <div className={styles.docWrapper}>
        {documentation.map((doc, index) => <DocMaker {...doc} key={index}/>)}
    </div>
</div>
}

function DocMaker({title, text}){
    const [show, setShow] = useState(false)

    return <article className={styles.docArticle}>
        <div className={styles.docControl}>
            <p className={styles.docArtTitle}>{title}</p>
            <IconButton onClick={()=>setShow(!show)}>
                {
                    show ? 
                    <KeyboardArrowUpRoundedIcon sx={{color:'#fff'}}/> : 
                    <KeyboardArrowDownRoundedIcon sx={{color:'#fff'}}/> 
                }
            </IconButton>
        </div>
        
        {
            show && <div className={styles.docArtTextWrap}>
                {text.map((txt, index) => <p key={index} className={styles.docArtText}>{index+1}. {txt}</p>)}
            </div>
        }
        
    </article>
}