/**
 * Created by Nnamdi on 3/29/2017.
 */
const express = require('express');
const router = express.Router();
const yelpPlaces = require('../modules/yelp-places')
const auth = require('../config/auth.js')
const mongoose = require('mongoose');
const User = mongoose.model('User');
const FoodTruck = mongoose.model('FoodTruck');
const Pin = mongoose.model('Pin');
const CheckIn = mongoose.model('CheckIn');
const Review = mongoose.model('Review');

router.get('/places', function (req, res, next) {

    yelpPlaces.places(req.query).then(function (response) {
        res.send(response);
    });
});

router.get('/users', function (req, res, next) {
    User.find(function (err, users) {
        if (err) { return next(err); }

        res.json(users);
    });
});

//get all food trucks including yelp trucks and pinned trucks
router.get('/allFoodTrucks', function (req, res, next) {

    FoodTruck.find(function (err, foodTrucks) {
        if (err) { return next(err); }
    })
})

//get all confirmed food trucks that's in our database
router.get('/foodTrucks', function (req, res, next) {
    FoodTruck.find(function (err, foodTrucks) {
        if (err) { return next(err); }

        res.json(foodTrucks);
    });
});

router.get('/foodTruck/:foodTruck', function (req, res) {
    res.json(req.foodTruck);
});

//update a user's settings
router.put('/user/:user', auth, function (req, res, next) {
    User.findById(req.user, function (err, user) {
        if (err) { return next(err); }

        user.username = req.body.username;
        user.firstName = req.body.firstName;
        user.lastName = req.body.lastName;
        user.emailAddress = req.body.emailAddress;
        user.profilePicture = req.body.profilePic;
        user.bio = req.body.bio;

        user.save(function (err, user) {
            if (err) { return next(err); }

            res.json(user);
        });
    });
});

//update a food truck's settings
router.put('/foodTruck/:foodTruck', auth, function (req, res, next) {
    FoodTruck.findById(req.foodTruck, function (err, foodTruck) {
        if (err) { return next(err); }

        foodTruck.username = req.body.username;
        foodTruck.firstName = req.body.firstName;
        foodTruck.lastName = req.body.lastName;
        foodTruck.emailAddress = req.body.emailAddress;
        foodTruck.profilePicture = req.body.profilePic;
        foodTruck.bio = req.body.bio;
        foodTruck.phoneNumber = req.body.phoneNumber;

        foodTruck.save(function (err, foodTruck) {
            if (err) { return next(err); }

            res.json(foodTruck);
        });
    });
});

//create/update food menu
router.post('/foodTruck/:foodTruck/menu', auth, function (req, res, next) {
    FoodTruck.findById(req.foodTruck, function (err, foodTruck) {
        if (err) { return next(err); }

        foodTruck.menu = req.body.menu;

        foodTruck.save(function (err, foodTruck) {
            if (err) { return next(err); }

            res.json(foodTruck);
        });
    });
});

//update food truck location
router.post('/foodTruck/:foodTruck/location', auth, function (req, res, next) {
    FoodTruck.findById(req.foodTruck, function (err, foodTruck) {
        if (err) { return next(err); }

        foodTruck.location = req.body.location;

        foodTruck.save(function (err, foodTruck) {
            if (err) { return next(err); }

            res.json(foodTruck);
        });
    });
});

//add a review to a foodTruck
router.post('/review/:foodTruck', function (req, res, next) {
    var review = new Review(req.body);
    FoodTruck.findById(review.foodTruck, function (err, foodTruck) {
        if (err) { return next(err); }
        foodTruck.reviews.push(review);
        foodTruck.save(function (err, truck) {
            if (err) { return next(err); }
        })
    });
    User.findById(review.user, function (err, user) {
        if (err) { return next(err); }
        user.reviews.push(review);
        user.save(function (err, user) {
            if (err) { return next(err); }
        })
    })
    review.save(function (err, data) {
        if (err) { return next(err); }

        res.json(data);
    });
});

//get all reviews by food truck id
router.get('/reviews/:foodTruck', function (req, res, next) {
    req.foodTruck.populate('reviews', function (err, reviews) {
        if (err) { return next(err); }

        res.json(reviews);
    });
})

