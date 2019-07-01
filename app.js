//load express to control our web api 
const express = require('express');
const app = express();

//load bodyParser to handle our json body
const bodyParser = require('body-parser');

//setup bodyparser to allow to json body parsing
app.use(bodyParser.json());

//even though this is a small task and there is only a single route
//this file will hold our routes if we wanted to expand our web service
const router = require('./routes/routes');

//point to our router file
app.use(router);

//launch our server
app.listen(8080);