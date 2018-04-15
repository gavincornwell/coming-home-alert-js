'use strict';

let index = require('./index.js');

let fs=require('fs');
var event = JSON.parse(fs.readFileSync('sampleEvent.json', 'utf8'));

// run the tests
console.log("Running valid test...");

// TODO: re-factor to use Promises or async.waterfall

// execute the handler
index.handler(event, {}, function(error, result) {
    if (error) {
        console.log("TESTS FAILED: " + error.message);
    } else {

        // check status code
        if (result.statusCode != 202) {
            console.log("TESTS FAILED: Expected status code of 202");
            return;
        }

        // run the invalid userid test
        console.log("Running invalid userId test...");
        var invalidUserIdEvent = JSON.parse(fs.readFileSync('invalidUserIdEvent.json', 'utf8'));
        index.handler(invalidUserIdEvent, {}, function(error, invalidUserIdResult) {
            if (error) {
                console.log("TESTS FAILED: " + error.message);
            } else {
                
                // check status code
                if (invalidUserIdResult.statusCode != 401) {
                    console.log("TESTS FAILED: Expected status code of 401");
                    return;
                }

                // run the missing message test
                console.log("Running missing message test...");
                var missingMessageEvent = JSON.parse(fs.readFileSync('missingMessageEvent.json', 'utf8'));
                index.handler(missingMessageEvent, {}, function(error, missingMessageResult) {
                    if (error) {
                        console.log("TESTS FAILED: " + error.message);
                    } else {

                        // check status code
                        if (missingMessageResult.statusCode != 400) {
                            console.log("TESTS FAILED: Expected status code of 400");
                            return;
                        }

                        console.log("TESTS SUCCESSFUL");
                    }
                });
            }
        });
    }
});