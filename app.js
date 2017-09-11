require('./api/data/db.js');
var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');

var routes = require('./api/routes');

// Define the port to run the application on
app.set('port', 3000);

app.use('/favicon.ico', function() {return;});

// Add logging middleware to log requests
app.use(function(req, res, next) {
  console.log(req.method, req.url);
  next();
});

// Set static directories and favicon trap.
app.use(express.static(path.join(__dirname, 'public')));
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));

// Enable parsing of posted forms
app.use(bodyParser.urlencoded({ extended : false }));
app.use(bodyParser.json());

// Add some routes
app.use('/api', routes);

// Listen for requests
var server = app.listen(app.get('port'), function() {
  var port = server.address().port;
  console.log("Magic happens on port " + port);
});
