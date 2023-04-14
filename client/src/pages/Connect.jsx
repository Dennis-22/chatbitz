import { useState, useLayoutEffect } from "react"
import styles from '../css/connect.module.css'
import { useUserContext } from "../utils/hooks";
import Form from "../components/connect/Form"
import Button from '@mui/material/Button';
import { _Connect } from "../utils/types"

const {create, join} = _Connect

const createChatInputs = {
    username:"", 
    chatName:"",
    secure:false,
    password:""
}

const joinChatInputs = {
    username:"", 
    chatName:""
}

export default function Connect(){
    const {userState} = useUserContext()
    const [connect, setConnect] = useState(create)
    const [connectDetails, setConnectDetails] = useState(null)
    const [process, setProcess] = useState({loading:false, error:""})

    const handleConnect = (connectType)=>{
        if(connectType === create){

        }

        if(connectType === join){

        }

        return null
    }

    useLayoutEffect(()=>{
        if(connect === create) setConnectDetails(createChatInputs)
        if(connect === join) setConnectDetails(joinChatInputs)
    },[connect])

    if(!connectDetails) return null

    return  <div className={styles.body}>
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
            />

            <div className={styles.btns}>
                <Button 
                    variant="contained" 
                    style={{width:150, marginTop:30}} 
                    onClick={handleConnect}
                >
                    {connect === create ? "Create" : "Join"}
                </Button>

                <Button onClick={()=>setConnect((cur) => (cur === create ? join : create))}>
                    {`${connect === create ? "Join" : "Create"} chat instead`}
                </Button>
            </div>

        </div>
    </div>
}