// 'use strict';

// const AWS = require('aws-sdk');
// const message =require('./message');
// const {ErrorAndSucessMessage, sendResponse} = require('./message')
// const dynamodb = new AWS.DynamoDB.DocumentClient({region: process.env.Aws_Region});
// const dbTableName = process.env.LoginHistoryDB;

// //custom message
// function sendResponse(statusCode, message) {
//   return {
//     statusCode: statusCode,
//     body: JSON.stringify(message)
//   }
// }


// // Save Item 
// module.exports.loginHistory = async (event, context, callback) => {
//   console.log(event, '................');

//   const body = JSON.parse(event.body);
//   const datetime = new Date().toDateString();

//   if (!body.id || !body.email || !body.username) {
//     return sendResponse(400, { message: 'id must reqiured !, email must reqiured !, username must reqiured !' });
//   }
//   else if (typeof body.id !== 'string') {
//     return callback(null, sendResponse(400, { error: 'id must be string' }));
//   }

//   try {
//     const params = {
//       TableName: dbTableName,
//       Item: {
//         id: body.id,
//         email: body.email,
//         deviceId: body.deviceId,
//         username: body.username,
//         loginType: body.loginType,
//         createdAt: datetime,

//       },
//       ConditionExpression: 'attribute_not_exists(id)'
//     }

//     return await dynamodb.put(params).promise().then(() => {
//       console.log("inserted...")
//       callback(null, sendResponse(200, { message: 'data inserted successfully' }))

//     }).catch((err) => {
//       console.log(err);

//       if (err.code === "ConditionalCheckFailedException") {
//         console.log("id Already exists");

//         const body = {
//           message: ("id Already exists")
//         }
//         return sendResponse(200, body);
//       }

//       else if (err) console.log("Insert Failed with some other reason", err);

//       else console.log("Sucessfully inserted");
//     });

//   } catch (error) {
//     console.log(error);
//   }
// };


// //list Item
// module.exports.listloginHistory = async (event, context, callback) => {
//   console.log(event, "........");

//   try {
//     const params = {
//       TableName: dbTableName,
//       Key: {
//         id: event.id,
//       }

//     }
//     return await dynamodb.scan(params).promise().then((result) => {
//       callback(null, sendResponse(200, result))

//     }).catch(error => {
//       console.log(error)
//     })

//   } catch (error) {
//     console.loh(error)
//   }
// }


// // get Item
// module.exports.getloginHistory = async (event, context, callback) => {
//   console.log(event, '.......');

//   try {
//     const params = {
//       TableName: dbTableName,
//       Key: {
//         id: event.pathParameters.id,
//       },
//     }
//     return await dynamodb.get(params).promise().then((result) => {
//       callback(null, sendResponse(200, result))

//     }).catch(error => {
//       console.log(error)

//     })
//   } catch (error) {
//     console.log(error)
//   }
// }



// //Alredy exist Login

// module.exports.existloginHistory = async (event, context, callback) => {
//   console.log(event, "..........")
//   const body = JSON.parse(event.body);

//   try {
//     body['createdAt'] = new Date().getTime;
//     const params = {
//       TableName: dbTableName,
//       Item: {
//         id: body.id,
//         email: body.email,
//         loginType: body.loginType

//       },
//       ConditionExpression: 'attribute_not_exists(loginType)'
//     }

//     return await dynamodb.put(params).promise().then(() => {

//       callback(null, sendResponse(200, { message: 'login Sucess' }))
//     }).catch(err => {
//       console.log(err, "email alredy login");

//       if (body.loginType == "app") {
//         console.log(" Your are Already login this device ");

//         const body = {
//           message: (" Your are Already login this device ")
//         }
//         return sendResponse(200, body);
//       }
//       else if (err.code === "ConditionalCheckFailedException") {
//         console.log(" Your are Already login other device please logout and try again ");

//         const body = {
//           message: ("Your are Already login other device please logout and try again")
//         }
//         return sendResponse(200, body);
//       }
//     })
//   } catch (error) {
//     console.log(error, '...........');
//   }
// }



/// Alredy exist Login 2.,,,,,,,,,,,,,,,

// module.exports.existloginHistory = async (event, context, callback) => {
//   const body = JSON.parse(event.body);

