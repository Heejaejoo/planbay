var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Plans = require('../models/plans');
var Verify = require('./verify');

var planRouter = express.Router();
planRouter.use(bodyParser.json());
//parsing the body and convert to JSON
planRouter.route('/')
    .get(function(req,res,next){
        Plans.find({})
            .populate('comments.postedBy')
            .populate('ratings.postedBy')
            .exec(function(err, plan) {
                if(err) throw err;
                res.json(plan);
            });
    })
    .post(function(req,res,next){
        Plans.create(req.body, function(err, plan) {
            if(err) return next(err);
            console.log("Plan created!");
            var id = plan._id;
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            });
            res.end('Added the plan with id: ' + id);
        })
    })
    .delete(function(req,res,next){
        //collection becomes empty
        Plans.remove({}, function(err, resp) {
            if(err) throw err;
            //resp : how many dishes are deleted
            res.json(resp);
        });
    });
/*
dishRouter.route('/:planId')
    .get(function(req,res,next){
        Dishes.findById(req.params.dishId)
            .populate('comments.postedBy')
            .exec(function(err, dish) {
                if(err) throw err;
                res.json(dish);
            });
    })
    .put(Verify.verifyAdmin, function(req,res,next){
        Dishes.findByIdAndUpdate(req.params.dishId, {
            $set: req.body
        }, {
            new: true
            //return updated dish value
        }, function(err, dish) {
            if(err) throw err;
            res.json(dish);
        });
    })
    .delete(Verify.verifyAdmin, function(req,res,next){
        Dishes.findByIdAndRemove(req.params.dishId, function(err, resp){
            if(err) throw err;
            res.json(resp);
        });
    });
*/
module.exports = planRouter;
