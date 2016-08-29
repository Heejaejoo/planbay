var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Plan = require('../models/plan');
var User = require('../models/user');
var Verify = require('./verify');

var planRouter = express.Router();
planRouter.use(bodyParser.json());
//parsing the body and convert to JSON

//TODO: add query to sort responds
planRouter.route('/')
    .get(Verify.verifyOrdinaryUser, function(req,res,next){
		Plan.find({})
            .populate('postedBy')
            .populate('comments.postedBy')
            .populate('ratings.postedBy')
            .exec(function(err, plan) {
                if(err) throw err;
                res.json(plan);
            });
    })
    .post(Verify.verifyOrdinaryUser, function(req,res,next){
    	console.log("posting");
    	req.body.postedBy = req.decoded._id;
        Plan.create(req.body, function(err, plan) {
        	console.log(req.body);
            if(err) {
            	console.log(err);
            	return next(err);
            }
            console.log("Plan created!");
            var id = plan._id; 
            
            User.findById(req.decoded._id, function(err,user){
            	if(err) throw err;
            	user.plans.push(id);
            	user.save(function (err, user) {
            	if (err) throw err;
            	console.log('Update');
        		});
            });
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            });
            res.end('Added the plan with id: ' + id);
        })
    })
    .delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req,res,next){
        //collection becomes empty
        Plan.remove({}, function(err, resp) {
            if(err) throw err;
            //resp : how many plan are deleted
            res.json(resp);
        });
    });
    
planRouter.route('/top8downloads')
    .get(Verify.verifyOrdinaryUser, function(req,res,next){
		Plan.find({})
			.sort({downloads:-1})
			.limit(8)
            .populate('postedBy')
            .exec(function(err, plan) {
                if(err) throw err;
                res.json(plan);
            });
    });
planRouter.route('/top8ratings')
    .get(Verify.verifyOrdinaryUser, function(req,res,next){
		Plan.find({})
			.sort({ratingsAvg:-1})
			.limit(8)
            .populate('postedBy')
            .exec(function(err, plan) {
                if(err) throw err;
                res.json(plan);
            });
    });
    
planRouter.route('/:planId')
    .get(Verify.verifyOrdinaryUser, function(req,res,next){
        Plan.findById(req.params.planId)
            .populate('postedBy')
            .populate('comments.postedBy')
            .populate('ratings.postedBy')
            .exec(function(err, plan) {
                if(err) throw err;
                res.json(plan);
            });
    })
    .put(Verify.verifyOrdinaryUser, function(req,res,next){
		console.log("putting");
        Plan.findByIdAndUpdate(req.params.planId, {
            $set: req.body
        }, {
            new: true
            //return updated plan value
        }, function(err, plan) {
			console.log("putting2");
        	console.log(err);
            if(err) throw err;
            res.json(plan);
        });
    })
    .delete(Verify.verifyOrdinaryUser, function(req,res,next){
    	
        Plan.findByIdAndRemove(req.params.planId, function(err, resp){
            if(err) throw err;
            res.json(resp);
            User.findById(req.decoded._id, function(err,user){
            	if(err) throw err;
            	for(var i=0; i<user.plans.length; i+=1){
            		if(user.plans[i] == req.params.planId){
            			user.plans.splice(i,1);
            		}
            	}
            	user.save(function (err, user) {
            	if (err) throw err;
            	
        		});
            });
        });
    });

planRouter.route('/:planId/comments')
	.get(Verify.verifyOrdinaryUser, function(req,res,next){
		Plan.findById(req.params.planId)
		.populate('comments.postedBy') 
		.exec(function(err, plan){
			if(err) next(err);
			res.json(plan.comments);
		});
	})
	.post(Verify.verifyOrdinaryUser, function(req, res, next){
		Plan.findById(req.params.planId, function(err, plan){
			if(err) {
				next(err)
				};
			req.body.postedBy = req.decoded._id;
			plan.comments.push(req.body);
			plan.commentsNum+=1;
			plan.save(function (err, plan){
				if(err) next(err);
				res.json(plan);
			});
		});
	})
	.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next){
	    Plan.findById(req.params.planId, function(err, plan){
			if(err) next(err);
			plan.comments = [];
			plan.commentsNum = 0;
			plan.save(function (err, result) {
				if(err) next(err);
				res.writeHead(200, {'Content-type': 'text/plain'});
				res.end('Deleted all plancomments!');
			});
		});
	})
	
