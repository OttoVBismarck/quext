// Module reqs
require('dotenv').load();
const http = require('http');
const express = require('express');
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
// Get express ready
const app = express();
// Add Schema
const Schema = mongoose.Schema;

const MessageRecordSchema = mongoose.model('Message', {
    From: String,
    TimeStamp: Date,
    Body: String
});
// get mongoose set up
mongoose.connect('mongodb://'+ process.env.UN +":" + process.env.PW + '@ds157089.mlab.com:57089/quext');
mongoose.Promise = global.Promise;
//gets default connection
const db = mongoose.connection;

//bind connection
db.on('error', console.error.bind(console, 'mongoDB connection error:'));

app.use(bodyParser.urlencoded({extended:false}));

app.post('/', (req, res) => {
  const twiml = new MessagingResponse();
  const message = new MessageRecordSchema({ From: req.body.From, Body: req.body.Body})
  message.save().then(() => console.log(req.body.Body))
  twiml.message('This app works!');
  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
});

http.createServer(app).listen(1337, () => {
  console.log('Express server listening on port 1337');
});
