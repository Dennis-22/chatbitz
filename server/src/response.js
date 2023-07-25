function sendError(res, error, statusCode, message){
    console.log(error)
    res.status(statusCode).json({success:false, message})
    return
}

// for sending data
function sendData(res, statusCode, data, message){
    res.status(statusCode ? statusCode : 200).json({success:true, data, message: message || 'success'})
    return
}

//for sending confirmation messages
function sendMessage(res, statusCode, message){
    res.status(statusCode).json({success:true, message})
    return
}


module.exports = {
    sendError, 
    sendData, 
    sendMessage, 
}