planRouter.route('/:planId/comments/:commentId')
	.get(Verify.verifyOrdinaryUser, function(req,res,next){
		Plan.findById(req.params.planId)
		.populate('comments.postedBy')
		.exec(function(err, plan){
			if(err) next(err);
			res.json(plan.comments.id(req.params.commentId));
		});
	})
	.put(Verify.verifyOrdinaryUser, function(req, res,next){
		Plan.findById(req.params.planId, function(err, plan){
			if(err) next(err);

			plan.comments.id(req.params.commentId).remove();
//			req.body.postedBy = req.decoded._id;
			plan.comments.push(req.body);
			
			plan.save(function (err, plan) {
				if(err) throw err;
				console.log('Updated Comments!');
				res.json(plan);
			});
		});
	})
	.delete(Verify.verifyOrdinaryUser, function(req, res, next){
		Plan.findById(req.params.planId, function(err,plan){
	/*		if(plan.comments.id(req.params.commentId).postedBy != req.decoded._id){
				var err = new Error('You are not authorized to perform this operation');
				err.status = 403;
				return next(err);	
			}*/
			plan.comments.id(req.params.commentId).remove();
			plan.save(function (err, resp) {
				if(err) throw err;
				res.json(resp);
			});
		});
	});
	
planRouter.route('/:planId/ratings')
	.get(Verify.verifyOrdinaryUser, function(req,res,next){
		Plan.findById(req.params.planId)
		.populate('ratings.postedBy')
		.exec(function(err, plan){
			if(err) next(err);
			res.json(
			    plan.ratings);
		});
	})
	.post(Verify.verifyOrdinaryUser, function(req, res, next){
		Plan.findById(req.params.planId, function(err, plan){
			if(err) next(err);
			req.body.postedBy = req.decoded._id;
			plan.ratings.push(req.body);
			plan.ratingsNum+=1;
			plan.ratingsSum+=req.body.rating;
			plan.ratingsAvg = plan.ratingsSum/plan.ratingsNum;
			plan.save(function (err, plan){
				if(err) next(err);
				console.log('Added Ratings!');
				res.json(plan);
			});
		});
	})
	.delete(Verify.verifyOrdinaryUser,Verify.verifyAdmin, function(req, res, next){
	    Plan.findById(req.params.planId, function(err, plan){
			if(err) next(err);
			plan.ratings = [];
			plan.ratingsNum = 0;
			plan.ratingsSum =0;
			plan.ratingsAvg = 0;
			plan.save(function (err, result) {
				if(err) next(err);
				res.writeHead(200, {'Content-type': 'text/plain'});
				res.end('Deleted all planratings!');
			});
		});
	})

planRouter.route('/:planId/ratings/:ratingId')
	.get(Verify.verifyOrdinaryUser, function(req,res,next){
		Plan.findById(req.params.planId)
		.populate('ratings.postedBy')
		.exec(function(err, plan){
			if(err) next(err);
			res.json(plan.ratings.id(req.params.ratingId));
		});
	})
	.delete(Verify.verifyOrdinaryUser, function(req, res, next){
		Plan.findById(req.params.planId, function(err,plan){
	/*		if(plan.comments.id(req.params.commentId).postedBy != req.decoded._id){
				var err = new Error('You are not authorized to perform this operation');
				err.status = 403;
				return next(err);	
			}*/
			var currentRating = plan.ratings.id(req.params.ratingId);
			plan.ratingsSum -= currentRating.rating;
			plan.ratingsNum -= 1;
			plan.ratingsAvg = plan.ratingsSum/plan.ratingsNum;
			currentRating.remove();
			plan.save(function (err, resp) {
				if(err) throw err;
				res.json(resp);
			});
		});
	});

module.exports = planRouter;
