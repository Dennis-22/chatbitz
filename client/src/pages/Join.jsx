import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Button from '@mui/material/Button';
import styles from '../css/create-join.module.css'
import Form from "../components/global/Form"
import {useAppContext, useChatContext} from '../utils/hooks'
import { requestMaker } from "../utils/helpers";
import { api } from "../utils/constance";
import { getItemFromStorage, setItemToSessionStorage } from "../utils/helpers";


export default function Join() {
    const {user} = useAppContext()
    const {socket, connectToServer, setPerformActionBeforeStartUp, setChats, setMessages} = useChatContext()
    const [chatName, setChatName] = useState('')
    const [secure, setSecure] = useState(false)
    const [password, setPassword] = useState('')
    const [error, setError] = useState({status:false, text:''})
    const [loading, setLoading] = useState(false)
    const navigation = useNavigate()

    const handleJoin = async()=>{
        if(!user.username) return setError({status:true, text:'Provide your username'})
        if(!chatName) return setError({status:true, text:'Provide the chat name'})

        setLoading(true)
        // params to be sent to server
        // chatName, username, id, secured, accentColor, profilePhoto
        let serverData = {...user, chatName, password}
        try {
          let results = await requestMaker('POST', api.joinChat , serverData)
          let {success, data, message} = results
          if(success){
            if(!socket)connectToServer() //don't connect to server when already connected
            setPerformActionBeforeStartUp({action:'join', chatDetails:data.chatDetails})
            // set the chat to user chats
            setChats((prev) => ({loading:false, error:false, fetched:true, chatsData:[...prev.chatsData, data.chatDetails]}))
            setMessages(data.messages)
            // add chat id to session storage
            let oldDetails = getItemFromStorage('User')
            let userChats = oldDetails.chats
            let newDetails = {
              // check if user has joined chats and add new chatId or set a new chatId
              ...oldDetails, chats: userChats ? [...userChats, data.chatDetails.id] : [data.chatDetails.id]
            }
            setItemToSessionStorage('User', newDetails)

            return navigation('/playground')
          }

        // check if chat is locked and user must provide password
          if(message === "Enter password to join chat"){
            setSecure(true)
          }
          // if chat already exist
          setError({status:true, text:message})
          setLoading(false)
        } catch (error) {
          console.log(error)
          setLoading(false)
          setError({status:true, text:'An error occurred'})
        }
      }

    return (
      <div className={styles.body}>
        <div className={styles.wrapper}>
            <h1 className={styles.title}>Join a chat</h1>
            <Form 
                chatName={chatName} 
                setChatName={setChatName}
                password={password}
                setPassword={setPassword} 
                secure={secure} 
                loading={loading}
                error={error}
                setError={setError}
            />

            <div className={styles.btns}>
                <Button variant="contained" style={{width:150, marginTop:30}} onClick={handleJoin}>Join</Button>

                <Button onClick={()=>navigation('/create')}>Create a Chat instead</Button>
            </div>

        </div>
      </div>
    )
}
