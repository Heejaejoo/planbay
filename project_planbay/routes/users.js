var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');
var Verify = require('./verify');

/* GET users listing. */
router.get('/', function(req, res, next) {
  User.find({},function(err, found){
    if(err)
      throw err;
    console.log("Users info will be sent to admin user");
    res.json(found);
  });
});
router.post('/register', function(req, res){
  User.register(new User({username: req.body.username, email: req.body.email}),
      req.body.password, function(err, user) {
        if(err){
          return res.status(500).json({err:err});
        }
        //cross-check
        //push username
        
        if(req.body.email){
          user.email = req.body.email;
        }
        
        user.save(function(err, user){
          passport.authenticate('local')(req, res, function() {
            return res.status(200).json({status:'Registration Successful!'});
          });
        });
      });
});
router.post('/login', function(req, res, next){
  passport.authenticate('local', function(err, user, info){
    if(err) {
      return next(err);
    }
    //err not null
    if(!user) {
      return res.status(401).json({
        err: info
      });
    }
    //makes available req to extra func
    req.logIn(user, function(err){
      if(err){
        return res.status(500).json({
          err:'Could not log in user'
        });
      }

      console.log('User in users: ', user);

      //valid user-> could generate token
      var token = Verify.getToken(user);

      res.status(200).json({
        status: 'Login successful!',
        success: true,
        token: token
      });
    });
  })(req, res, next);
});
router.get('/logout', function(req, res){
  req.logout();
  res.status(200).json({
    status:'Bye!'
  });
});

router.delete('/',function (req, res, next) {
    User.remove({}, function (err, resp) {
        if (err) next(err);
        res.json(resp);
    });
});

module.exports = router;
