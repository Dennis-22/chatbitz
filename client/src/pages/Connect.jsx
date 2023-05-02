import { useEffect, useState} from "react"
import { useLocation, useNavigate } from "react-router-dom";
import Button from '@mui/material/Button';
import styles from '../css/connect.module.css'
import { useUserContext, useChatContext } from "../utils/hooks";
import Form from "../components/connect/Form"
import { ModalLoading } from "../components/global/Loading";
import { _Connect } from "../utils/types"
import { getApiErrorResponse } from "../utils/helpers";
import { createChatRoute, joinChatRoute } from "../utils/api";
import { chatActions } from "../utils/actions";

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
    const {chatDispatch, socket, connectToServer} = useChatContext()
    const [connect, setConnect] = useState(useLocation()?.state?.connectType || create)
    const [connectDetails, setConnectDetails] = useState(null) //createInputs or joinInputs
    const [process, setProcess] = useState({loading:false, error:""})
    const navigate = useNavigate()

    
    const handleCreateChat = async(e)=>{
        e.preventDefault()
        // connect to the server
        // set username in reducer to the newly typed name
        // navigate to playground
        
        setProcess({loading:true, error:""})
        try {
        
            let createChatProps = {...user, ...connectDetails}
            
            let request = await createChatRoute(createChatProps)
            let createdChat = request.data.data
        
            // set user current chat to the chat 
            chatDispatch({type:chatActions.ADD_CHAT,
                payload:{chat:createdChat, messages:[]}
            })
            
            // connect to server and navigate to playground
            if(!socket) await connectToServer()
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
    
            let request = await joinChatRoute(joinChatProps)
           
            let requestStatus = request.status
            let joinedChat = request.data.data
        

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
            if(!socket) await connectToServer()
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
                <h1 className={styles.title}>
                    {`${connect === create ? "Create" : "Join"} a chat`}
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

            
                <Button
                    onClick={()=>setConnect((cur) => (cur === create ? join : create))}
                    style={{marginLeft:300}} 
                >
                    {`${connect === create ? "Join" : "Create"} chat instead`}
                </Button>

            </div>
        </div>

        {process.loading && <ModalLoading />}
    </>  
}