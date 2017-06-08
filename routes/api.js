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

router.get('/foodTrucks', function (req, res, next) {
    FoodTruck.find(function (err, foodTrucks) {
        if (err) { return next(err); }

        res.json(foodTrucks);
    });
});

router.get('/foodTruck/:foodTruck', function (req, res) {
    res.json(req.foodTruck);
});

router.post('/user/:user', auth, function (req, res, next) {
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

router.post('/foodTruck/:foodTruck/menu', auth, function (req, res, next) {
    FoodTruck.findById(req.foodTruck, function (err, foodTruck) {
        if (err) { return next(err); }

        //foodTruck.menu = req.body.menu;
        var menu = {
            burger: 'birger'
        };
        var arra = [menu];
        foodTruck.menu = menu;

        foodTruck.save(function (err, foodTruck) {
            if (err) { return next(err); }

            res.json(foodTruck);
        });
    });
});

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

module.exports = router;