//add a pin
router.post('/pin', function (req, res, next) {
    var pin = new Pin(req.body);
    pin.confirmed = false;
    pin.name = req.body.name;
    pin.caption = req.body.caption;
    var location = {
        longtitude: '',
        latitude: '',
        address: {
            street: '',
            city: '',
            state: '',
            zipCode: ''
        }
    };
    pin.location = location;
    pin.yelpFoodTruck = false;
    pin.pinnedFoodTruck = true;
    pin.ctFoodTruck = false;

    pin.save(function (err, pinData) {
        if (err) { return next(err); }

        res.json(pin);
    });
});

//get all pins
router.get('/pins', function (req, res, next) {
    FoodTruck.find(function (err, foodTrucks) {
        if (err) { return next(err); }

        res.json(foodTrucks);
    });
});

//check in to a food truck
router.post('/checkIn/foodTruck/:foodTruck/user/:user', function (req, res, next) {
    var checkIn = new CheckIn(req.body);
    checkIn.date = new Date();
    checkIn.points = req.body.points;
    checkIn.user = req.user;
    checkIn.foodTruck = req.foodTruck;
    FoodTruck.findById(req.foodTruck, function (err, foodTruck) {
        if (err) { return next(err); }

        foodTruck.checkIns.push(checkIn);

        foodTruck.save(function (err, foodTruck) {
            if (err) { return next(err); }
        });
    });
    User.findById(req.user, function (err, user) {
        if (err) { return next(err); }

        user.checkIns.push(checkIn);

        user.save(function (err, user) {
            if (err) { return next(err); }

        });
    });
    checkIn.save(function (err, checkIn) {
        if (err) { return next(err); }

        res.json(checkIn);
    });
});

router.get('/checkIns', function (req, res, next) {
    CheckIn.find(function (err, checkIns) {
        if (err) { return next(err); }

        res.json(checkIns);
    });
});

//confirm a pin by a user
router.put('/pin/:pin/user/:user', auth, function (req, res, next) {
    Pin.findById(req.foodTruck, function (err, pin) {
        if (err) { return next(err); }

        pin.confirmedByUser.push(req.user);

        if (pin.confirmedByUser.length > 1) {
            pin.confirmed = true;
        }

        pin.save(function (err, pin) {
            if (err) { return next(err); }

            res.json(pin);
        });
    });
});

router.get('/upload', function (req, res) {
    console.log(req.query.filename);
    var s3 = new AWS.S3({ signatureVersion: 'v4' });
    var fileName = req.query.filename;
    var fileType = req.query.filetype;
    var s3Params = {
        Bucket: 'cornertruck',
        Key: fileName,
        Expires: 60,
        ContentType: fileType,
        ACL: 'public-read'
    };

    console.log(fileName);

    s3.getSignedUrl('putObject', s3Params, function (err, data) {
        if (err) {
            console.log(err);
            return res.end();
        }
        var returnData = {
            signedRequest: data,
            url: 'https://cornertruck.s3.amazonaws.com/' + fileName
        };
        res.write(JSON.stringify(returnData));
        res.end();
    });
});

router.param('foodTruck', function (req, res, next, id) {
    var query = FoodTruck.findById(id);

    query.exec(function (err, foodTruck) {
        if (err) { return next(err); }
        if (!foodTruck) { return next(new Error('can\'t find food truck')); }

        req.foodTruck = foodTruck;
        return next();
    });
});

router.param('user', function (req, res, next, id) {
    var query = User.findById(id);

    query.exec(function (err, user) {
        if (err) { return next(err); }
        if (!user) { return next(new Error('can\'t find user')); }

        req.user = user;
        return next();
    });
});

router.param('pin', function (req, res, next, id) {
    var query = Pin.findById(id);

    query.exec(function (err, pin) {
        if (err) { return next(err); }
        if (!pin) { return next(new Error('can\'t find pin')); }

        req.pin = pin;
        return next();
    });
});

router.param('checkIn', function (req, res, next, id) {
    var query = CheckIn.findById(id);

    query.exec(function (err, checkIn) {
        if (err) { return next(err); }
        if (!checkIn) { return next(new Error('can\'t find user')); }

        req.checkIn = checkIn;
        return next();
    });
});

module.exports = router;