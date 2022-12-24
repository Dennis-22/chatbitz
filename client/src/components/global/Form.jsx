import { useState } from 'react';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import styles from '../../css/form.module.css'
import {useAppContext} from '../../utils/hooks'

function Form(props){
    const {error, setError, chatName, setChatName, type, secure, setSecure, password, setPassword} = props
    const {user, setUser} = useAppContext()

    const handleUserChange = (value, property)=>{
        if(error.status) setError({...error, status:false})
        setUser({...user, [property]: value})
    }

    const handleChange = (e, setState)=>{
        if(error.status) setError({...error, status:false})
        let value = e.target.value
        setState(value)
    }

    return <div className={styles.formContainer}>
        
        <p className={error.status ? styles.textShow : styles.textHide}>{error.text}</p>


        <form className={styles.form}>

            <Input state={user.username} handleChange={(e)=>handleUserChange(e.target.value, 'username')} label="Username" placeholder="Dennis Jeminal"/>
            <Input state={chatName} handleChange={(e)=>handleChange(e, setChatName)} label="Chat's Name" placeholder="Gen-z's Court"/>

            {type === 'Create' &&
                <FormControlLabel
                    value={false}
                    control={<Switch color="primary" />}
                    label="Secure chat"
                    labelPlacement="start"
                    onChange={()=>setSecure(!secure)}
                />
            }

            {secure && <Input state={password} handleChange={(e)=>handleChange(e, setPassword)} label="Password for your chat" placeholder="Use a secured password"/>}

        </form>

    </div>
}


function Input({state, handleChange, label, placeholder}){
    return <section className={styles.formInput}>
        <label className={styles.label}>{label}</label>
        <input 
            className={styles.input}
            value={state}
            type="text"
            placeholder={placeholder}
            onChange={handleChange}
        />
    </section>
}

export default Form