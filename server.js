// Create express application
const express = require('express');
const app = express();

// Server connection
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 3000;

//Whenever someone connects this gets executed
io.on('connection', function(socket){
  console.log('A user connected');

  //Whenever someone disconnects this piece of code executed
  socket.on('disconnect', function () {
    console.log('A user disconnected');
  });

});

server.listen(port);

// Get and use package requirements
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.set('view engine', 'pug');
require('dotenv').load();

// Connect database
mongoose.connect(process.env.MONGO_URI);
mongoose.Promise = global.Promise;

// Get and use requirements that reside in application
const routes = require('./app/routes/index.js');
routes(app);
app.set('views', __dirname + '/public');
app.use(express.static('public'));

/* Listen to see if everything is working
app.listen(port, ()=> console.log("yay!"));
*/

app.get(process.env.KEY, (req, res)=> {
  res.json({key: process.env.QUANDL_API_KEY});
});


