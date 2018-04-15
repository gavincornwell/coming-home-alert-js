'use strict';

const AWS = require('aws-sdk');
AWS.config.update({
    region: process.env.AWS_REGION
});

var sns = new AWS.SNS();

exports.handler = (event, context, callback) => {

    console.log("Received event: " + JSON.stringify(event, null, 2));
    
    // grab the valid used id from env variable
    var validUserId = process.env.VALID_USER_ID;
    console.log("VALID_USER_ID = " + validUserId);
    if (!validUserId || validUserId.length == 0)
    {
        callback(null, exports.buildProxyErrorResponseObject(Error("VALID_USER_ID environment variable is required"), 400));
        return;
    }

    // get userid from the path parameters and check against VALID_USER_ID
    var userId = event.pathParameters.userId;
    console.log("userId = " + userId);
    if (!userId || userId.length == 0)
    {
        callback(null, exports.buildProxyErrorResponseObject(Error("userId in URL path is required"), 400));
        return;
    }
    else if (validUserId !== userId)
    {
        callback(null, exports.buildProxyErrorResponseObject(Error("Provided user ID is not valid"), 401));
        return;
    }

    // grab the topic ARN from env variable
    var topicArn = process.env.TOPIC_ARN;
    console.log("TOPIC_ARN = " + topicArn);
    if (!topicArn || topicArn.length == 0)
    {
        callback(null, exports.buildProxyErrorResponseObject(Error("TOPIC_ARN environment variable is required"), 400));
        return;
    }

    // extract message from request body
    var body = JSON.parse(event.body);
    var message = body.message;
    if (!message || message.length == 0)
    {
        callback(null, exports.buildProxyErrorResponseObject(Error("message property in request body is required"), 400));
        return;
    }

    // publish a message to the topic to get notifications sent
    var publishParams = {
        Message: message,
        TopicArn: topicArn
    };

    console.log("Sending message: " + message);

    sns.publish(publishParams, function(error, data) {
        if (error)
        {
            callback(null, exports.buildProxyErrorResponseObject(error));
        }
        else
        {
            var messageId = data.MessageId;
            console.log("Published message with id :" + messageId);

            var result = { messageId: messageId };
            var response = exports.buildProxyResponseObject(result, 202);

            callback(null, response);
        }
    });
};

/**
 * Constructs a response object API Gateway expects when using lambda proxy mode.
 */
exports.buildProxyResponseObject = function(result, statusCode, headers) {

    console.log("Constructing proxy response object...");
  
    if (!statusCode) {
      statusCode = 200;
    }
  
    // construct the object API gateway expects
    var response = {
      statusCode: statusCode,
      body: JSON.stringify(result)
    };
  
    if (!headers) {
      response.headers = headers;
    }
  
    console.log("Returning result: " + JSON.stringify(response, null, 2));
  
    return response;
  };

/**
 * Constructs an error response object API Gateway expects when using lambda proxy mode.
 */
exports.buildProxyErrorResponseObject = function(error, statusCode) {
    if (!statusCode) {
        statusCode = 500;
    }

    var result = { error: error.message };
    return exports.buildProxyResponseObject(result, statusCode);
};