const ErrorAndSucessMessage = async () => {
    var common = {
        "loginRequrid": "id must reqiured !, email must reqiured ! ",
        "insertmsg": "Item inserted",
        "exists": "id Already exists",
        "loginsucess": "Login sucess",
        "alredyLogin": "Your are Already login this device ",
        "otherDevicelogin": "Your are Already login other device please logout and try again",

    }
    return common
}

const sendResponse = (body, bool, status, check) => {
    // console.log(check,"check");
    var response = {
        "statusCode": status == undefined ? 200 : status,
        "headers": {
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,POST,PATCH,GET,DELETE"
        },
        'body': check ? JSON.stringify(body) : JSON.stringify({ 'msg': body, success: bool }),
        "isBase64Encoded": false
    };
    return response
}

module.exports = { ErrorAndSucessMessage, sendResponse }