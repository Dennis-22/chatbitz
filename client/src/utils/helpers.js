function idGenerator(){
    const head = Date.now().toString(36)
    const tail = Math.random().toString(36).substr(2)
    return head + tail
}


async function requestMaker(method, url, data){
    if(method === 'POST'){
        let results = await fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body:JSON.stringify(data)
        });

        let response = await results.json()
        return response
    }

    if(method === 'GET'){
        let request = await fetch(url)
        if(request.ok){
            let results = await request.json()
            return {error:false, data:results.data}
        }
        let errorMsg = await request.json() 
        return {error:true, message:errorMsg.message}
    }

    if(method === 'PUT'){
        let results = await fetch(url, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body:JSON.stringify(data)
        });

        let response = await results.json()
        return response
    }

    if(method === 'DELETE'){
        let request = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body:JSON.stringify(data)
        });

        
        if(request.ok){
            let response = await request.json()
            return {error:false, data:response.data}
        }
        let errorMsg = await request.json() 
        return {error:true, message:errorMsg.message}
    }
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

function getApiErrorResponse(error){
    console.log(error)
    // if error from the backend
    if(error.response) return error.response.data.message
    return error.message || 'An error occurred please try again'
}


export {requestMaker, idGenerator, setItemToSessionStorage, getItemFromStorage, getApiErrorResponse}