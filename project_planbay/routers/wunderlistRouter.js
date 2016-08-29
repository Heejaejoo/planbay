var express = require('express');
var mongoose = require('mongoose');

var request = require('request');
var bodyParser = require('body-parser'); 
var url = require('url');

var User = require('../models/user');
var Verify = require('./verify');

var wunderlistRouter = express.Router();
var config = require('../config');
var wunder_config = config.wunderlist;
wunderlistRouter.use(bodyParser.json());

wunderlistRouter.route('/')
    .get(function(req, res, next) {
        var code = req.query.code;
        console.log(code);
        if(code === undefined) {
            console.log("I don't have code");
            res.redirect('https://www.wunderlist.com/oauth/authorize?client_id='+ wunder_config.client_id +'&redirect_uri=https://planbay-heejae-joo.c9users.io/wunderlists');
        } else {
            console.log("I have code. go get the access token!");
            request({
                url: 'https://www.wunderlist.com/oauth/access_token',
                method: 'POST',
                json: {
                    client_id: wunder_config.client_id,
                    client_secret: wunder_config.client_secret,
                    code: code
                }
            }, function(error, response, body) {
                if(error) {
                    console.log(error);
                } else {
                    //res.json(body.access_token)
                    res.redirect("https://planbay-heejae-joo.c9users.io/app/index.html#/edit?token=" + body.access_token);
                    //res.status(response.statusCode).json(body);
                }
            });
        }
    });
 
 module.exports = wunderlistRouter;