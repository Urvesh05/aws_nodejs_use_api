'use strict';
const AWS = require('aws-sdk');

const AmazonCognitoIdentity = require("amazon-cognito-identity-js");
// const CognitoUserPool = AmazonCognitoIdentity.CognitoUserPool;
// const AuthenticationDetails = AmazonCognitoIdentity.AuthenticationDetails;
// const CognitoUser = AmazonCognitoIdentity.CognitoUser;

var poolData = {
    UserPoolId : process.env.USER_POOL_ID, // Your user pool id here    
    ClientId : process.env.CLIENT_ID // Your client id here
};
// const SignUp = process.env.SignUp

var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

module.exports.SignUp = (event, context, callback)=>{
    console.log(event,'.........');
    const body = event.body;

    var response = {
        "body": ''
    };
var username = body.username;
var email = body.username;
var password = body.password;


// var dataEmail = {
//     email: body.email,
//     password : body.password

// }
// var password : body.password;
// var attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(dataEmail);
// attributrList.push(attributeEmail);

//or
var attributeList = [];
attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name: "email", Value: email}));

// userPool.SignUp(username, password, attributrList, null, function(err, result) {
//     if (err) {
//         console.log(err,'............');
//     }

//     const cognitoUser = result.user;
//     console.log('user Name is '+ cognitoUser.getUsername());
//     response["body"] = JSON.stringify({"sucess": true, "msg": "User is created sucessfully" });
//     callback(null, response);
//     return;
// })

// }

userPool.SignUp(username, password, attributeList, null, function(err, result){
    if (err) {
        // alert(err);
        console.log(err,"..........");
        return;
    }
    // var cognitoUser = result.user;
    // console.log('user name is ' + cognitoUser.getUsername());
    console.log('user registration confirm ' + result.user);
    response["body"] = JSON.stringify({"sucess":true, "msg": "user create sucess"});
    callback(null, response);
    return;
});
};



module.exports.getCognitoUser = (event, context, callback)=>
{
    console.log(event,'........');
    const body = event.body;

    var username = body.username;

    var userData = {
        Ussername : username,
        Pool: userPool 
    };

    var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

    cognitoUser.getCognitoUser((err,result)=>{

    if (err) {
        console.log(err);
    }

    console.log(result,"...........")
    let response ={
         "body":JSON.stringify({"sucess":true, "msg": " sucessfully"})
    }
    callback(null, response);
}
)}


