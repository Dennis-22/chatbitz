import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import styles from '../../css/connect.module.css'
import {charsAllowed} from '../../utils/constance'
import { _Connect } from '../../utils/types';

export default function Form(props){
    const {process, setProcess, connect, connectDetails, setConnectDetails} = props
    const {error} = process

    const handleChange = (value, field)=>{
        if(process.error) setProcess((cur) => ({...cur, error:""}))
        setConnectDetails((cur) => ({...cur, [field]:value}))
    }

    return <div className={styles.formContainer}>
        
        <p className={error ? styles.textShow : styles.textHide}>{error}</p>

        <form className={styles.form}>

            <Input state={connectDetails.username} onChange={(value)=>handleChange(value, 'username')} label="Username" placeholder="Dennis Jeminal" maxLength={charsAllowed.username}/>
            <Input state={connectDetails.chatName} onChange={(value)=>handleChange(value, 'chatName')} label="Chat's Name" placeholder="Gen-z's Court" maxLength={charsAllowed.chatName}/>
            

            {connect === _Connect.create &&
                <FormControlLabel
                    value={false}
                    control={<Switch color="primary" />}
                    label="Secure chat"
                    labelPlacement="start"
                    onChange={()=>handleChange(!connectDetails.secure, 'secure')}
                />
            }

            {connectDetails.secure && <Input 
                    state={connectDetails.password} 
                    onChange={(value)=>handleChange(value, "password")} 
                    label="Password for your chat" 
                    placeholder="Use a secured password"
                />
            }

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
        />
    </section>
}