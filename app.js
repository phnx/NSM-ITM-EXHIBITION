const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const path = require('path');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));



app.get('/', function(req, res) {
	console.log(req);
	res.status(200).send('test site');
});


/*===============================================================*/
/*                     chatbot endpoints			             */
/*===============================================================*/

app.get('/chatbot-endpoint', function (req, res) {
  if (req.query['hub.mode'] === 'subscribe' &&
      req.query['hub.verify_token'] === 'correct_token') {
    console.log("Validating webhook");
    res.status(200).send(req.query['hub.challenge']);
  } else {
    console.error("Failed validation. Make sure the validation tokens match.");
    res.sendStatus(403);          
  }  
});

app.post('/chatbot-endpoint', function (req, res) {
  var data = req.body;
  console.log(req.body);

  // Make sure this is a page subscription
  if (data.object === 'page') {

    // Iterate over each entry - there may be multiple if batched
    data.entry.forEach(function(entry) {
      var pageID = entry.id;
      var timeOfEvent = entry.time;

      // Iterate over each messaging event
      entry.messaging.forEach(function(event) {
        if (event.message) {
          receivedMessage(event);
        } else {
          console.log("Webhook received unknown event: ", event);
        }
      });
    });

    // Assume all went well.
    //
    // You must send back a 200, within 20 seconds, to let us know
    // you've successfully received the callback. Otherwise, the request
    // will time out and we will keep trying to resend.
    res.sendStatus(200);
  }
});
  

/*===============================================================*/
/*               chatbot message functions		                 */
/*===============================================================*/


function receivedMessage(event) {
  // Putting a stub for now, we'll expand it in the following steps
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var timeOfMessage = event.timestamp;
  var message = event.message;

  console.log("Received message for user %d and page %d at %d with message:", senderID, recipientID, timeOfMessage);
  console.log(JSON.stringify(message));

  var messageId = message.mid;

  var messageText = message.text;
  var messageAttachments = message.attachments;

  if (messageText) {

    // keywords switching
    switch (messageText) {
      case 'hello':
        sendZoneList(senderID);
        break;
	
      default:
        sendTextMessage(senderID, messageText);
    }
  } else if (messageAttachments) {
    sendTextMessage(senderID, "Message with attachment received");
  }

}

function sendZoneList(recipientId) {
	var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: 'please choose a zone : a, b, c, d, e, f'
    }
  };

  callSendAPI(messageData);
}

function sendTextMessage(recipientId, messageText) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: messageText
    }
  };

  callSendAPI(messageData);
}

function callSendAPI(messageData) {
  request({
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: 'not what you want to see - I\'ve also regenerated the one in previous revision' },
    method: 'POST',
    json: messageData

  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var recipientId = body.recipient_id;
      var messageId = body.message_id;

      console.log("Successfully sent generic message with id %s to recipient %s", 
        messageId, recipientId);
    } else {
      console.error("Unable to send message.");
      console.error(response);
      console.error(error);
    }
  });  
}

/*===============================================================*/
/*               server initialization functions                 */
/*===============================================================*/

// initialize server
app.listen(4000, function () {
  console.log('Start listening on port 4000')
})

