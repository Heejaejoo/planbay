var jwt = require('jsonwebtoken');
var config = require('../config');

exports.getToken = function(user){
    return jwt.sign(user, config.secretKey, {
        expiresIn: 3600
    });
};