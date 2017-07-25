var express = require('express');
var router = express.Router();
var passport = require('passport');
var jwt = require('express-jwt');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('User');
var FoodTruck = mongoose.model('FoodTruck');

var auth = jwt({ secret: 'SECRET', userProperty: 'payload'});

router.post('/signup', function(req, res, next){
    if(!req.body.username || !req.body.password){
        return res.status(400).json({message: 'Please fill out all fieldsa'});
    }

    var user = new User();

    user.username = req.body.username;

    user.password = user.generateHash(req.body.password);
    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.emailAddress = req.body.emailAddress;

    user.save(function(err){
        if(err){return next(err);}

        return res.json({token: user.generateJWT()});
    });
});

router.post('/signup/foodTruck', function(req, res, next){

    console.log(req.body);
    if(!req.body.username || !req.body.passwords.password ){
        return res.status(400).json({message: 'Please fill out all fields'});
    }

    if(req.body.passwords.password !== req.body.passwords.repeat) {
        console.log("check passwords");
        return res.status(400).json({message: 'Passwords do not match'});
    }

    var foodTruck = new FoodTruck();

    foodTruck.username = req.body.username;
    foodTruck.password = foodTruck.generateHash(req.body.passwords.password);
    foodTruck.emailAddress = '';
    foodTruck.bio = '';
    foodTruck.profilePicture = '';
    foodTruck.online = true;
    foodTruck.rating = 0;
    foodTruck.phoneNumber = '';
    foodTruck.status = 0;
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
    foodTruck.location = location;
    foodTruck.yelpFoodTruck = false;
    foodTruck.pinnedFoodTruck = false;
    foodTruck.ctFoodTruck = true;

    console.log("foodtruck!!", foodTruck);

    foodTruck.save(function(err){
        if(err){return next(err);}
        return res.json({token: foodTruck.generateJWT()});
    });
});

router.post('/login', function(req, res, next){
    if(!req.body.username || !req.body.password){
        return res.status(400).json({ message: 'Please fill out all fields'});
    }

    passport.authenticate('local-login', function(err, user, info){
        if(err) {return next(err);}

        if(user){
            return res.json({token: user.generateJWT()});
        } else {
            return res.status(401).json(info);
        }
    })(req, res, next);
});

router.post('/login/foodTruck', function(req, res, next){
    if(!req.body.username || !req.body.password){
        return res.status(400).json({ message: 'Please fill out all fields'});
    }

    passport.authenticate('local-food-truck-login', function(err, foodTruck, info){
        if(err) {return next(err);}

        if(foodTruck){
            return res.json({token: foodTruck.generateJWT()});
        } else {
            return res.status(401).json(info);
        }
    })(req, res, next);
});

module.exports = router;