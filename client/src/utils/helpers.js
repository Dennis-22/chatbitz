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
        let results = await fetch(url)
        let response = await results.json()
        return response
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
        let results = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body:JSON.stringify(data)
        });

        let response = await results.json()
        return response
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

export {requestMaker, idGenerator, setItemToSessionStorage, getItemFromStorage}