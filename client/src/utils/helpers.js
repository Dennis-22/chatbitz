import {io} from 'socket.io-client'
import { ENDPOINT } from "./api"

async function connectToServer(){
    let socket = await io.connect(ENDPOINT)
    return socket
}

function idGenerator(){
    const head = Date.now().toString(36)
    const tail = Math.random().toString(36).substr(2)
    return head + tail
}

function setItemToSessionStorage(key, data){
    sessionStorage.setItem(key, JSON.stringify(data));
    // sessionStorage.setItem(key, data);
}

function getItemFromStorage(key){
    // let data = sessionStorage.getItem(key);
    let data = sessionStorage.getItem(key)
    return JSON.parse(data)
}

function extractDataFromServer(request){
    return request.data.data
}

function getApiErrorResponse(error){
    console.log(error)
    // if error from the backend
    if(error.response) return error.response.data.message
    return error.message || 'An error occurred please try again'
}


export {connectToServer, idGenerator, setItemToSessionStorage, getItemFromStorage, extractDataFromServer, getApiErrorResponse}