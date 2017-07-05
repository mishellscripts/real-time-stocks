// Create express application
const express = require('express');
const app = express();

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

// Listen to see if everything is working
app.listen(process.env.PORT || 3000, ()=> {
    console.log("yay!");
})


