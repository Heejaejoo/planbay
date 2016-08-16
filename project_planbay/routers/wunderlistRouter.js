var express = require('express');
var request = require('request');
var bodyParser = require('body-parser'); 
var url = require('url');


var wunderlistRouter = express.Router();
var config = require('../config');
var wunder_config = config.wunderlist;
wunderlistRouter.use(bodyParser.json());

wunderlistRouter.get('/', function(req, res, next) {
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;
    console.log(query.code);
    if(query.code === undefined && query.token === undefined) {
        console.log("I don't have code");
        res.redirect('https://www.wunderlist.com/oauth/authorize?client_id=' + wunder_config.client_id + '&redirect_uri=https://planbay-heejae-joo.c9users.io/wunderlists/');
    } else if(query.token === undefined) {
        console.log("I have code. go get the access token!");
        request({
            url: 'https://www.wunderlist.com/oauth/access_token',
            method: 'POST',
            json: {
                client_id: wunder_config.client_id,
                client_secret: wunder_config.client_secret,
                code: query.code
            }
        }, function(error, response, body){
            if(error) {
                console.log(error);
            } else {
                res.redirect("https://planbay-heejae-joo.c9users.io/wunderlists/" + "?token=" + body.access_token);
                //res.status(response.statusCode).json(body);
                console.log("get access token!")
            }
        });
    } else {
        res.send("hello");
    }
 });
 
 module.exports = wunderlistRouter;