const ErrorAndSucessMessage = async ()=>{
    var common = {
        "loginRequrid": "id must reqiured !, email must reqiured !, username must reqiured ! ",
        "insertmsg": "Item inserted",
        "exists": "id Already exists",
        "loginsucess": "Login sucess",
        "alredyLogin": "Your are Already login this device ",
        "otherDevicelogin": "Your are Already login other device please logout and try again",

    }
    return common
}

const sendResponse = (body,bool,status,check) => {   
    console.log(check,'check')

    var response = {
        'body' : check?JSON.stringify(body):JSON.stringify({'msg':body, sucess:bool}),
        'statusCode':  status == undefined ?200:status,
        "isBase64Encoded": false
    };
    return response
}

module.exports = {ErrorAndSucessMessage, sendResponse}