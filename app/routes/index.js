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
                console.log(req.body.ticker);
                let data = '';    
                result.on('data', chunk=> {
                    data += chunk;
                });
                result.on('end', ()=> {
                    data = JSON.parse(data);
                    if (data.dataset) {
                        Company.findOneAndUpdate({ticker_symbol: req.body.ticker}, {
                            ticker_symbol: data.dataset.dataset_code,
                            name: data.dataset.name,
                            data_points: data.dataset.data
                        }, {upsert: true}, err=> {
                            if(err) console.log(err.message);
                        });
                    }
			    });
            });
        });
    app.route('/all')
        .get((req, res, next)=> {
            Company.find({}, function(err, data) {
				res.send(data);
			});
        });
}