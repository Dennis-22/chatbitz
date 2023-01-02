import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Button from '@mui/material/Button';
import styles from '../css/create-join.module.css'
import Form from "../components/global/Form"
import Loading from "../components/global/Loading"
import {useAppContext, useChatContext} from '../utils/hooks'
import { requestMaker } from "../utils/helpers";
import { api } from "../utils/constance";
import { getItemFromStorage, setItemToSessionStorage } from "../utils/helpers";


export default function Create() {
  const {user} = useAppContext()
  const {socket, connectToServer, setChats, setPerformActionBeforeStartUp} = useChatContext()
  const [chatName, setChatName] = useState('')
  const [secure, setSecure] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState({status:false, text:''})
  const [loading, setLoading] = useState(false)
  const navigation = useNavigate()

  const handleCreate = async()=>{
    setLoading(true)
    // params to be sent to server
    // chatName, username, id, secured, accentColor, profilePhoto
    let serverData = {...user, chatName, secured:{status:secure, password}}
    try {
      let results = await requestMaker('POST', api.createChat, serverData)
      let {success, data, message} = results
      if(success){
        if(!socket)connectToServer() //don't connect to server when already connected
        // set to the data from the server and redirect to playground
        setPerformActionBeforeStartUp({action:'create', chatDetails:data.chatDetails})
        // set the chat to user chats
        setChats((prev) => ({loading:false, error:false, fetched:true, chatsData:[...prev.chatsData, data.chatDetails]}))

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
    <>
      <div className={styles.body}>
        <h1 className={styles.title}>Create a chat</h1>
        <Form 
          chatName={chatName} 
          setChatName={setChatName}
          password={password}
          setPassword={setPassword} 
          secure={secure} 
          setSecure={setSecure}
          loading={loading}
          error={error}
          setError={setError}
          type="Create"
        />

        <div className={styles.btns}>
            <Button variant="contained" style={{width:150, marginTop:30}} onClick={handleCreate}>Create</Button>

            <Button onClick={()=>navigation('/join')}>Join a Chat instead</Button>
        </div>

      </div>

      {loading && <Loading />}
    </>
  )
}
