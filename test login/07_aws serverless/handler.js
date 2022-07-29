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



// cognito userpool link:

// https://test-user-pool-111.auth.us-east-1.amazoncognito.com/login?response_type=code&client_id=5ak7puu13hm1mr1ijqmnf6a5nd&redirect_uri=https://www.google.com


'use strict';
const AWS = require('aws-sdk');
const { ErrorAndSucessMessage, sendResponse } = require('./error')
const dynamodb = new AWS.DynamoDB.DocumentClient({ region: process.env.Aws_Region });
const login_History = process.env.LoginHistoryDBTable;

// Save Data 
module.exports.loginHistory = async (event, context, callback) => {
  let body = JSON.parse(event["body"]);
  if (!body['id'] || !body['email']) {
    return sendResponse((await ErrorAndSucessMessage()).loginRequrid, 400);
  }
  body["createdAt"] = `${Math.round((Date.now() / 1000))}`
  let params = {
    TableName: login_History,
    Item: body,
    ConditionExpression: 'attribute_not_exists(id)'
  };
  try {
    var res = await dynamodb.put(params).promise();
    var result = sendResponse((await ErrorAndSucessMessage()).insertmsg, 200)
    return result

  } catch (err) {
    if (err.code === "ConditionalCheckFailedException") {
      var result = sendResponse((await ErrorAndSucessMessage()).exists, 400)
      return result
    }
  }
  return res
};


//list Item
module.exports.listloginHistory = async (event, context, callback) => {
  const params = {
    TableName: login_History
  };
  var res = await dynamodb.scan(params).promise();
  console.log(res)
  return {
    body: JSON.stringify(res.Items),
    statusCode: 200
  }
}

// get Item
module.exports.getloginHistory = async (event, context, callback) => {
  const params = {
    TableName: login_History,
    Key: {
      id: event.pathParameters.id,
    },
  };
  var res = await dynamodb.get(params).promise();
  console.log(res);

  return {
    body: JSON.stringify(res.Item),
    statusCode: 200
  }
};


/// Alredy exist Login

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




// module.exports.existloginHistory = async (event, context, callback) => {
//   const body = JSON.parse(event.body);

//   const params = {
//     TableName: login_History,
//     Item: {
//             id: body.id,
//             email: body.email,
//             loginType: body.loginType,
//           },

//     // FilterExpression: '#loginType =:loginType',
//     ExpressionAttributeNames: { '#loginType': 'loginType' },
//     ExpressionAttributeValues: { ':loginType': 'app' },
    
//   };
  
//     var res = await dynamodb.post(params).promise();
//     // var result = sendResponse((await ErrorAndSucessMessage()).loginsucess, 200)
//     console.log(res,"...........");
//     // return {body: JSON.stringify(res.Items)}

  
//     if (params.loginType == "app") {
//       var result1 = sendResponse((await ErrorAndSucessMessage()).alredyLogin, 400);
//       return result1;
//     }
//     else if (params.loginType == "web") {
//       var result = sendResponse((await ErrorAndSucessMessage()).otherDevicelogin, 400)
//       return result
//     }
//     // else if (err.code === "ConditionalCheckFailedException") {
//     //   var result = sendResponse((await ErrorAndSucessMessage()).otherDevicelogin, 400)
//     //   return result
//     // }

//   return res
// };



module.exports.existloginHistory = async (event, context, callback) => {
  const body = JSON.parse(event.body);

  const params = {
    TableName: login_History,
    Item: {
      id: body.id,
      email: body.email,
      loginType: body.loginType,
    },
    ConditionExpression: 'attribute_not_exists(loginType)'
  };
  try {
    var res = await dynamodb.put(params).promise();
    var result = sendResponse((await ErrorAndSucessMessage()).loginsucess, 200)
    return result

  } catch (err) {
    if (body.loginType == "app" ) {
      var result1 = sendResponse((await ErrorAndSucessMessage()).alredyLogin, 400);
      return result1;
    }

   else if (body.loginType == "web" ) {
      var result1 = sendResponse((await ErrorAndSucessMessage()).alredyLogin, 400);
      return result1;
    }

    else if (err.code === "ConditionalCheckFailedException") {
      var result = sendResponse((await ErrorAndSucessMessage()).otherDevicelogin, 400)
      return result
    }
  }
  return res
};
