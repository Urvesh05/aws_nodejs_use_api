'use strict';

const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();
const dbTableName = 'LoginHistoryDB';

//custom message
function sendResponse(statusCode, message) {
  return {
    statusCode: statusCode,
    body: JSON.stringify(message)
  }
}


// Save Item 
module.exports.loginHistory = async (event, context, callback) => {
  console.log(event, '................');

  const requestBody = JSON.parse(event.body);
  const datetime = new Date().toDateString();

  if (!requestBody.id || !requestBody.email || !requestBody.username) {
    return sendResponse(400, { message: 'id must reqiured !, email must reqiured !, username must reqiured !' });
  }
  else if (typeof requestBody.id !== 'string') {
    return callback(null, sendResponse(400, { error: 'id must be string' }));
  }

  try {
    const params = {
      TableName: dbTableName,
      Item: {
        id: requestBody.id,
        email: requestBody.email,
        deviceId: requestBody.deviceId,
        username: requestBody.username,
        loginType: requestBody.loginType,
        createdAt: datetime,

      },
      ConditionExpression: 'attribute_not_exists(id)'
    }

    return await dynamodb.put(params).promise().then(() => {
      console.log("inserted...")
      callback(null, sendResponse(200, { message: 'data inserted successfully' }))

    }).catch((err) => {
      console.log(err);

      if (err.code === "ConditionalCheckFailedException") {
        console.log("id Already exists");

        const body = {
          message: ("id Already exists")
        }
        return sendResponse(200, body);
      }

      else if (err) console.log("Insert Failed with some other reason", err);

      else console.log("Sucessfully inserted");
    });

  } catch (error) {
    console.log(error);
  }
};


//list Item
module.exports.listloginHistory = async (event, context, callback) => {
  console.log(event, "........");

  try {
    const params = {
      TableName: dbTableName,
      Key: {
        id: event.id,
      }

    }
    return await dynamodb.scan(params).promise().then((result) => {
      callback(null, sendResponse(200, result))

    }).catch(error => {
      console.log(error)
    })

  } catch (error) {
    console.loh(error)
  }
}


// get Item
module.exports.getloginHistory = async (event, context, callback) => {
  console.log(event, '.......');

  try {
    const params = {
      TableName: dbTableName,
      Key: {
        id: event.pathParameters.id,
      },
    }
    return await dynamodb.get(params).promise().then((result) => {
      callback(null, sendResponse(200, result))

    }).catch(error => {
      console.log(error)

    })
  } catch (error) {
    console.log(error)
  }
}



//Alredy exist Login

exports.existloginHistory = async (event, context, callback) => {
  console.log(event, "..........")
  const requestBody = JSON.parse(event.body);

  try {
    const params = {
      TableName: dbTableName,
      Item: {
        id: requestBody.id,
        email: requestBody.email,
        loginType: requestBody.loginType

      },
      ConditionExpression: 'attribute_not_exists(loginType)'
    }

    return await dynamodb.put(params).promise().then(() => {

      callback(null, sendResponse(200, { message: 'login Sucess' }))
    }).catch(err => {
      console.log(err, "email alredy login");

      if (requestBody.loginType == "app") {
        console.log(" Your are Already login this device ");

        const body = {
          message: (" Your are Already login this device ")
        }
        return sendResponse(200, body);
      }
      else if (err.code === "ConditionalCheckFailedException") {
        console.log(" Your are Already login other device please logout and try again ");

        const body = {
          message: ("Your are Already login other device please logout and try again ")
        }
        return sendResponse(200, body);
      }
    })
  } catch (error) {
    console.log(error, '...........');
  }
}
