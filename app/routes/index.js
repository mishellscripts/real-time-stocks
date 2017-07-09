'use strict';

const Company = require('../models/companies.js');
const https = require('https');

module.exports = app=>{
    app.route('/')
        .get((req, res, next)=>{
            res.render('index');
        })
        .post((req, res, next)=> {
            https.get('https://www.quandl.com/api/v3/datasets/WIKI/' + req.body.ticker + '.json?api_key=' + process.env.QUANDL_API_KEY, (result)=> {
                let data = '';    
                result.on('data', chunk=> {
                    data += chunk;
                });
                result.on('end', ()=> {
                    data = JSON.parse(data);
                    if (data.dataset) {
                        Company.findOneAndUpdate({ticker_symbol: req.body.ticker.toUpperCase()}, {
                            ticker_symbol: data.dataset.dataset_code.toUpperCase(),
                            name: data.dataset.name,
                            data_points: data.dataset.data
                        }, {upsert: true}, err=> {
                            if(err) console.log(err.message);
                        });
                    }
			    });
            });
        });
    app.route('/api/:ticker')
        .get((req, res, next)=> {
            Company.findOne({ticker_symbol: req.params.ticker.toUpperCase()}, (err, company)=> {
                if(err) console.log(err.message);
                res.send(company);
            });
        });
    app.route('/all')
        .get((req, res, next)=> {
            Company.find({}, function(err, data) {
				res.send(data);
			});
        });
}