var express = require('express');
var userRouter = express.Router();
var passport = require('passport');
var User = require('../models/user');
var Plan = require('../models/plan');
var Verify = require('./verify');
var fs = require('fs');
var multiparty = require('multiparty');

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

userRouter.route('/:userId')
  .put(function(req,res,next){
        var form = new multiparty.Form();
      // file upload handling
        form.on('field',function(name,value){
          var body = {};
           if(name==='name' && value){
             body.name = value;
             User.findByIdAndUpdate(req.params.userId, {
            $set: body
            }, {
            new: false
            }, function(err, user) {
                if(err) next(err);
            });
           }else if(name==='password' && value){
             var newPasswordString = value;
             User.findById(req.params.userId).then(
                function(sanitizedUser){
                 if (sanitizedUser){
                    sanitizedUser.setPassword(newPasswordString, function(){
                    sanitizedUser.save();
                    });
                  } 
              },function(err){  
                next(err);
              });
           }
           console.log('normal field / name = '+name+' , value = '+value);
        });
        form.on('part',function(part){
            console.log(part);
             var filename;
             var size;
             if (part.filename) {
                 filename = req.params.userId + '.' + part.filename.split('.').pop();
                 size = part.byteCount;
                 User.findByIdAndUpdate(req.params.userId, {$set: {picture: 'images/' + filename}}, {new: false},
                                        function(err, user) {if(err) next(err);});
             }else{
                 part.resume();
             }    
             console.log("Write Streaming file :"+ filename);
             var writeStream = fs.createWriteStream(__dirname+'/../public/app/images/'+ filename);
             writeStream.filename = filename;
             part.pipe(writeStream);
 
             part.on('data',function(chunk){
                   console.log(filename+' read '+chunk.length + 'bytes');
             });
          
             part.on('end',function(){
                   console.log(filename+' Part read complete');
                   writeStream.end();
             });
        });
 
      // all uploads are completed
        form.on('close',function(){
             res.status(200).send('Upload complete');
        });
     
      // track progress
        form.on('progress',function(byteRead,byteExpected){
             console.log(' Reading total  '+byteRead+'/'+byteExpected);
        });
     
       form.parse(req/*, function(err, fields,files){
         console.log(files);
      
          var body = {};
          if (fields.name[0])
            body.name = fields.name[0];
          if (fields.password[0])
            var newPasswordString = fields.password[0];
          User.findByIdAndUpdate(req.params.userId, {
            $set: body
            }, {
            new: false
            }, function(err, user) {
              User.findById(req.params.userId).then(
                function(sanitizedUser){
                 if (sanitizedUser){
                    sanitizedUser.setPassword(newPasswordString, function(){
                    sanitizedUser.save();
                    });
                  } 
              },function(err){  
                next(err);
              })
          });
       }*/);
    });
userRouter.route('/myplan/:userId')
  .get(Verify.verifyOrdinaryUser, function(req, res, next){
    User.findById(req.params.userId)
    .populate('plans')
    .exec(function(err,user){
              if (err) next(err);
              res.json(user.plans);
            });  
  });
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
        userinfo : {_id: user._id, username: user.username, name: user.name, picture: user.picture}
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
