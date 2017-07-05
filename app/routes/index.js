'use strict';

const Test = require('../models/test.js');

module.exports = app=>{
    app.route('/')
        .get((req, res, next)=>{
            res.render('index');
        });
    app.route('/:message')
        .get((req, res, next)=> {
            const message = req.params.message;
            var entry = new Test({
                message: message
            })
            entry.save(err=> {
                Test.find({}, function(err, data) {
				res.send(data);
			    })
            })
        });
}