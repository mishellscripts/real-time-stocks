'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Company = new Schema({ 
    ticker_symbol: String,
    name: String
});

module.exports = mongoose.model('Company', Company);