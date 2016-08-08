var User = require('../models/user');
var jwt = require('jsonwebtoken');
var config = require('../config.js');

exports.getToken = function(user){
    return jwt.sign(user, config.secretKey, {
        expiresIn: 3600
    });
};
exports.verifyOrdinaryUser = function(req, res, next) {
    //check header or url parmas or body
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    //decode token
    if(token) {
        jwt.verify(token, config.secretKey, function(err, decoded){
            if(err) {
                var err = new Error('You are not authenticated!');
                err.status = 401;
                return next(err);
            }else {
                req.decoded = decoded;
                return next();
            }
        });
    } else {
        var err = new Error('No token provided!');
        err.status = 403;
        return next(err);
    }
};
exports.verifyAdmin = function(req, res, next){
    var adminVerify = req.decoded._doc.admin;
    if(adminVerify){
        return next();
    }else {
        var err = new Error('You are not an admin user');
        err.status = 401;
        return next(err);
    }
};