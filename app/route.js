var func = require('./function');
var assert = require('assert');


var database = require('./db');
var MongoClient = require('mongodb').MongoClient;
var db_name = 'nsm-itm-exhibition';
var db_url = 'mongodb://localhost:27017/' + db_name;

var state_message = require('./state_message');

module.exports = function (app) {

	app.get('/', function (req, res) {
		func.stateControl({},{});
  		return res.status(200).send('test site ');	

	});

	/*===============================================================*/
	/*                     testing endpoints			             */
	/*===============================================================*/

	app.get('/init-exhibit-master', function (req, res) {
		func.initExhibitMaster();
  		return res.status(200).send('init exhibit master ');	

	});

	app.get('/get-exhibit-master', function (req, res) {
		func.getExhibitMaster('A');
  		return res.status(200).send('get exhibit master ');	

	});

	app.get('/insert-exhibit-report', function (req, res) {

		func.insertExhibitReport(
									{
										zone: 'A',
								    	exhibit_zone_code: '1',
								    	detail: 'A usual damage A usual damage A usual damage A usual damage A usual damage A usual damage A usual damage ',
								    	solution: 'A usual solution A usual solution A usual solution A usual solution A usual solution A usual solution ',
								    	responsible_person: 'A responsible person'

									}, function (result) {
										//console.log(result);
										var exhibit_report_id = result.insertedId;
										console.log(exhibit_report_id);	// for later update
										
									}

								);
  		return res.status(200).send('insert exhibit report ');	

	});

	app.get('/test-func', function (req, res) {
		var userid = req.query.userid;  
		/*recordUserState(1234, 1);
		recordUserState(1234, 2);
		recordUserState(1234, 3);*/

		func.getUserState(userid, function(resp) {
			console.log(userid  +' is in state ' + resp);
		});

	  	return res.status(200).send('ok');	
	});

	app.get('/test-advancing-state', function (req, res) {
		
	  var userid = req.query.userid;  
	  var newstate = req.query.newstate; 

      func.recordUserState(userid, newstate);

      return res.status(200).send('ok');
	  
	});

	app.get('/test-message', function (req, res) {
		console.log(state_message[1]('B'));
		return res.status(200).send('ok');
	});

	app.get('/test-state', function (req, res) {
		var ex_event = {};
		var messageText = req.query['messageText'];

		ex_event.sender = {};
		ex_event.sender.id = 'test_sender_id4';

    	ex_event.recipient = {};
    	ex_event.recipient.id = '';

    	ex_event.timestamp = '';
    	ex_event.message = {};
    	ex_event.message.mid = '';
    	ex_event.message.text = messageText;
    	ex_event.message.attachments = '';

    	func.receivedMessage(ex_event);
    	return res.status(200).send('ok');
	});


	/*===============================================================*/
	/*                     chatbot endpoints			             */
	/*===============================================================*/

	// verification 
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

	// receiver 
	app.post('/chatbot-endpoint', function (req, res) {
	  var data = req.body;

	  // Make sure this is a page subscription
	  if (data.object === 'page') {

	    // Iterate over each entry - there may be multiple if batched
	    data.entry.forEach(function(entry) {
	      var pageID = entry.id;
	      var timeOfEvent = entry.time;

	      // Iterate over each messaging event
	      entry.messaging.forEach(function(event) {
	        if (event.message) {

	          var senderID = func.receivedMessage(event);
	          
	        } else {
	          console.log("Webhook received unknown event: ", event);

	        }
	      });
	    });

	    res.sendStatus(200);
	  }
	});




};