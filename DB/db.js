'use strict';

console.log('Loading function');

const doc = require('dynamodb-doc');

const dynamo = new doc.DynamoDB();

/**
 * Demonstrates a simple HTTP endpoint using API Gateway. You have full
 * access to the request and response payload, including headers and
 * status code.
 *
 * To scan a DynamoDB table, make a GET request with the TableName as a
 * query string parameter. To put, update, or delete an item, make a POST,
 * PUT, or DELETE request respectively, passing in the payload to the
 * DynamoDB API as a JSON body.
 */
exports.handler = (event, context, callback) => {
    //console.log('Received event:', JSON.stringify(event, null, 2));

    const done = (err, res) => callback(null, {
        statusCode: err ? '400' : '200',
        body: err ? err.message : JSON.stringify(res),
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin" : "*",
            "Access-Control-Allow-Headers": "x-requested-with",
            "Access-Control-Allow-Credentials" : true
        },
    });
    
    switch (event.httpMethod) {
        case 'DELETE':
            dynamo.deleteItem(JSON.parse(event.body), done);
            break;
        case 'GET':
            var tableName = event.queryStringParameters.TableName;
            console.log(event.queryStringParameters.RecipeName);
            var name = event.queryStringParameters.RecipeName;
            if(name) {
                getRecipe(done, name);
            } else {
                dynamo.scan({TableName: tableName}, done);
            }
            break;
        case 'POST':
            var dbObject = JSON.parse(event.body);
            var trimmedName = dbObject.Item.RecipeName.trim();
            dbObject.Item.RecipeName = trimmedName;
            dynamo.putItem(dbObject, done);
            break;
        case 'PUT':
            dynamo.updateItem(JSON.parse(event.body), done);
            break;
        default:
            done(new Error(`Unsupported method "${event.httpMethod}"`));
    }
};

var getRecipe = function(callback, recipeName) {
    recipeName = recipeName.toLowerCase();
    
    var params = {
            TableName: "Recipes",
            KeyConditionExpression: "#name = :name",
            ExpressionAttributeNames:{
                "#name": "RecipeName"
            },
            ExpressionAttributeValues: {
                ":name":recipeName
            }
        };
    dynamo.query(params, callback);
};