//   const params = {
//     TableName: login_History,
//     Item: {
//       id: body.id,
//       email: body.email,
//       loginType: body.loginType,
//     },
//     ConditionExpression: 'attribute_not_exists(loginType)'
//   };
//   try {
//     var res = await dynamodb.put(params).promise();
//     var result = sendResponse((await ErrorAndSucessMessage()).loginsucess, 200)
//     return result

//   } catch (err) {
//     if (body.loginType == "app" || body.loginType == "web") {
//       var result1 = sendResponse((await ErrorAndSucessMessage()).alredyLogin, 400);
//       return result1;
//     }
//     else if (err.code === "ConditionalCheckFailedException") {
//       var result = sendResponse((await ErrorAndSucessMessage()).otherDevicelogin, 400)
//       return result
//     }
//   }
//   return res
// };



// cognito userpool link:

// https://test-user-pool-111.auth.us-east-1.amazoncognito.com/login?response_type=code&client_id=5ak7puu13hm1mr1ijqmnf6a5nd&redirect_uri=https://www.google.com





// 'use strict';
// const AWS = require('aws-sdk');
// const { json } = require('body-parser');
// const { ErrorAndSucessMessage, sendResponse } = require('./error')
// const dynamodb = new AWS.DynamoDB.DocumentClient({ region: "us-east-1" });
// const login_History = "LoginHistoryDBTable"

/// Save Data 
// module.exports.loginHistory = async (event, context, callback) => {
//   let body = JSON.parse(event["body"]);
//   if (!body['id'] || !body['email']) {
//     return sendResponse((await ErrorAndSucessMessage()).loginRequrid, 400);
//   }
//   body["createdAt"] = `${Math.round((Date.now() / 1000))}`
//   let params = {
//     TableName: login_History,
//     Item: body,
//     ConditionExpression: 'attribute_not_exists(id)'
//   };
//   try {
//     var res = await dynamodb.put(params).promise();
//     var result = sendResponse((await ErrorAndSucessMessage()).insertmsg, 200)
//     return result

//   } catch (err) {
//     if (err.code === "ConditionalCheckFailedException") {
//       var result = sendResponse((await ErrorAndSucessMessage()).exists, 400)
//       return result
//     }
//   }
//   return res
// };


/// list Item
// module.exports.listloginHistory = async (event, context, callback) => {
//   const params = {
//     TableName: login_History
//   };
//   var res = await dynamodb.scan(params).promise();
//   console.log(res)
//   return {
//     body: JSON.stringify(res.Items),
//     statusCode: 200
//   }
// }

// get Item
// module.exports.getloginHistory = async (event, context, callback) => {
//   //
//   const params = {
//     TableName: login_History,
//     Key: {
//       id: event.pathParameters.id,
//     },
//   };
//   var res = await dynamodb.get(params).promise();
//   console.log(res);

//   return {
//     body: JSON.stringify(res.Item),
//     statusCode: 200
//   }
// };


// exports.getloginHistory = async (event) => {
//   const params = {
//     TableName:'service-aws-serverless-dev-LoginHistoryDB-18BM51GL1QQEV'
//   };

//     var res = await dynamodb.scan(params).promise();
//     console.log(res,"..............");
//     return res.Items
// };





// exports.getloginHistory();  ....node js .......

'use strict';
const AWS = require('aws-sdk');
const { json } = require('body-parser');
var Promise = require('promise');
// const { ErrorAndSucessMessage, sendResponse } = require('./error')
const dynamodb = new AWS.DynamoDB.DocumentClient({ region: "us-east-1" });

//insert item in dynamodb
// exports.loginHistory =  async()=>
// {
//   var params={
//     TableName: 'service-aws-serverless-dev-LoginHistoryDB-15QE8GSNH06H7',
//     Item:{
//       id:"7",
//       email:"raran123@gmail.com",
//       loginType:"web",
//       status:"false"
//     }
//   };

//   // let putItem = await dynamodb.put(params).promise();
//   //   console.log("insert data sucess")
//   // return putItem;

//   //// OR Promise() use...........

//   let putItem  = new Promise((res,rej)=>{

//      dynamodb.put(params, function(err,data){

