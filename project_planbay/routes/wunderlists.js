var express = require('express');
var request = require('request');
var bodyParser = require('body-parser'); 

var wunderlistRouter = express.Router();
var config = require('../config');
var wunder_config = config.wunderlist;
wunderlistRouter.use(bodyParser.json());

//Lets configure and request

 wunderlistRouter.get('/getcode', function(req, res, next) {
     res.redirect('https://www.wunderlist.com/oauth/authorize?client_id=' + wunder_config.client_id + '&redirect_uri=https://planbay-heejae-joo.c9users.io/wunderlists/');
 });

wunderlistRouter.get('/', function(req, res, next) {
    var url = require('url');
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;
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
            res.json(response.statusCode, body);
        }
    });
 });
 
 module.exports = wunderlistRouter;