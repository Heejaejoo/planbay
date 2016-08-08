var Mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var passportLocalMongoose = require('passport-local-mongoose');
var Schema = Mongoose.Schema;

var User = new Schema({
    username: { type: String},
	email: {
			type: String,
			unique: true
			},
	password: {
		type: String,
		set: function(newValue) {
		return Hash.isHashed(newValue) ? newValue : Hash.generate(newValue);
		}
	},
	OauthId: {
		type:String
	},
	OauthToken: {
		type:String
	},
	admin: {
		type:Boolean,
		default: false
	}
});

//override password change function
User.pre('save', function(next){
	var user = this;
	if(user.isModified('password')){
		bcrypt.hash(user.password, null, null, function(err, hash){
			if (err){
				next();
			}
			user.password = hash;
			next();
		});
	}
	next();
});

User.methods.comparePassword = function(attemptedPassword, callback) {
	bcrypt.compare(attemptedPassword, this.password, function(err, isMatch) {
		callback(isMatch);
	});
};

User.plugin(passportLocalMongoose);
module.exports = mongoose.model('User',User);