//     if(err)
//     {
//       console.log(err);
//       rej(err);
//     }
//     else{
//       console.log("sucess");
//       res("Insert data into dynamodb")
//     }
//   });
// });

// const result = await putItem;
// console.log(result);
// }
// exports.loginHistory();



// //get all item
// exports.getloginHistory = async ()=>{

//   const params ={
//     TableName: 'service-aws-serverless-dev-LoginHistoryDB-15QE8GSNH06H7'
//   }
//   let getAll = new Promise((res,rej)=>{
//     dynamodb.scan(params, function(err,data) {

//       if(err)
//       {
//         console.log("Error", err)
//         rej(err);
//       }
//       else{
//         console.log("Sucess! Scan method fatch all data ")
//         res(JSON.stringify(data, null, 2))    //JSON.stringify(obj,[name,password],2) //3rd parameter is called spaces
//       }
//     });
//   });
//   const result = await getAll;
//   console.log(result);
// }

// exports.getloginHistory();



//query method fatch data from dynamodb
// exports.getloginHistory = async()=>{
//   var id = "2";
//   var loginType ="web";
//   var params ={
//     TableName: 'service-aws-serverless-dev-LoginHistoryDB-15QE8GSNH06H7',
//     KeyConditionExpression: "#id = :id", //primary key
//     ExpressionAttributeNames:{
//       "#id":"id",
//       "#loginType":"loginType"
//     },
//     ExpressionAttributeValues:{
//       ":id":id,
//       ":loginTypeValue":loginType
//     },
//     // FilterExpression:"#loginType = :loginTypeValue",
//     ProjectionExpression:"email",
//     Limit:2,
//     ScanIndexForward: false
//   };

//   let queryExicute = new Promise((res,rej)=>{
//     dynamodb.query(params, function (err,data) {
//       if(err)
//       {
//         console.log("Error",err)
//         rej(err)
//       }
//       else{
//         console.log("Sucess! fatch data in qauey from dyanamodb");
//         res(JSON.stringify(data, null, 2));
//       } 
//     });
//   });

//   let result = await queryExicute;
//   console.log(result);
// }
// exports.getloginHistory();



// Node js (use in exist login History)

//put item 
// const loginHistory =  async()=>
// {
//   var params={
//     TableName: 'service-aws-serverless-dev-LoginHistoryDB-15QE8GSNH06H7',
//     Item:{
//       id:"7",
//       email:"raran123@gmail.com",
//       loginType:"web",
//       status:"false"
//     },
//     // ConditionExpression: 'attribute_not_exists(id)'
//   };

//   let putItem = await dynamodb.put(params).promise();
//     console.log("insert data sucess")
//   return putItem;

//// OR Promise() use...........

//   let putItem  = new Promise((res,rej)=>{

//      dynamodb.put(params, function(err,data){

//     if(err)
//     {
//       console.log(err);
//       rej(err);
//     }
//     else{
//       console.log("sucess");
//       res("Insert data into dynamodb")
//     }
//   });
// });

// const result = await putItem;
// console.log(result);
// }
// exports.loginHistory();



//// insert item in dynamodb
const loginHistory = async () => {
  var params = {
    TableName: 'service-aws-serverless-dev-LoginHistoryDB-15QE8GSNH06H7',
    Item: {
      id: "10",
      email: "demo10@gmail.com",
      loginType: "web",
      status: "false"
    },
    ConditionExpression: 'attribute_not_exists(id)'
  };

  let putItem = await dynamodb.put(params).promise();
  console.log("insert data sucess")
  return putItem;
}


//get item
//this function call to other function...
const getloginHistory = async (id, email) => {
  const params = {
    TableName: 'service-aws-serverless-dev-LoginHistoryDB-15QE8GSNH06H7',
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
  let body = event.body;
  console.log(body, "=======444");
  try {
    var result = await getloginHistory(body["id"], body["email"])

    console.log(result, "...........111");
    // return result
    if (result.Item.id == "10" && result.Item.email == "demo10@gmail.com" && result.Item.status == "true") //change (true, false)
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
  "id": "10",
  "email": "demo10@gmail.com",
  "loginType": "app",
  "status": "true"
}
}

exports.existloginHistory(event);
// exports.existloginHistory();







