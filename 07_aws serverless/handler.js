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

//   const requestBody = JSON.parse(event.body);
//   const datetime = new Date().toDateString();

//   if (!requestBody.id || !requestBody.email || !requestBody.username) {
//     return sendResponse(400, { message: 'id must reqiured !, email must reqiured !, username must reqiured !' });
//   }
//   else if (typeof requestBody.id !== 'string') {
//     return callback(null, sendResponse(400, { error: 'id must be string' }));
//   }

//   try {
//     const params = {
//       TableName: dbTableName,
//       Item: {
//         id: requestBody.id,
//         email: requestBody.email,
//         deviceId: requestBody.deviceId,
//         username: requestBody.username,
//         loginType: requestBody.loginType,
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
//   const requestBody = JSON.parse(event.body);

//   try {
//     requestBody['createdAt'] = new Date().getTime;
//     const params = {
//       TableName: dbTableName,
//       Item: {
//         id: requestBody.id,
//         email: requestBody.email,
//         loginType: requestBody.loginType

//       },
//       ConditionExpression: 'attribute_not_exists(loginType)'
//     }

//     return await dynamodb.put(params).promise().then(() => {

//       callback(null, sendResponse(200, { message: 'login Sucess' }))
//     }).catch(err => {
//       console.log(err, "email alredy login");

//       if (requestBody.loginType == "app") {
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
const error = require('./error');
const { ErrorAndSucessMessage, sendResponse } = require('./error')
const dynamodb = new AWS.DynamoDB.DocumentClient({ region: process.env.Aws_Region });
const login_History = process.env.LoginHistoryDBTable;

// const AmazonCognitoIdentity

// Save Data 
module.exports.loginHistory = async (event, context, callback) => {
  const reqBody = JSON.parse(event.body);
  if (!reqBody.id || !reqBody.email || !reqBody.username) {
    return sendResponse(await (ErrorAndSucessMessage()).loginRequrid, false, 400);
  }

  requestBody["createdAt"] = new Date().getTime;
  let params = {
    TableName: login_History,
    Item: reqBody,

    ConditionExpression: 'attribute_not_exists(id)'
  };
  try {
    var res = await dynamodb.put(params).promise();
    var result = sendResponse(await (ErrorAndSucessMessage()).insertmsg, true, 200)
    return result

  } catch (err) {
    if (err.code === "ConditionalCheckFailedException") {
      var result = sendResponse(await (ErrorAndSucessMessage()).exists, true, 200)
      return result
    }
    return res
  }
};


//list Item
module.exports.listloginHistory = async (event, context, callback) => {
  const params = {
    TableName: login_History,
    Key: {
      id: event.id,
    }
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

//Alredy exist Login

module.exports.existloginHistory = async (event, context, callback) => {
  const reqBody = JSON.parse(event.body);

  try {
    const params = {
      TableName: login_History,
      Item: {
        id: reqBody.id,
        email: reqBody.email,
        loginType: reqBody.loginType,
      },
      ConditionExpression: 'attribute_not_exists(loginType)'
    };
    try {
      var res = await dynamodb.put(params).promise();
      var result = sendResponse(await (ErrorAndSucessMessage()).loginsucess, true, 200);
      return result;

    } catch (err) {
      if (reqBody.loginType == "app" || reqBody.loginType == "web") {
        var result1 = sendResponse(await (ErrorAndSucessMessage()).alredyLogin, true, 200);
        return result1;
      }
      else if (err.code === "ConditionalCheckFailedException") {
        var result3 = sendResponse(await (ErrorAndSucessMessage()).otherDevicelogin, true, 200);
        return result3;
      }
      return res;
    }
  } catch (error) {
    console.log(error);
  }
};





'use strict';
const AWS = require('aws-sdk');
// const { ErrorAndSucessMessage, sendResponse } = require('./error')
const dynamodb = new AWS.DynamoDB.DocumentClient({ region: "us-east-1" });


// exports.getloginHistory();


const getloginHistory = async (id, email) => {
  const params = {
    TableName:'service-aws-serverless-dev-LoginHistoryDB-15QE8GSNH06H7',
    Key: {
      "id": id,
      "email": email
    }
  };
  try {
    var res = await dynamodb.get(params).promise();
    console.log(res, ".........")
    return res
  } catch (err) {
    console.log(err)
    return false;
  }

};

// exports.getloginHistory();

// // already exist
exports.existloginHistory = async (event) => {
  // let body = event.body;
  // let body = JSON.parse(event.body);
  const body = require('body-parser');

  if (!body["id"] || !body["email"]) {
    console.log("ttttte") ;
    // return 
  }

  try {
    var result = await getloginHistory(body["id"],body["email"])
  if (result.Items.loginType == "app" && result.Items.status == "true") {
    console.log(result,"your alredy login")
    return result   
}

else if (result.Items.loginType == "app" && result.Items.status == "false") {
  console.log(result,"Your first logout and try agian login")
}
// else(result.Items.loginType == "app" && result.Items.status == "false")
// {
//   console.log(result,"some other problem")
// }
  
} catch (error) {
  console.log(error);
}

// var result = await getloginHistory("1","test123@gmail.com")
// return result;

}

exports.existloginHistory();







