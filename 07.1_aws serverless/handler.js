'use strict';
const AWS = require('aws-sdk');
const { ErrorAndSucessMessage, sendResponse } = require('./error')
const dynamodb = new AWS.DynamoDB.DocumentClient({ region: process.env.Aws_Region });
const login_History = process.env.LoginHistoryDBTable;

//// Save Data 
// module.exports.loginHistory = async (event, context, callback) => {
const loginHistory = async (body) => {

  body["createdAt"] = `${Math.round((Date.now() / 1000))}`
  console.log(body)
  let params = {
    TableName: login_History,
    Item: body,
  };
  await dynamodb.put(params).promise();
  return body
}

// //list Item
module.exports.listloginHistory = async (event, context, callback) => {
  console.log(event, "........");

  try {
    const params = {
      TableName: login_History,
    }
    return await dynamodb.scan(params).promise().then((result) => {
      callback(null, sendResponse(200, result))

    }).catch(error => {
      console.log(error)
    })

  } catch (error) {
    console.log(error)
    return sendResponse((await ErrorAndSucessMessage()).apiServerError, 500)
  }
}



//fatch item in database
const getloginHistory = async (id, email) => {
  const params = {
    TableName: login_History,
    Key: {
      "id": id,
      "email": email,
    }
  };
  try {
    var res = await dynamodb.get(params).promise();
    return res
  } catch (err) {
    console.log(err)
    return false;
  }
};



// // already exist
exports.existloginHistory = async (event) => {
  var body = JSON.parse(event["body"]);
  var id = body["id"]
  var email = body["email"]
  // try {
  var result = await getloginHistory(id, email)

  try {
    //put item
    if (!result.Item || result.Item == "") {
      var res = await loginHistory(body);
      console.log(",,,,login...", res)
      return sendResponse((await ErrorAndSucessMessage()).loginsucess, 200)
    }

    //check item
    if (result.Item.id == body.id && result.Item.email == body.email && result.Item.status == body.status) {
      return sendResponse((await ErrorAndSucessMessage()).alredyLogin, 400)
    }
    else {
      return sendResponse((await ErrorAndSucessMessage()).otherDevicelogin, 400)
    }
    
    // else {
    //   return sendResponse((await ErrorAndSucessMessage()).apiServerError, 500)
    // }


    // //check item
    // if (result.Item.id == body.id && result.Item.email == body.email && result.Item.status == body.status) {
    //   return sendResponse((await ErrorAndSucessMessage()).alredyLogin, 400)
    // }
    // else {
    //   return sendResponse((await ErrorAndSucessMessage()).otherDevicelogin, 400)
    // }
  } catch (error) {
    return sendResponse((await ErrorAndSucessMessage()).apiServerError, 500);
  }

}
