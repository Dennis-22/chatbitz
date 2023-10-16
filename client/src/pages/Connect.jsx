import { useEffect, useState} from "react"
import { useLocation, useNavigate } from "react-router-dom";
import Button from '@mui/material/Button';
import styles from '../css/connect.module.css'
import { useUserContext, useChatContext } from "../utils/hooks";
import Form from "../components/connect/Form"
import { ModalLoading } from "../components/global/Loading";
import { _Connect } from "../utils/types"
import { connectToServer, getApiErrorResponse, extractDataFromServer, setItemToSessionStorage} from "../utils/helpers";
import { createChatRoute, joinChatRoute } from "../utils/api";
import { chatActions } from "../utils/actions";
import logo from '../assets/logo.svg'


const {create, join} = _Connect

const createInputs = {
    chatName:"",
    secured:{
        status:false,
        password:""
    }
}

const joinInputs = {
    chatName:"",
    secured:{
        status:false,
        password:""
    }
}

export default function Connect(){
    const {userState:{user}} = useUserContext()
    const {chatDispatch, socket, setSocket} = useChatContext()
    const [connect, setConnect] = useState(useLocation()?.state?.connectType || create)
    const [connectDetails, setConnectDetails] = useState(null) //createInputs or joinInputs
    const [process, setProcess] = useState({loading:false, error:""})
    const navigate = useNavigate()

    /**
     * Connect to the server
     * Set username in the reducer to the newly typed name
     * Navigate to playground
     */
    const handleCreateChat = async(e)=>{
        e.preventDefault()
  
        setProcess({loading:true, error:""})
        try {
        
            const createChatProps = {...user, ...connectDetails}
                        
            const request = await createChatRoute(createChatProps)
            const createdChat = extractDataFromServer(request)
            
            // set user current chat to the chat 
            chatDispatch({type:chatActions.ADD_CHAT,
                payload:{chat:createdChat, messages:[]}
            })
            
            // connect to server and navigate to playground
            if(!socket) {
                let newSocket = await connectToServer()
                setSocket(newSocket)
            }

            // update session storage with username and user chats
            setItemToSessionStorage("User", {...user})
            navigate('/playground', {state:{connectType:create, chatId:createdChat.id}})
        } catch (error) {
            let errorMsg = getApiErrorResponse(error)
            setProcess({loading:false, error:errorMsg})
        }

    }

    const handleJoinChat = async(e)=>{
        e.preventDefault()

        setProcess({loading:true, error:""})
        try {
            // don't include password when joining
            let joinChatProps = {...user, 
                chatName:connectDetails.chatName,
            }

            // chat is password protected so add password to the form data
            if(connectDetails.secured.status){
                joinChatProps = {...joinChatProps, password:connectDetails.secured.password}
            }

            setProcess({loading:true, error:""})
    
            const request = await joinChatRoute(joinChatProps)
            const requestStatus = request.status
            const joinedChat = extractDataFromServer(request)

            // provide password
            if(requestStatus === 204){
                setProcess({loading:false, error:"Provide password to join"})
                // make password input visible
                return setConnectDetails({...connectDetails, secured:{status:true, password:""}})
            }

            const {chatDetails, chatMessages} = joinedChat

            // set user current chat to the chat 
            chatDispatch({
                type:chatActions.ADD_CHAT, 
                payload:{chat:chatDetails, messages:chatMessages}
            })

            // connect to socket and navigate to playground
            if(!socket) {
                let newSocket = await connectToServer()
                setSocket(newSocket)
            }
            
            setItemToSessionStorage("User", {...user})
            navigate('/playground', {state:{connectType:join, chatId:chatDetails.id}}) 
        } catch (error) {
            let errorMsg = getApiErrorResponse(error)
            setProcess({loading:false, error:errorMsg})
        }
    }

    useEffect(()=>{
        setConnectDetails(connect === create ? createInputs : joinInputs)
    },[connect])

    if(!connectDetails) return null

    return <>    
        <div className={styles.body}>
            <div className={styles.wrapper}>
                <img src={logo} className={styles.logo}/>

                <h1 className={styles.title}>
                    {`${connect === create ? "Create" : "Join"} A Chat`}
                </h1>

                <Form 
                    process={process}
                    setProcess={setProcess}
                    connect={connect}
                    connectDetails={connectDetails}
                    setConnectDetails={setConnectDetails}
                    handleCreateChat={handleCreateChat}
                    handleJoinChat={handleJoinChat}
                />

            
                <Button onClick={()=>setConnect((cur) => (cur === create ? join : create))}>
                    {`${connect === create ? "Join" : "Create"} chat instead`}
                </Button>

            </div>
        </div>

        {process.loading && <ModalLoading />}
    </>  
}