import { useEffect, useState} from "react"
import { useLocation, useNavigate } from "react-router-dom";
import Button from '@mui/material/Button';
import styles from '../css/connect.module.css'
import { useUserContext, useChatContext } from "../utils/hooks";
import Form from "../components/connect/Form"
import { ModalLoading } from "../components/global/Loading";
import { _Connect } from "../utils/types"
import { requestMaker } from "../utils/helpers";
import { api } from "../utils/constance";
import { userActions, chatActions } from "../utils/actions";

const {create, join} = _Connect

const createInputs = {
    username:"", 
    chatName:"",
    secured:{
        status:false,
        password:""
    }
}

const joinInputs = {
    username:"", 
    chatName:"",
    secured:{
        status:false,
        password:""
    }
}

export default function Connect(){
    const {userDispatch, userState:{user, chats}} = useUserContext()
    const {chatState, chatDispatch} = useChatContext()
    const [connect, setConnect] = useState(useLocation()?.state?.connectType || create)
    const [connectDetails, setConnectDetails] = useState(null)
    const [process, setProcess] = useState({loading:false, error:""})
    const navigate = useNavigate()
    // console.log('chats', chats)
    // console.log('user chats', chatState.chats)
    // console.log('crrent chat', chatState.currentChat)
    // console.log('chat messages', chatState.messages)

    
    const handleCreateChat = async(e)=>{
        e.preventDefault()
        // connect to the server
        // set username in reducer to the newly typed name
        // navigate to playground

        // chatName, username, id, secured, accentColor, profilePhoto
        setProcess({loading:true, error:""})
        try {
            let serverData = {...user, ...connectDetails}
            let results = await requestMaker('POST', api.createChat, serverData)
            let {success, data, message} = results
            
            if(success === false){
                return setProcess({loading:false, error:message})
            }
            // add chat user chats
            userDispatch({type:userActions.ADD_CHAT, payload:data.id})
            // set user current chat to the chat 
            chatDispatch({type:chatActions.ADD_CHAT,
                payload:{chat:data, messages:[]}
            })
            setProcess({loading:false, error:""})
            navigate('/playground', {state:{connectType:create}})
        } catch (error) {
            console.log(error)
            setProcess({loading:false, error:"An error occurred please try again later"})
        }

    }

    const handleJoinChat = async(e)=>{
        e.preventDefault()

        setProcess({loading:true, error:""})
        try {
            // don't include password when joining
            let serverData = {...user, 
                chatName:connectDetails.chatName,
            }

            // chat is password protected so add password to the form data
            if(connectDetails.secured.status){
                serverData = {...serverData, password:connectDetails.secured.password}
            }

            setProcess({loading:true, error:""})
    
            let request = await requestMaker('POST', api.joinChat , serverData)
            
            const {success, message} = request

            // user successfully joins
            if(success === true){
                const {data:{chatDetails, chatMessages}} = request
                // add chat user chats
                userDispatch({type:userActions.ADD_CHAT, payload:chatDetails.id})
                // set user current chat to the chat 
                chatDispatch({
                    type:chatActions.ADD_CHAT, 
                    payload:{chat:chatDetails, messages:chatMessages}
                })

                setProcess({loading:false, error:""})
                
                navigate('/playground', {state:{connectType:join}})
                
            }else{

                if(message === "Provide password"){
                    setProcess({loading:false, error:"Provide password to join"})
                    // make password input visible
                    return setConnectDetails({...connectDetails, secured:{status:true, password:""}})
                }

                if(message === "Invalid password"){
                    return setProcess({loading:false, error:"Invalid password"})
                }
            }
            setProcess({loading:false, error:"An error occurred please try again later"})
        } catch (error) {
            console.log(error)
            setProcess({loading:false, error:"An error occurred please try again later"})
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