import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import styles from '../../css/connect.module.css'
import Button from '@mui/material/Button';
import { useUserContext } from '../../utils/hooks';
import {charsAllowed} from '../../utils/constance'
import { _Connect } from '../../utils/types';
import { userActions } from '../../utils/actions';

export default function Form(props){
    const {userDispatch, userState:{user}} = useUserContext()
    const {process, setProcess, connect, connectDetails, setConnectDetails, handleCreateChat, handleJoinChat} = props
    const {error} = process

    // const handleChange = (value, field)=>{
    //     if(process.error) setProcess((cur) => ({...cur, error:""}))
    //     setConnectDetails((cur) => ({...cur, [field]:value}))
    // }

    return <div className={styles.formContainer}>
        
        <p className={error ? styles.textShow : styles.textHide}>{error}</p>

        <form 
            onSubmit={connect === _Connect.join ? handleJoinChat : handleCreateChat}
            className={styles.form} 
        >

            <Input state={user.username} 
                onChange={(value)=>userDispatch({type:userActions.EDIT_USER, payload:{username:value}})} 
                label="Username" 
                placeholder="Dennis Jeminal" 
                maxLength={charsAllowed.username}
            />
            <Input 
                state={connectDetails.chatName} 
                onChange={(value)=>setConnectDetails((cur) => ({...cur, chatName:value}))} 
                label="Chat's Name" placeholder="Gen-z's Court" 
                maxLength={charsAllowed.chatName}
            />
            

            {connect === _Connect.create &&
                <FormControlLabel
                    value={false}
                    control={<Switch color="primary" />}
                    label="Secure chat"
                    labelPlacement="start"
                    onChange={()=>setConnectDetails((cur) => ({...cur, secured:{status:!connectDetails.secured.status, password:""}}))}
                />
            }

            {connectDetails.secured.status && <Input 
                    state={connectDetails.secured.password} 
                    onChange={(value)=>setConnectDetails((cur) => ({...cur, secured:{...cur.secured, password:value}}))} 
                    label="Password for your chat" 
                    placeholder="Use a secured password"
                />
            }

                <Button 
                    variant="contained" 
                    style={{width:'100%', marginTop:20}}
                    // onClick={connect === create ? handleCreateChat : handleJoinChat}
                    type="submit"
                >
                    {connect === _Connect.create ? "Create" : "Join"}
                </Button>

        </form>

    </div>
}


function Input({state, onChange, label, placeholder, maxLength}){
    return <section className={styles.formInput}>
        <label className={styles.label}>{label}</label>
        <input 
            className={styles.input}
            value={state}
            type="text"
            placeholder={placeholder}
            onChange={(e)=>onChange(e.target.value)}
            maxLength={maxLength}
            required
        />
    </section>
}