var express = require('express');
var router = express.Router();

/* GET home page. */
//https://scotch.io/tutorials/build-a-restful-api-using-node-and-express-4
router.get('/', function (req, res) {
    res.json({ message: 'Express' });
});

var Bear = require('../model/bear');

router.route('/bears')
    .post(function (req, res) {

        var bear = new Bear();      // create a new instance of the Bear model
        bear.name = req.body.name;  // set the bears name (comes from the request)
        bear.number = req.body.number;
        bear.customtype = req.body.customtype;
        bear.customdate = req.body.customdate;
        bear.customcount = req.body.customcount;
        bear.total = req.body.total;
        // save the bear and check for errors
        bear.save(function (err) {
            if (err)
                res.send(err);

            res.json({ message: 'Bear created!' });
        });

    })
    .get(function (req, res) {
        Bear.find(function (err, bears) {
            if (err)
                res.send(err);

            res.json(bears);
        });
    });

router.route('/bears/summary')
    .get(function (req, res) {

        Bear.aggregate([
            {
                $group: {
                    _id: { number: "$number",customtype:"$customtype" },
                    total: { $last: "$total" },
                    customdate: { $last: "$customdate" },
                    count : { $last: "$customcount" }
                }
            }
        ], function (err, result) {
            if (err)
                res.send(err);
            res.json(result);
        });

    });

router.route('/bears/:bear_number')
    // get the bear with that id (accessed at GET http://localhost:8080/api/bears/:bear_id)
    .get(function (req, res) {
        Bear.find({ 'number': req.params.bear_number }, function (err, bear) {
            if (err)
                res.send(err);
            res.json(bear);
        });
    })
    //.put(function (req, res) {
    //    // use our bear model to find the bear we want
    //    Bear.find({ 'number': req.params.bear_number }, function (err, bear)  {

    //        if (err)
    //            res.send(err);

    //        bear.name = req.body.name;  // update the bears info

    //        // save the bear
    //        bear.save(function (err) {
    //            if (err)
    //                res.send(err);

    //            res.json({ message: 'Bear updated!' });
    //        });

    //    });
    //})
    .delete(function (req, res) {
        Bear.findByIdAndRemove(req.params.bear_id, function (err, bear) {
            if (err) {
                res.send(err);
            }
            res.json({ message: 'Successfully deleted' });
        });
    });
router.route('/bears/latest/:bear_number')
    .get(function (req, res) {
        Bear.findOne({ 'number': req.params.bear_number }, {}, { sort: { 'customdate': -1}}, function (err, bear) {
            if (err)
                res.send(err);
            res.json(bear);
        });
    });
router.route('/bears/charge/:bear_number')
    .post(function (req, res) {
        var newbear = new Bear();      // create a new instance of the Bear model
        newbear.name = req.body.name;  // set the bears name (comes from the request)
        newbear.number = req.body.number;
        newbear.customtype = 0;
        newbear.customdate = req.body.customdate;
        newbear.customcount = req.body.customcount;
        // save the bear and check for errors
        
        Bear.findOne({ 'number': req.params.bear_number }, {}, { sort: { 'customdate': -1 } }, function (err, bear) {
            if (err)
                res.send(err);
            newbear.total = bear.total + newbear.customcount;
            newbear.save(function (err) {
                if (err)
                    res.send(err);

                res.json({ message: 'Bear created!' });
            });
        });
    });


module.exports = router;