'use strict';

const Company = require('../models/companies.js');
const https = require('https');

module.exports = app=>{
    app.route('/')
        .get((req, res, next)=>{
            res.render('index');
        });
}