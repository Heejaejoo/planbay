var express = require('express');
var userRouter = express.Router();
var passport = require('passport');
var User = require('../models/user');
var Verify = require('./verify');

/* GET users listing. */
userRouter.get('/', function(req, res, next) {
  User.find({},function(err, found){
    if(err)
      throw err;
    res.json(found);
  });
});

userRouter.post('/register', function(req, res){
  User.register(new User({username: req.body.username}),
      req.body.password, function(err, user) {
        if(err){
          return res.status(500).json({err:err});
        }
        //cross-check
        //push username
        
        if(req.body.name) {
            user.name = req.body.name;
        }
        
        user.save(function(err, user){
          passport.authenticate('local')(req, res, function() {
            return res.status(200).json({status:'Registration Successful!'});
          });
        });
      });
});

userRouter.put('/:userId', function(req,res,next){
    
        User.findByIdAndUpdate(req.params.userId, {
            $set: req.body
            
        }, {
            new: true
            
        }, function(err, user) {
            if(err) throw err;
            res.json(user);
        });
    });

// userRouter.put('/:userId/', function(req,res,next){
    
//     User.findById(req.params.userId,function(err,sanitizedUser){
//     if (sanitizedUser){
//         sanitizedUser.setPassword(req.body.password, function(){
//             sanitizedUser.save();
//             res.status(200).json({message: 'password reset successful'});
//         });
//     } else {
//         res.status(500).json({message: 'This user does not exist'});
//     }
//     },function(err){
//     console.error(err);
//     })
// });


userRouter.post('/login', function(req, res, next){
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
      var token = Verify.getToken({"username":user.username, "_id":user._id, "admin":user.admin, "name":user.name});

      res.status(200).json({
        status: 'Login successful!',
        success: true,
        token: token,
        userinfo : {_id: user._id, name: user.name, picture: user.picture}
      });
    });
  })(req, res, next);
});

userRouter.get('/logout', function(req, res){
  req.logout();
  res.status(200).json({
    status:'Bye!'
  });
});

userRouter.delete('/',function (req, res, next) {
    User.remove({}, function (err, resp) {
        if (err) next(err);
        res.json(resp);
    });
});

module.exports = userRouter;
