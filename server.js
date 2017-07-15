// Create express application
const express = require('express');
const app = express();

// Server connection
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 3000;
const Company = require('./app/models/companies.js');

//Whenever someone connects this gets executed
io.on('connection', socket=>{
    console.log('A user connected');

    socket.emit('key', process.env.QUANDL_API_KEY);

    socket.on('addCompany', company=> {
        var newCompany = new Company(company);
        newCompany.save();
    });

    socket.on('removeCompany', company=> {
        Company.find({ticker_symbol: company.ticker_symbol}).remove(err=> {
          if (err) console.log(err);
          else console.log('removed');
        });
    });

    Company.find({}, (err, companies)=> {
      socket.emit('getCompanies',  companies)
    });

    socket.on('disconnect', ()=> {
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

app.get('/all', (req, res)=> {
    Company.find({}, (err, companies)=> {
      return res.send(companies);
    });
});
