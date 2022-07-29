
'use strict';
const AWS = require('aws-sdk');
const { json } = require('body-parser');
var Promise = require('promise');
// const { ErrorAndSucessMessage, sendResponse } = require('./error')
const dynamodb = new AWS.DynamoDB.DocumentClient({ region: "us-east-1" });


const getloginHistory = async (id, email) => {

    var params = {
        TableName: "service-aws-serverless-dev-LoginHistoryDB-15QE8GSNH06H7",
        Key: {
            "id": id,
            "email": email,
        }
    };
    // let getItem = new Promise((res, rej) => {
    //     dynamodb.get(params, function (err, data) {

    //         if(data)
    //         {
    //             console.log("====")
    //             // if (data.Item) {
    //                 existloginHistory(id, email)
    //                 console.log("===========.....")       
    //             // }
    //         }
    //         else if (!err) {
    //             if (!data.Item) {
    //                 loginHistory(id, email);
    //             }
    //         }  
    //     });
    // });
    // const result = await getItem;
    // res.end("success");
    // console.log(result)

    try {
    var res = await dynamodb.get(params).promise();
    return res
  } catch (err) {
    console.log(err)
    return false;
  }
}



const loginHistory = async () => {
    var params = {
        TableName: "service-aws-serverless-dev-LoginHistoryDB-15QE8GSNH06H7",
        Item: {
            "id": "16",
            "email": "test16@gmail.com",
            "loginType": "app",
            "status": "true"
        }, ConditionExpression: 'attribute_not_exists(id)'
    };
    try {
        var res = await dynamodb.put(params).promise();
        console.log(res, "data inserted")
        return res
    } catch (error) {
        console.log(error, "id already exist..")
    }

}
// exports.getloginHistory("10", "demo123@gmail.com")




// // already exist
exports.existloginHistory = async (event) => {
    let body = event.body;
    console.log(body, "=======444");
    try {
      var result = await getloginHistory(body["id"], body["email"])
  
      console.log(result, "...........111");

        if(!result.Item || result.Item == "")
        {
            console.log("88...............")
            loginHistory();
            console.log(",,,,6666")
        }

      // return result
      if (result.Item.id == "16" && result.Item.email == "test16@gmail.com" && result.Item.status == "false") //change (true, false)
      {
        console.log(result, "your alredy login")
  
        // if(result.Item == "")
        // try {
        //   var res = await loginHistory()
        //   console.log(res, ".........");
        //   return res
          
        // } catch (error) {
        //   console.log(error,"id already exist")
        // }
  
    return result
  }
    else {
      console.log(result, "Your first logout and try again login")
      return result
    }
  } catch (error) {
    console.log(error);
  }
  }
  
  let event = {
  "body": {
    "id": "16",
    "email": "test16@gmail.com",
    "loginType": "app",
    "status": "true"
  }
  }
  
  exports.existloginHistory(event);
//   exports.existloginHistory();
// exports.getloginHistory("3", "demo3@gmail.com")