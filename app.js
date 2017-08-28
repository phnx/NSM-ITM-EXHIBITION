var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
// static path declaration
app.use("/assets", express.static(__dirname + '/assets'));


require('./app/route')(app);


/*===============================================================*/
/*               server initialization functions                 */
/*===============================================================*/

// initialize server
app.listen(4000, function () {
  console.log('Start listening on port 4000')
})

