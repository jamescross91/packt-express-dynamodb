const express = require('express');
const app = express();
const aws = require('aws-sdk');
const table = 'my-users-table';

aws.config.update({
    region: "eu-west-1"
});

var docClient = new aws.DynamoDB.DocumentClient();

app.get('/emails/:email', function (req, res) {
    let email_address = req.params['email'];

    var params = {
        TableName: table,
        KeyConditionExpression: 'email_address = :email_address',
        ExpressionAttributeValues: {
            ":email_address": email_address
        }
    }

    docClient.query(params, function(err, data) {
        if (err) {
            console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
        } else {
            console.log("Query succeeded.");
            res.send(data.Items)
        }
    });
})

app.get('/users/:username', function (req, res) {
    let username = req.params['username'];

    var params = {
        TableName: table,
        IndexName: 'username-index',
        KeyConditionExpression: 'username = :username',
        ExpressionAttributeValues: {
            ":username": username
        }
    }

    docClient.query(params, function(err, data) {
        if (err) {
            console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
        } else {
            console.log("Query succeeded.");
            res.send(data.Items)
        }
    });
})

let server = app.listen(8081, function () {
   let host = server.address().address
   let port = server.address().port
   
   console.log("Example app listening at http://%s:%s", host, port)
})
