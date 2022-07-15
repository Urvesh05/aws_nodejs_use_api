'use strict'
const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });
const dynamodbTableName = 'DynamoDB_Rest_API3';
 
 
function sendResponse(statusCode, message) {
   return {
       statusCode: statusCode,
       body: JSON.stringify(message)
   };
 
}

exports.postData = async (event,context, callback) =>{
    console.log(event,"...............")
    const datetime = new Date().toDateString();
    const data = JSON.parse(event.body);

        if(!data.id)
            {
            return callback(null, sendResponse(400, {error:' id must '}));
            }

            const params = {
                TableName:dynamodbTableName,

                Item:{
                    id:data.id,
                    // Item:data,
                    createdAt: datetime,
                    updatedAr: datetime,
                    firstName: data.firstName,
                    lastName: data.lastName
                }
            };
            
          return await dynamodb.put(params).promise().then(()=>{

            const body = {
                Opration: 'SAVE',
                Message: 'Success',
                Item: data
          
              };
          
              return sendResponse(200, body);
          
            }, (error) => {
              console.error('  Data is a Not Inserted..! ', error);
            });     
}



// exports.getData = async (event, context, callback) =>{
//     console.log(event,'..............');

//     const params = {
//         TableName:dynamodbTableName,
        
//     }

//     return await dynamodb.scan(params).promise().then((res)=>{
//         callback(null, sendResponse(200,res))
//     }).catch(error=>callback(null, sendResponse(error.statusCode,error)))

// }


exports.getData = async (event, context, callback) =>{
    console.log(event,'..............');

    try {
        const params = {
            TableName:dynamodbTableName,
            KeyConditionExpression:':id = :id',
            ExpressionAttributeValues:{
                ':id':'2'
            },
            // ExpressionAttributeNames:{
            //     '#id': 'id'
            // },
        }
    
        return await dynamodb.query(params).promise().then((res)=>{
            callback(null, sendResponse(200,res))
        }).catch(error=>callback(null, sendResponse(error.statusCode,error)))

        
    } catch (error) {
        console.log(error)
    }
}


exports.updateData = async (event, context, callback)=>{
    console.log(event,'...........');

    const data = JSON.parse( event.body);
    const params = {
        TableName:dynamodbTableName,
        Key: {
            id:data.id,
        },
        UpdateExpression: 'SET #firstName = :f, #lastName = :l',
            ExpressionAttributeNames:{
                '#firstName':'firstName',
                '#lastName':'lastName'
            },
            ExpressionAttributeValues: {
                ':f': data.firstName,
                ':l': data.lastName 
    },
        ReturnValues: 'UPDATED_NEW'
    }
    return await dynamodb.update(params).promise().then((res)=>{
        const body = {
            Opration: 'Update',
            Message: 'Success',
            UpdatedAttributes:res
        }
        return sendResponse(200,body)
    },(error)=>{
        console.error(' Data is a Not Updated..! ', error);
    })
}



exports.deleteData = async(event,context, callback)=>{
   console.log(event,"..........");
   const data = JSON.parse(event.body);
   const params = {
        TableName:dynamodbTableName,
        Key:{
            id:data.id
        },
        ReturnValues: 'ALL_OLD'
   };
   return await dynamodb.delete(params).promise().then((res)=>{
      const body={
        Opration: 'Delete',
        Message: 'Success',
        Item: res
      }
      return sendResponse(200,body);
   }, (error)=>{
        console.error("data is not deleted", error)
   })
}

