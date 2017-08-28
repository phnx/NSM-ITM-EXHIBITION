var MongoClient = require('mongodb').MongoClient;
var database = require('./db');
var db_name = 'nsm-itm-exhibition';
var db_url = 'mongodb://localhost:27017/' + db_name;

var assert = require('assert'); 
var request = require('request');

var state_message = require('./state_message');

var self = module.exports = {

  /*===============================================================*/
  /*               chatbot state controller functions              */
  /*===============================================================*/

  stateControl :function (currentState, params) {
     var nextState = currentState;

     // TO-DO - determine params and make decision to advance / maintain state
     self.stateControl2();


    return nextState;
  },

  stateControl2 :function () {
     console.log('called');
  },

  /*===============================================================*/
  /*                       database functions                      */
  /* https://docs.mongodb.com/manual/mongo/                        */
  /*===============================================================*/

  getUserState: function (userID, callback) {
    var userState = '0';

    MongoClient.connect(db_url, function(err, db) {
      assert.equal(null, err);

      database.getUserState(db, {
        userID : userID
      }, function (docs) {
        if(docs.length > 0 ) {
          //console.log(docs[0]);
          callback(docs[0].stateNumber, docs[0].reportData);
        } else {
          callback(userState, {});
        }
        
      });   
      
    });


  },

  initExhibitMaster: function () {
    
    MongoClient.connect(db_url, function(err, db) {
      assert.equal(null, err);

      database.setExhibitionMaster(db, 
        function (docs) {
          console.log(docs);
          
        });   
      
    });

  },

  getExhibitMaster: function (zone) {
    
    MongoClient.connect(db_url, function(err, db) {
      assert.equal(null, err);

      database.getExhibitMaster(db, 
        zone,
        function (docs) {
          console.log(docs);
          
        });   
      
    });

  },

  insertExhibitReport: function (data, callback) {
    
    MongoClient.connect(db_url, function(err, db) {
      assert.equal(null, err);

      database.insertExhibitReport(db, 
        data,
        function (result) {
          callback(result);
        });   
      
    });

  },

  fillInExhibitionReport: function (id, data, callback) {
    
    MongoClient.connect(db_url, function(err, db) {
      assert.equal(null, err);

      database.fillInExhibitionReport(db, 
        id, data,
        function (result) {
          callback(result);
        });   
      
    });

  },

  recordUserState: function (userID, stateNumber, reportData) {

    MongoClient.connect(db_url, function(err, db) {
      assert.equal(null, err);

      // upsert
      database.getUserState(db, {
        userID : userID
      }, function (docs) {
        
                            if(docs.length == 0) {
                              database.insertUserStateEntry( db,
                                                      { 
                                                        userID : userID,
                                                        stateNumber : stateNumber,
                                                        reportData : {},
                                                        timestamp : new Date(),
                                                      }, function (result) {
                                                        //console.log('inserted');
                                                      }
                                                    );
                            } else {
                              database.updateUserStateEntry( db,
                                                      { 
                                                        userID : userID,
                                                        stateNumber : stateNumber,
                                                        reportData : reportData,
                                                        timestamp : new Date(),
                                                      }, function (result) {
                                                        //console.log('update');
                                                      }
                                                    );
                            }
        
      });   
      

    });

  },

  /*===============================================================*/
  /*               chatbot message functions		                 */
  /*===============================================================*/


  receivedMessage: function (event) {
    console.log(event);
    var senderID = event.sender.id;
    var recipientID = event.recipient.id;
    var timeOfMessage = event.timestamp;
    var message = event.message;

    //console.log("Received message for user %d and page %d at %d with message:", senderID, recipientID, timeOfMessage);
    //console.log(JSON.stringify(message));

    var messageId = message.mid;
    var messageText = message.text;
    var messageAttachments = message.attachments;

    if (messageText) {
      var state_response_message = '';
      var validated_answer = ''

      self.getUserState(senderID, function (currentState, reportData) {
        console.log('current-state :'+currentState);
        console.log('current-reportData :'+reportData);
        
        if(currentState == '0' && messageText == 'hello'){
          self.recordUserState(senderID, '1', {});   // beginning of state

          state_response_message = state_message['state_1']();  // first time sending out the list

          // send response message
          //self.sendTextMessage(senderID, state_response_message);
          console.log(state_response_message);

        }

        if(currentState == '1'){                // getting message while in state 1
            
          validated_answer = state_message['state_1'](messageText);   // check if answer is expected by previous question
          if( validated_answer != false ) {              
            
            // appending data
            reportData.zone = messageText;

            self.recordUserState(senderID, '2', reportData);

            state_response_message = state_message['state_2'](['1 - Exhibit 1', '2 - Exhibit 2', '3 - Exhibit 3', '4 - Exhibit 4']);

            // send response message
            //self.sendTextMessage(senderID, state_response_message);
            console.log(state_response_message);

          } else {
            
            state_response_message = state_message['state_1'](); 

            // resend response message
            //self.sendTextMessage(senderID, state_response_message);
            console.log(state_response_message);
          }
         

        } 

        if(currentState == '2'){                // getting message while in state 2
            
          validated_answer = state_message['state_2'](null, messageText);   // check if answer is expected by previous question
          if( validated_answer != false ) {              
            
            // appending data
            reportData.exhibit_zone_code = messageText;

            self.recordUserState(senderID, '3', reportData);

            state_response_message = state_message['state_3']();

            // send response message
            //self.sendTextMessage(senderID, state_response_message);
            console.log(state_response_message);

          }  else {
            
            state_response_message = state_message['state_2'](['1 - Exhibit 1', '2 - Exhibit 2', '3 - Exhibit 3', '4 - Exhibit 4']); 

            // resend response message
            //self.sendTextMessage(senderID, state_response_message);
            console.log(state_response_message);
          }
         
        } 
        if(currentState == '3'){                // getting message while in state 3
            
          validated_answer = state_message['state_3'](null, messageText);   // check if answer is expected by previous question
          if( validated_answer != false ) {              
            
            // appending data
            reportData.detail = messageText;

            self.recordUserState(senderID, '4', reportData);

            state_response_message = state_message['state_4']();

            // send response message
            //self.sendTextMessage(senderID, state_response_message);
            console.log(state_response_message);

          } else {
            
            state_response_message = state_message['state_3'](); 

            // resend response message
            //self.sendTextMessage(senderID, state_response_message);
            console.log(state_response_message);
          }
         
        } 
        if(currentState == '4'){                // getting message while in state 4
            
          validated_answer = state_message['state_4'](messageText);   // check if answer is expected by previous question
          if( validated_answer != false ) {              
            
            // appending data
            reportData.solution = messageText;

            self.recordUserState(senderID, '5', reportData);

            state_response_message = state_message['state_5']();

            // send response message
            //self.sendTextMessage(senderID, state_response_message);
            console.log(state_response_message);

          } else {
            
            state_response_message = state_message['state_4'](); 

            // resend response message
            //self.sendTextMessage(senderID, state_response_message);
            console.log(state_response_message);
          }
         
        } 
        if(currentState == '5'){                // getting message while in state 5
            
          validated_answer = state_message['state_5'](messageText);   // check if answer is expected by previous question
          if( validated_answer != false ) {              
            
            // appending data
            reportData.responsible_person = messageText;

            self.recordUserState(senderID, '6', reportData);

            state_response_message = state_message['state_6']();

            // send response message
            //self.sendTextMessage(senderID, state_response_message);
            console.log(state_response_message);

          } else {
            
            state_response_message = state_message['state_5'](); 

            // resend response message
            //self.sendTextMessage(senderID, state_response_message);
            console.log(state_response_message);
          }
         
        } 
        if(currentState == '6'){                // getting message while in state 6
            
          validated_answer = state_message['state_6'](messageText);   // check if answer is expected by previous question
          if( validated_answer != false ) {              
            
            if (messageText == 'Y') {
              // appending data
              reportData.confirm = 1;
              self.recordUserState(senderID, '7', reportData);      // record report
              state_response_message = state_message['state_7']();
  
              self.insertExhibitReport(
                  {
                    zone: reportData.zone,
                      exhibit_zone_code: reportData.exhibit_zone_code,
                      detail: reportData.detail,
                      solution: reportData.solution,
                      responsible_person: reportData.responsible_person

                  }, function (result) {
                    //console.log(result);
                    var exhibit_report_id = result.insertedId;
                    console.log(exhibit_report_id); // for later update
                    
                  }

                );


              // send response message
              //self.sendTextMessage(senderID, state_response_message);
              console.log(state_response_message);

            } else {
              // back to state 1
              self.recordUserState(senderID, '1', {});   // beginning of state
              state_response_message = state_message['state_1']();  // first time sending out the list
            }

          } else {
            
            state_response_message = state_message['state_6'](); 

            // resend response message
            //self.sendTextMessage(senderID, state_response_message);
            console.log(state_response_message);
          }
         
        } 
        if(currentState == '7'){                // getting message while in state 7
            
          validated_answer = state_message['state_7'](messageText);   // check if answer is expected by previous question
          if( validated_answer != false ) {              
            
            // reset state
            // TO-DO reset state when user not active for 1 hour
            self.recordUserState(senderID, '0', {});

            state_response_message = 'ok done';

            // send response message
            //self.sendTextMessage(senderID, state_response_message);
            console.log(state_response_message);

          } else {
            
            state_response_message = state_message['state_7'](); 

            // resend response message
            //self.sendTextMessage(senderID, state_response_message);
            console.log(state_response_message);
          }
         
        } 


      });

      
    }// else if (messageAttachments) {
      //sendTextMessage(senderID, "Message with attachment received");
    //}
      
  },

  sendTextMessage: function (recipientId, messageText) {
    var messageData = {
      recipient: {
        id: recipientId
      },
      message: {
        text: messageText
      }
    };

    self.callSendAPI(messageData);
  },

  callSendAPI: function (messageData) {
    request({
      uri: 'https://graph.facebook.com/v2.6/me/messages',
      qs: { access_token: 'not here' },
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
  },

}